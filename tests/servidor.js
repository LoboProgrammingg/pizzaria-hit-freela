// Servidor local de teste: serve o site sem cache e imita a parte da API do GitHub que o painel usa.
// Nunca fala com o GitHub de verdade. Uso: node tests/servidor.js [porta]
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const RAIZ = path.join(__dirname, '..');
const TOKEN = 'token-de-teste';
// SENHA_TESTE permite abrir o painel local com outra senha (ex.: a mesma que vai para produção).
const SENHA = process.env.SENHA_TESTE || 'abcde-fghjk-mnpqr-stuvw';
const API = '/fake-github';
const REPO = `${API}/repos/dono/repo`;
const TIPOS = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.webp': 'image/webp'
};
const sha = (dado) => crypto.createHash('sha1').update(dado).digest('hex');

function criarEstado() {
    const estado = { blobs: new Map(), arvores: new Map(), commits: new Map(), head: null, chamadas: [] };
    estado.gravarBlob = (conteudo) => {
        const id = sha(conteudo);
        estado.blobs.set(id, Buffer.from(conteudo));
        return id;
    };
    estado.gravarArvore = (arquivos) => {
        const id = sha(JSON.stringify(Object.entries(arquivos).sort()));
        estado.arvores.set(id, arquivos);
        return id;
    };
    estado.gravarCommit = (arvore, pai, mensagem) => {
        const id = sha(arvore + pai + mensagem + estado.commits.size);
        estado.commits.set(id, { arvore, pai, mensagem });
        return id;
    };
    estado.arquivosDe = (commit) => estado.arvores.get(estado.commits.get(commit).arvore);
    estado.ler = (caminho, commit = estado.head) => {
        const blob = estado.arquivosDe(commit)[caminho];
        return blob ? estado.blobs.get(blob) : null;
    };
    // Simula alguém publicando por fora do painel.
    estado.commitExterno = (arquivos) => {
        const novos = { ...estado.arquivosDe(estado.head) };
        for (const [caminho, conteudo] of Object.entries(arquivos)) novos[caminho] = estado.gravarBlob(conteudo);
        estado.head = estado.gravarCommit(estado.gravarArvore(novos), estado.head, 'commit externo');
    };
    const menu = fs.readFileSync(path.join(RAIZ, 'menu.json'));
    estado.head = estado.gravarCommit(estado.gravarArvore({ 'menu.json': estado.gravarBlob(menu) }), null, 'inicial');
    return estado;
}

function lerCorpo(req) {
    return new Promise((resolve) => {
        const partes = [];
        req.on('data', p => partes.push(p));
        req.on('end', () => resolve(partes.length ? JSON.parse(Buffer.concat(partes).toString()) : {}));
    });
}

function json(res, status, corpo) {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(corpo));
}

async function githubFalso(estado, req, res, url) {
    const rota = `${req.method} ${url.pathname.slice(REPO.length)}`;
    estado.chamadas.push(rota);
    if (estado.aoChamar) estado.aoChamar(rota);
    if (req.headers.authorization !== `Bearer ${TOKEN}`) return json(res, 401, { message: 'Bad credentials' });
    const corpo = req.method === 'GET' ? {} : await lerCorpo(req);
    let m;

    if (rota === 'GET ') return json(res, 200, { full_name: 'dono/repo', permissions: { push: true } });
    if (rota === 'GET /git/ref/heads/main') return json(res, 200, { object: { sha: estado.head } });
    if ((m = rota.match(/^GET \/git\/commits\/(\w+)$/)) && estado.commits.has(m[1])) {
        return json(res, 200, { sha: m[1], tree: { sha: estado.commits.get(m[1]).arvore } });
    }
    if (rota === 'GET /contents/menu.json') {
        const conteudo = estado.ler('menu.json', url.searchParams.get('ref') || estado.head);
        res.writeHead(200, { 'Content-Type': 'application/vnd.github.raw+json', 'Cache-Control': 'no-store' });
        return res.end(conteudo);
    }
    if (rota === 'POST /git/blobs') {
        return json(res, 201, { sha: estado.gravarBlob(Buffer.from(corpo.content, corpo.encoding)) });
    }
    if (rota === 'POST /git/trees') {
        const arquivos = { ...estado.arvores.get(corpo.base_tree) };
        for (const e of corpo.tree) arquivos[e.path] = e.sha || estado.gravarBlob(e.content);
        return json(res, 201, { sha: estado.gravarArvore(arquivos) });
    }
    if (rota === 'POST /git/commits') {
        return json(res, 201, { sha: estado.gravarCommit(corpo.tree, corpo.parents[0], corpo.message) });
    }
    if (rota === 'PATCH /git/refs/heads/main') {
        if (estado.commits.get(corpo.sha).pai !== estado.head) return json(res, 422, { message: 'Update is not a fast forward' });
        estado.head = corpo.sha;
        return json(res, 200, { object: { sha: estado.head } });
    }
    return json(res, 404, { message: 'Not Found' });
}

let cofreDeTeste;
async function chaveDeTeste() {
    cofreDeTeste = cofreDeTeste || await require('../admin/cofre.js').cifrar(TOKEN, SENHA);
    return cofreDeTeste;
}

async function arquivo(estado, res, caminho) {
    const cabecalho = (ext) => ({ 'Content-Type': TIPOS[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    if (caminho === '/admin/config.js') {
        res.writeHead(200, cabecalho('.js'));
        return res.end(`window.PAINEL_CONFIG = ${JSON.stringify({ api: API, owner: 'dono', repo: 'repo', branch: 'main' })};\n`);
    }
    if (caminho === '/admin/chave.json') return json(res, 200, await chaveDeTeste());
    // menu.json e fotos publicadas vêm do "repo" falso, para o site refletir o que o painel publicou.
    const publicado = estado.ler(caminho.slice(1));
    if (publicado) {
        res.writeHead(200, cabecalho(path.extname(caminho)));
        return res.end(publicado);
    }
    const local = path.join(RAIZ, path.normalize(caminho.endsWith('/') ? caminho + 'index.html' : caminho));
    if (!local.startsWith(RAIZ) || !fs.existsSync(local) || !fs.statSync(local).isFile()) {
        res.writeHead(404, { 'Cache-Control': 'no-store' });
        return res.end('404');
    }
    res.writeHead(200, cabecalho(path.extname(local)));
    fs.createReadStream(local).pipe(res);
}

function iniciar(porta = 0) {
    const estado = criarEstado();
    const servidor = http.createServer((req, res) => {
        const url = new URL(req.url, 'http://local');
        const tratar = url.pathname.startsWith(REPO)
            ? githubFalso(estado, req, res, url)
            : arquivo(estado, res, decodeURIComponent(url.pathname));
        Promise.resolve(tratar).catch((erro) => json(res, 500, { message: String(erro) }));
    });
    return new Promise((resolve) => servidor.listen(porta, '127.0.0.1', () => resolve({
        url: `http://127.0.0.1:${servidor.address().port}`,
        api: `http://127.0.0.1:${servidor.address().port}${API}`,
        estado,
        fechar: () => new Promise(r => servidor.close(r))
    })));
}

module.exports = { iniciar, TOKEN, SENHA };

if (require.main === module) {
    iniciar(Number(process.argv[2]) || 8766).then(({ url }) => {
        console.log(`Site:   ${url}/`);
        console.log(`Painel: ${url}/admin/   senha: ${process.env.SENHA_TESTE ? 'a de SENHA_TESTE' : SENHA}`);
    });
}
