const test = require('node:test');
const assert = require('node:assert/strict');
const GitHub = require('../admin/github.js');
const { iniciar, TOKEN } = require('./servidor.js');

async function ambiente(token = TOKEN) {
    const srv = await iniciar(0);
    const gh = GitHub.criar({ api: srv.api, owner: 'dono', repo: 'repo', branch: 'main', token });
    return { srv, gh, estado: srv.estado };
}
const FOTO = { caminho: 'media/uploads/nova.jpg', base64: Buffer.from('bytes-da-foto').toString('base64') };

test('lerMenu devolve o texto, o menu e o commit atual', async (t) => {
    const { srv, gh, estado } = await ambiente();
    t.after(srv.fechar);
    const lido = await gh.lerMenu();
    assert.equal(lido.commitSha, estado.head);
    assert.equal(lido.texto, estado.ler('menu.json').toString());
    assert.equal(lido.menu.categorias[0].nome, 'Pizzas Salgadas');
});

test('verificar aceita token com permissão de escrita', async (t) => {
    const { srv, gh } = await ambiente();
    t.after(srv.fechar);
    await gh.verificar();
});

test('token errado falha com status 401', async (t) => {
    const { srv, gh } = await ambiente('token-errado');
    t.after(srv.fechar);
    await assert.rejects(gh.verificar(), (erro) => erro instanceof GitHub.Erro && erro.status === 401);
    await assert.rejects(gh.lerMenu(), { status: 401 });
});

test('servidor fora do ar falha com status 0', async () => {
    const gh = GitHub.criar({ api: 'http://127.0.0.1:1/x', owner: 'dono', repo: 'repo', branch: 'main', token: TOKEN });
    await assert.rejects(gh.lerMenu(), { status: 0 });
});

test('publicar cria um único commit com menu.json e as fotos', async (t) => {
    const { srv, gh, estado } = await ambiente();
    t.after(srv.fechar);
    const { texto: textoBase, commitSha: antes } = await gh.lerMenu();
    const novo = textoBase.replace('"Mussarela"', '"Mussarela Nova"');

    const { commitSha } = await gh.publicar({ texto: novo, textoBase, fotos: [FOTO], mensagem: 'Painel: teste' });

    assert.equal(estado.head, commitSha);
    assert.equal(estado.commits.get(commitSha).pai, antes);
    assert.equal(estado.commits.get(commitSha).mensagem, 'Painel: teste');
    assert.equal(estado.ler('menu.json').toString(), novo);
    assert.equal(estado.ler('media/uploads/nova.jpg').toString(), 'bytes-da-foto');
    assert.equal(estado.chamadas.filter(c => c.startsWith('PATCH')).length, 1);
});

test('publicar recusa com 409 quando o menu remoto mudou desde a leitura', async (t) => {
    const { srv, gh, estado } = await ambiente();
    t.after(srv.fechar);
    const { texto: textoBase } = await gh.lerMenu();
    estado.commitExterno({ 'menu.json': '{"outro": true}' });
    const headExterno = estado.head;

    await assert.rejects(gh.publicar({ texto: textoBase + ' ', textoBase, fotos: [], mensagem: 'x' }), { status: 409 });
    assert.equal(estado.head, headExterno);
});

test('publicar segue em cima de commit externo que não tocou no menu', async (t) => {
    const { srv, gh, estado } = await ambiente();
    t.after(srv.fechar);
    const { texto: textoBase } = await gh.lerMenu();
    estado.commitExterno({ 'index.html': 'site novo' });
    const headExterno = estado.head;

    const { commitSha } = await gh.publicar({ texto: textoBase + ' ', textoBase, fotos: [], mensagem: 'x' });

    assert.equal(estado.commits.get(commitSha).pai, headExterno);
    assert.equal(estado.ler('index.html').toString(), 'site novo');
    assert.equal(estado.ler('menu.json').toString(), textoBase + ' ');
});

test('publicar tenta de novo quando alguém publica no meio do caminho', async (t) => {
    const { srv, gh, estado } = await ambiente();
    t.after(srv.fechar);
    const { texto: textoBase } = await gh.lerMenu();
    let jaFurou = false;
    estado.aoChamar = (rota) => {
        if (rota !== 'POST /git/commits' || jaFurou) return;
        jaFurou = true;
        estado.commitExterno({ 'styles.css': 'css novo' });
    };

    const { commitSha } = await gh.publicar({ texto: textoBase + ' ', textoBase, fotos: [FOTO], mensagem: 'x' });

    assert.equal(estado.head, commitSha);
    assert.equal(estado.ler('styles.css').toString(), 'css novo');
    assert.equal(estado.ler('media/uploads/nova.jpg').toString(), 'bytes-da-foto');
    assert.equal(estado.chamadas.filter(c => c.startsWith('PATCH')).length, 2);
});

test('publicar desiste depois da segunda recusa', async (t) => {
    const { srv, gh, estado } = await ambiente();
    t.after(srv.fechar);
    const { texto: textoBase } = await gh.lerMenu();
    estado.aoChamar = (rota) => { if (rota === 'POST /git/commits') estado.commitExterno({ 'a.txt': String(Math.random()) }); };

    await assert.rejects(gh.publicar({ texto: textoBase + ' ', textoBase, fotos: [], mensagem: 'x' }), { status: 422 });
});

test('publicar o mesmo texto de novo não cria commit nem acusa conflito (resposta perdida no caminho)', async (t) => {
    const { srv, gh, estado } = await ambiente();
    t.after(srv.fechar);
    const { texto: textoBase } = await gh.lerMenu();
    const novo = textoBase + ' ';
    const primeiro = await gh.publicar({ texto: novo, textoBase, fotos: [FOTO], mensagem: 'x' });
    const commits = estado.commits.size;
    const blobs = estado.chamadas.filter(c => c === 'POST /git/blobs').length;

    const segundo = await gh.publicar({ texto: novo, textoBase, fotos: [FOTO], mensagem: 'x' });

    assert.equal(segundo.commitSha, primeiro.commitSha);
    assert.equal(estado.head, primeiro.commitSha);
    assert.equal(estado.commits.size, commits);
    assert.equal(estado.chamadas.filter(c => c === 'POST /git/blobs').length, blobs);
});
