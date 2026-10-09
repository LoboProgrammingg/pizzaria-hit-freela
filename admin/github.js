/**
 * Cliente da API do GitHub usado pelo painel: lê menu.json e publica um commit
 * com o menu novo e as fotos (API Git Data, sem forçar a branch).
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.GitHub = api;
})(typeof self !== 'undefined' ? self : this, function () {
    // status 0 = sem conexão; 409 = menu mudou em outro lugar; os demais são o status HTTP.
    class Erro extends Error {
        constructor(status, mensagem) {
            super(mensagem);
            this.status = status;
        }
    }

    function criar({ api, owner, repo, branch, token }) {
        const base = `${api}/repos/${owner}/${repo}`;
        const BRUTO = 'application/vnd.github.raw+json';

        async function chamar(metodo, caminho, corpo, aceitar = 'application/vnd.github+json') {
            let resposta;
            try {
                // no-store: a API manda max-age=60 e o navegador devolveria um head antigo.
                resposta = await fetch(base + caminho, {
                    method: metodo,
                    cache: 'no-store',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: aceitar,
                        'X-GitHub-Api-Version': '2022-11-28',
                        ...(corpo ? { 'Content-Type': 'application/json' } : {})
                    },
                    body: corpo ? JSON.stringify(corpo) : undefined
                });
            } catch (erro) {
                throw new Erro(0, 'Sem conexão');
            }
            if (!resposta.ok) throw new Erro(resposta.status, `GitHub respondeu ${resposta.status}`);
            return aceitar === BRUTO ? resposta.text() : resposta.json();
        }

        const head = async () => (await chamar('GET', `/git/ref/heads/${branch}`)).object.sha;
        const menuEm = (commit) => chamar('GET', `/contents/menu.json?ref=${commit}`, null, BRUTO);

        async function verificar() {
            const dados = await chamar('GET', '');
            if (!dados.permissions || !dados.permissions.push) throw new Erro(403, 'Sem permissão para gravar');
        }

        async function lerMenu() {
            const commitSha = await head();
            const texto = await menuEm(commitSha);
            return { texto, menu: JSON.parse(texto), commitSha };
        }

        async function publicar({ texto, textoBase, fotos, mensagem }) {
            let entradas = null;
            for (let tentativa = 1; ; tentativa++) {
                const pai = await head();
                const remoto = await menuEm(pai);
                // Já está lá: a publicação anterior chegou, só a resposta se perdeu no caminho.
                if (remoto === texto) return { commitSha: pai };
                if (remoto !== textoBase) throw new Erro(409, 'O cardápio foi alterado em outro lugar');
                if (!entradas) {
                    entradas = [{ path: 'menu.json', mode: '100644', type: 'blob', content: texto }];
                    for (const foto of fotos) {
                        const blob = await chamar('POST', '/git/blobs', { content: foto.base64, encoding: 'base64' });
                        entradas.push({ path: foto.caminho, mode: '100644', type: 'blob', sha: blob.sha });
                    }
                }
                const arvoreBase = (await chamar('GET', `/git/commits/${pai}`)).tree.sha;
                const arvore = await chamar('POST', '/git/trees', { base_tree: arvoreBase, tree: entradas });
                const commit = await chamar('POST', '/git/commits', { message: mensagem, tree: arvore.sha, parents: [pai] });
                try {
                    await chamar('PATCH', `/git/refs/heads/${branch}`, { sha: commit.sha, force: false });
                    return { commitSha: commit.sha };
                } catch (erro) {
                    // 422 = alguém publicou no meio do caminho; refaz uma vez em cima do head novo.
                    if (erro.status !== 422 || tentativa === 2) throw erro;
                }
            }
        }

        return { verificar, lerMenu, publicar };
    }

    return { criar, Erro };
});
