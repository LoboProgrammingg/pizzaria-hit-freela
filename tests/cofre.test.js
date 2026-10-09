const test = require('node:test');
const assert = require('node:assert/strict');
const Cofre = require('../admin/cofre.js');

const TOKEN = 'github_pat_EXEMPLO_de_teste_123';
const SENHA = 'abcde-fghjk-mnpqr-stuvw';

test('decifrar com a senha certa devolve o token', async () => {
    const cofre = await Cofre.cifrar(TOKEN, SENHA);
    assert.equal(await Cofre.decifrar(cofre, SENHA), TOKEN);
});

test('o cofre não contém o token em texto puro e sobrevive a virar JSON', async () => {
    const texto = JSON.stringify(await Cofre.cifrar(TOKEN, SENHA));
    assert.ok(!texto.includes('github_pat'));
    assert.ok(!texto.includes(Buffer.from(TOKEN).toString('base64').slice(0, 12)));
    assert.equal(await Cofre.decifrar(JSON.parse(texto), SENHA), TOKEN);
});

test('senha errada é recusada', async () => {
    const cofre = await Cofre.cifrar(TOKEN, SENHA);
    await assert.rejects(Cofre.decifrar(cofre, 'abcde-fghjk-mnpqr-stuvx'), { message: 'SENHA_ERRADA' });
    await assert.rejects(Cofre.decifrar(cofre, ''), { message: 'SENHA_ERRADA' });
});

test('cofre adulterado é recusado', async () => {
    const cofre = await Cofre.cifrar(TOKEN, SENHA);
    const trocado = cofre.dados.slice(0, -4) + (cofre.dados.slice(-4) === 'AAAA' ? 'BBBB' : 'AAAA');
    await assert.rejects(Cofre.decifrar({ ...cofre, dados: trocado }, SENHA), { message: 'SENHA_ERRADA' });
});

test('senha vale com maiúsculas, espaços ou sem hífen', async () => {
    const cofre = await Cofre.cifrar(TOKEN, SENHA);
    assert.equal(await Cofre.decifrar(cofre, ' ABCDE FGHJK mnpqr-stuvw '), TOKEN);
    assert.equal(await Cofre.decifrar(cofre, 'abcdefghjkmnpqrstuvw'), TOKEN);
});

test('cifrar duas vezes dá cofres diferentes (salt e iv novos)', async () => {
    const a = await Cofre.cifrar(TOKEN, SENHA);
    const b = await Cofre.cifrar(TOKEN, SENHA);
    assert.notEqual(a.salt, b.salt);
    assert.notEqual(a.iv, b.iv);
    assert.notEqual(a.dados, b.dados);
});

test('cifrar usa pelo menos 600 mil iterações', async () => {
    assert.ok((await Cofre.cifrar(TOKEN, SENHA)).iter >= 600000);
});

test('gerarSenha tem 2 grupos de 5, sem caracteres que se confundem, e não repete', () => {
    const senhas = new Set();
    for (let i = 0; i < 1000; i++) {
        const senha = Cofre.gerarSenha();
        assert.match(senha, /^[a-hjkmnp-z2-9]{5}-[a-hjkmnp-z2-9]{5}$/);
        senhas.add(senha);
    }
    assert.equal(senhas.size, 1000);
});

test('gerarSenha usa o alfabeto inteiro', () => {
    const vistos = new Set(Array.from({ length: 600 }, () => Cofre.gerarSenha()).join('').replace(/-/g, ''));
    assert.equal(vistos.size, 31);
});

test('normalizar deixa só letras e números em minúsculas', () => {
    assert.equal(Cofre.normalizar(' Pizza-Hit 2026! '), 'pizzahit2026');
    assert.equal(Cofre.normalizar('@#$'), '');
});
