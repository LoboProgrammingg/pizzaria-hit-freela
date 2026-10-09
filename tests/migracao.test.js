// Controle da migração: menu.json tem que reproduzir o cardápio que estava em script.js
// (retrato em fixtures/cardapio-antes.json) sem mudar preço, nome, descrição, foto ou ordem.
const test = require('node:test');
const assert = require('node:assert/strict');
const MenuCore = require('../menu-core.js');
const antes = require('./fixtures/cardapio-antes.json');
const menu = require('../menu.json');

const PARES = [
    ['pizzas-salgadas', 'PIZZAS_SALGADAS', 55],
    ['pizzas-doces', 'PIZZAS_DOCES', 10],
    ['bebidas', 'BEBIDAS', 18],
    ['sucos', 'SUCOS', 11],
    ['cervejas', 'CERVEJAS', 8]
];

test('categorias na mesma ordem do site antigo', () => {
    assert.deepEqual(menu.categorias.map(c => c.id), PARES.map(p => p[0]));
});

for (const [idCategoria, nomeArray, total] of PARES) {
    test(`${idCategoria}: mesmos ${total} itens, na ordem, com os mesmos dados e preços`, () => {
        const itens = menu.categorias.find(c => c.id === idCategoria).itens;
        const antigos = antes[nomeArray];
        assert.equal(antigos.length, total);
        assert.equal(itens.length, total);
        antigos.forEach((antigo, i) => {
            const item = itens[i];
            assert.equal(item.id, antigo.id);
            assert.equal(item.nome, antigo.name);
            assert.equal(item.descricao, antigo.description, antigo.name);
            assert.equal(item.imagem, antigo.image, antigo.name);
            assert.equal(item.disponivel, true);
            assert.deepEqual(item.opcoes, antigo.options, antigo.name);
            if (antigo.prices) assert.deepEqual(MenuCore.precosDe(menu, item), antigo.prices, antigo.name);
            else assert.equal(item.preco, antigo.price, antigo.name);
        });
    });
}

test('bordas com os mesmos nomes e preços', () => {
    const resumo = (lista) => lista.map(b => [b.nome, b.preco]);
    assert.deepEqual(resumo(MenuCore.bordas(menu)), resumo(antes.BORDAS));
});

test('dados da loja iguais', () => {
    assert.equal(menu.loja.whatsapp, antes.CONFIG.whatsapp);
    assert.equal(menu.loja.endereco, antes.CONFIG.endereco);
});

test('aberto/fechado igual à regra antiga em todas as horas da semana', () => {
    for (let dia = 4; dia <= 10; dia++) {
        for (let hora = 0; hora < 24; hora++) {
            const data = new Date(2026, 9, dia, hora, 30);
            const regraAntiga = data.getDay() !== antes.CONFIG.diaSemanaFechado
                && hora >= antes.CONFIG.horarioAbertura && hora < antes.CONFIG.horarioFechamento;
            assert.equal(MenuCore.estaAberto(menu.loja, data), regraAntiga, data.toString());
        }
    }
});

test('menu.json passa na validação', () => {
    assert.deepEqual(MenuCore.validarMenu(menu), []);
});

test('sabores por faixa de preço', () => {
    const sabores = menu.categorias.flatMap(c => c.itens);
    const contagem = Object.fromEntries(menu.faixas.map(f => [f.nome, sabores.filter(i => i.faixa === f.id).length]));
    assert.deepEqual(contagem, {
        'Tradicionais': 27, 'Especiais': 13, 'Premium': 9, 'Super Premium': 3, 'Doces': 9, 'A classificar': 3
    });
});

test('as 3 salgadas sem faixa definida ficam em "A classificar"', () => {
    const faixa = menu.faixas.find(f => f.nome === 'A classificar');
    const nomes = menu.categorias[0].itens.filter(i => i.faixa === faixa.id).map(i => i.nome);
    assert.deepEqual(nomes, ['Brócolis com Berinjela', 'Suíça', 'Peito de Peru']);
});
