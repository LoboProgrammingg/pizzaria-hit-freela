const test = require('node:test');
const assert = require('node:assert/strict');
const MenuCore = require('../menu-core.js');

function menuBase() {
    return {
        versao: 1,
        loja: { whatsapp: '5565981572829', endereco: 'Rua A, 1', abre: '18:00', fecha: '23:00', diaFechado: 1 },
        borda: { preco: 19, recheios: ['Cream Cheese', 'Catupiry'] },
        faixas: [
            { id: 'tradicionais', nome: 'Tradicionais', precos: [58.9, 75.9, 93.9, 105.9] },
            { id: 'premium', nome: 'Premium', precos: [64.9, 87.9, 102.9, 116.9] }
        ],
        categorias: [
            { id: 'pizzas-salgadas', nome: 'Pizzas Salgadas', tipo: 'pizza', icone: 'pizza', itens: [
                { id: 1, nome: 'Mussarela', descricao: 'Molho e mussarela', faixa: 'tradicionais', imagem: 'm.jpeg', disponivel: true },
                { id: 2, nome: 'Calabresa', descricao: 'Molho e calabresa', faixa: 'tradicionais', imagem: null, disponivel: true },
                { id: 12, nome: 'Frango Especial', descricao: 'Frango', faixa: 'premium', imagem: null, disponivel: true }
            ] },
            { id: 'bebidas', nome: 'Bebidas', tipo: 'simples', icone: 'bebida', itens: [
                { id: 201, nome: 'Coca-Cola 1,5L', preco: 16, imagem: 'c.png', disponivel: true }
            ] }
        ]
    };
}
const detalhes = (antes, depois) => MenuCore.resumirMudancas(antes, depois).map(m => `${m.titulo} | ${m.detalhe}`);

test('slug tira acento, espaço e símbolo', () => {
    assert.equal(MenuCore.slug('Pizzas Salgadas'), 'pizzas-salgadas');
    assert.equal(MenuCore.slug('  Brócolis & Berinjela!  '), 'brocolis-berinjela');
    assert.equal(MenuCore.slug('🍕'), 'item');
});

test('idUnico acrescenta sufixo quando o id já existe', () => {
    assert.equal(MenuCore.idUnico('doces', ['salgadas']), 'doces');
    assert.equal(MenuCore.idUnico('doces', ['doces']), 'doces-2');
    assert.equal(MenuCore.idUnico('doces', ['doces', 'doces-2']), 'doces-3');
});

test('lerPreco aceita vírgula, ponto, R$ e espaços', () => {
    assert.equal(MenuCore.lerPreco('58,90'), 58.9);
    assert.equal(MenuCore.lerPreco('58.9'), 58.9);
    assert.equal(MenuCore.lerPreco('R$ 58,90'), 58.9);
    assert.equal(MenuCore.lerPreco(' 58 '), 58);
    assert.equal(MenuCore.lerPreco('1.234,50'), 1234.5);
    assert.equal(MenuCore.lerPreco(16), 16);
});

test('lerPreco devolve null para vazio, texto e negativo', () => {
    assert.equal(MenuCore.lerPreco(''), null);
    assert.equal(MenuCore.lerPreco('abc'), null);
    assert.equal(MenuCore.lerPreco('-5'), null);
    assert.equal(MenuCore.lerPreco('58,9,0'), null);
    assert.equal(MenuCore.lerPreco(null), null);
});

test('formatarPreco usa vírgula e duas casas', () => {
    assert.equal(MenuCore.formatarPreco(58.9), '58,90');
    assert.equal(MenuCore.formatarPreco(119.2), '119,20');
    assert.equal(MenuCore.formatarPreco(16), '16,00');
});

test('indexar acha item e categoria pelo id', () => {
    const indice = MenuCore.indexar(menuBase());
    assert.equal(indice.get(201).item.nome, 'Coca-Cola 1,5L');
    assert.equal(indice.get(201).categoria.id, 'bebidas');
    assert.equal(indice.get(999), undefined);
});

test('precosDe devolve os 4 preços da faixa do sabor', () => {
    const menu = menuBase();
    assert.deepEqual(MenuCore.precosDe(menu, menu.categorias[0].itens[2]), [64.9, 87.9, 102.9, 116.9]);
});

test('precosDe devolve null para produto simples e para faixa inexistente', () => {
    const menu = menuBase();
    assert.equal(MenuCore.precosDe(menu, menu.categorias[1].itens[0]), null);
    assert.equal(MenuCore.precosDe(menu, { id: 9, nome: 'X', faixa: 'sumiu' }), null);
});

test('bordas começa com Sem Borda e aplica o preço único aos recheios', () => {
    assert.deepEqual(MenuCore.bordas(menuBase()), [
        { id: 'sem-borda', nome: 'Sem Borda', preco: 0 },
        { id: 'cream-cheese', nome: 'Cream Cheese', preco: 19 },
        { id: 'catupiry', nome: 'Catupiry', preco: 19 }
    ]);
});

test('novoIdItem é o maior id de todas as categorias mais um', () => {
    assert.equal(MenuCore.novoIdItem(menuBase()), 202);
    assert.equal(MenuCore.novoIdItem({ categorias: [] }), 1);
});

test('validarMenu aprova o menu base', () => {
    assert.deepEqual(MenuCore.validarMenu(menuBase()), []);
});

test('validarMenu acusa sabor apontando para faixa que não existe', () => {
    const menu = menuBase();
    menu.categorias[0].itens[0].faixa = 'sumiu';
    assert.deepEqual(MenuCore.validarMenu(menu), ['"Mussarela": escolha uma faixa de preço']);
});

test('validarMenu acusa preço zero, nulo e nome vazio', () => {
    const menu = menuBase();
    menu.faixas[0].precos[3] = 0;
    menu.categorias[1].itens[0].preco = null;
    menu.categorias[0].itens[1].nome = '  ';
    assert.deepEqual(MenuCore.validarMenu(menu), [
        'Faixa "Tradicionais": preço Grande inválido',
        'Pizzas Salgadas: tem um item sem nome',
        '"Coca-Cola 1,5L": preço inválido'
    ]);
});

test('validarMenu acusa id de item repetido', () => {
    const menu = menuBase();
    menu.categorias[1].itens[0].id = 1;
    assert.deepEqual(MenuCore.validarMenu(menu), ['"Coca-Cola 1,5L": código repetido (1)']);
});

test('validarMenu acusa horário e WhatsApp inválidos', () => {
    const menu = menuBase();
    menu.loja.abre = '25:00';
    menu.loja.whatsapp = '65 9';
    assert.deepEqual(MenuCore.validarMenu(menu), ['Loja: horário de abrir inválido', 'Loja: WhatsApp inválido']);
});

test('resumirMudancas devolve vazio para menus iguais', () => {
    assert.deepEqual(MenuCore.resumirMudancas(menuBase(), menuBase()), []);
});

test('resumirMudancas conta quantos sabores a mudança de faixa afeta', () => {
    const depois = menuBase();
    depois.faixas[0].precos[3] = 109.9;
    assert.deepEqual(detalhes(menuBase(), depois), ['Tradicionais — Grande | R$ 105,90 → R$ 109,90 · muda 2 sabores']);
});

test('resumirMudancas descreve preço, falta, faixa, nome e foto de item', () => {
    const depois = menuBase();
    depois.categorias[1].itens[0].preco = 17;
    depois.categorias[0].itens[0].disponivel = false;
    depois.categorias[0].itens[1].faixa = 'premium';
    depois.categorias[0].itens[2].nome = 'Frango Top';
    depois.categorias[0].itens[2].imagem = 'media/uploads/f.jpg';
    assert.deepEqual(detalhes(menuBase(), depois), [
        'Mussarela | Em falta, sai do site',
        'Calabresa | Faixa de preço: Tradicionais → Premium',
        'Frango Top | Nome: Frango Especial → Frango Top · Foto nova',
        'Coca-Cola 1,5L | R$ 16,00 → R$ 17,00'
    ]);
});

test('resumirMudancas descreve item, categoria e faixa novos e apagados', () => {
    const depois = menuBase();
    depois.faixas.push({ id: 'gourmet', nome: 'Gourmet', precos: [1, 2, 3, 4] });
    depois.categorias[0].itens.splice(1, 1);
    depois.categorias[0].itens.push({ id: 202, nome: 'Nova', descricao: '', faixa: 'gourmet', imagem: null, disponivel: true });
    depois.categorias.push({ id: 'esfihas', nome: 'Esfihas', tipo: 'simples', icone: 'outro', itens: [] });
    assert.deepEqual(detalhes(menuBase(), depois), [
        'Gourmet | Faixa de preço nova',
        'Esfihas | Categoria nova',
        'Calabresa | Apagado do cardápio',
        'Nova | Novo em Pizzas Salgadas'
    ]);
});

test('resumirMudancas descreve ordem, loja e borda', () => {
    const depois = menuBase();
    depois.categorias[0].itens.reverse();
    depois.loja.fecha = '00:30';
    depois.loja.diaFechado = null;
    depois.borda.preco = 20;
    depois.borda.recheios = ['Catupiry', 'Nutella'];
    assert.deepEqual(detalhes(menuBase(), depois), [
        'Loja | Fecha às: 23:00 → 00:30',
        'Loja | Dia que não abre: Segunda-feira → Abre todo dia',
        'Borda recheada | R$ 19,00 → R$ 20,00',
        'Borda recheada | Recheio novo: Nutella',
        'Borda recheada | Recheio retirado: Cream Cheese',
        'Pizzas Salgadas | Ordem alterada'
    ]);
});

test('estaAberto respeita horário e dia fechado', () => {
    const loja = menuBase().loja;
    assert.equal(MenuCore.estaAberto(loja, new Date(2026, 9, 9, 19, 0)), true);   // sexta 19h
    assert.equal(MenuCore.estaAberto(loja, new Date(2026, 9, 9, 17, 59)), false);
    assert.equal(MenuCore.estaAberto(loja, new Date(2026, 9, 9, 23, 0)), false);
    assert.equal(MenuCore.estaAberto(loja, new Date(2026, 9, 12, 19, 0)), false); // segunda
});

test('estaAberto funciona quando fecha depois da meia-noite', () => {
    const loja = { ...menuBase().loja, fecha: '01:00' };
    assert.equal(MenuCore.estaAberto(loja, new Date(2026, 9, 10, 0, 30)), true);  // sábado 00h30, abriu na sexta
    assert.equal(MenuCore.estaAberto(loja, new Date(2026, 9, 10, 1, 0)), false);
    assert.equal(MenuCore.estaAberto(loja, new Date(2026, 9, 13, 0, 30)), false); // terça 00h30, segunda não abriu
    assert.equal(MenuCore.estaAberto(loja, new Date(2026, 9, 12, 23, 30)), false); // segunda à noite
});

test('estaAberto sem dia fechado abre todos os dias', () => {
    const loja = { ...menuBase().loja, diaFechado: null };
    assert.equal(MenuCore.estaAberto(loja, new Date(2026, 9, 12, 19, 0)), true);
});

test('textoHorario monta os dias a partir do dia fechado', () => {
    assert.deepEqual(MenuCore.textoHorario(menuBase().loja),
        { dias: 'Terça a Domingo', abre: '18h', fecha: '23h', fechado: 'Segunda-feira: Fechado' });
    assert.deepEqual(MenuCore.textoHorario({ abre: '18:30', fecha: '00:00', diaFechado: null }),
        { dias: 'Todos os dias', abre: '18h30', fecha: '0h', fechado: '' });
    assert.equal(MenuCore.textoHorario({ abre: '18:00', fecha: '23:00', diaFechado: 0 }).dias, 'Segunda a Sábado');
});

test('serializar volta ao mesmo menu e põe um item por linha', () => {
    const texto = MenuCore.serializar(menuBase());
    assert.deepEqual(JSON.parse(texto), menuBase());
    const linhasDeItem = texto.split('\n').filter(l => l.includes('"disponivel"'));
    assert.equal(linhasDeItem.length, 4);
    assert.ok(texto.endsWith('}\n'));
});

test('serializar preserva categoria sem itens e campos extras', () => {
    const menu = menuBase();
    menu.categorias.push({ id: 'vazia', nome: 'Vazia', tipo: 'simples', icone: 'outro', itens: [] });
    menu.categorias[0].itens[0].opcoes = ['A', 'B'];
    assert.deepEqual(JSON.parse(MenuCore.serializar(menu)), menu);
});

test('formatarWhatsapp mostra DDD e número sem o 55', () => {
    assert.equal(MenuCore.formatarWhatsapp('5565981572829'), '(65) 98157-2829');
    assert.equal(MenuCore.formatarWhatsapp('6533221100'), '(65) 3322-1100');
    assert.equal(MenuCore.formatarWhatsapp('123'), '123');
});

test('resumirMudancas aguenta preço apagado no meio da edição', () => {
    const depois = menuBase();
    depois.categorias[1].itens[0].preco = null;
    depois.faixas[0].precos[0] = null;
    depois.borda.preco = null;
    assert.deepEqual(detalhes(menuBase(), depois), [
        'Borda recheada | R$ 19,00 → sem preço',
        'Tradicionais — Broto | R$ 58,90 → sem preço · muda 2 sabores',
        'Coca-Cola 1,5L | R$ 16,00 → sem preço'
    ]);
});

test('validarMenu acusa item de categoria simples sem preço e faixa sem nome', () => {
    const menu = menuBase();
    delete menu.categorias[1].itens[0].preco;
    menu.faixas[1].nome = ' ';
    assert.deepEqual(MenuCore.validarMenu(menu), [
        'Tem uma faixa de preço sem nome',
        '"Coca-Cola 1,5L": preço inválido'
    ]);
});

// ── Preço próprio: pizza com os 4 preços nela mesma, fora de qualquer faixa ──
function menuComPrecoProprio() {
    const menu = menuBase();
    const calabresa = menu.categorias[0].itens[1];
    delete calabresa.faixa;
    calabresa.precos = [60, 80, 95, 110];
    return menu;
}

test('precosDe usa o preço próprio da pizza quando ela tem', () => {
    const menu = menuComPrecoProprio();
    assert.deepEqual(MenuCore.precosDe(menu, menu.categorias[0].itens[1]), [60, 80, 95, 110]);
});

test('ehPizza vale para sabor com faixa e com preço próprio, não para produto simples', () => {
    const menu = menuComPrecoProprio();
    assert.equal(MenuCore.ehPizza(menu.categorias[0].itens[0]), true);
    assert.equal(MenuCore.ehPizza(menu.categorias[0].itens[1]), true);
    assert.equal(MenuCore.ehPizza(menu.categorias[1].itens[0]), false);
});

test('validarMenu aprova preço próprio completo e acusa o incompleto', () => {
    const menu = menuComPrecoProprio();
    assert.deepEqual(MenuCore.validarMenu(menu), []);
    menu.categorias[0].itens[1].precos[3] = null;
    assert.deepEqual(MenuCore.validarMenu(menu), ['"Calabresa": preço Grande inválido']);
});

test('resumirMudancas descreve a troca de faixa por preço próprio e a mudança do preço próprio', () => {
    const comProprio = menuComPrecoProprio();
    assert.deepEqual(detalhes(menuBase(), comProprio), ['Calabresa | Faixa de preço: Tradicionais → Preço próprio']);
    const alterado = menuComPrecoProprio();
    alterado.categorias[0].itens[1].precos[0] = 62;
    alterado.categorias[0].itens[1].precos[3] = 115;
    assert.deepEqual(detalhes(comProprio, alterado), ['Calabresa | Broto: R$ 60,00 → R$ 62,00 · Grande: R$ 110,00 → R$ 115,00']);
    assert.deepEqual(detalhes(comProprio, menuBase()), ['Calabresa | Faixa de preço: Preço próprio → Tradicionais']);
});

test('pizza com preço próprio não conta como sabor de nenhuma faixa', () => {
    const depois = menuComPrecoProprio();
    depois.faixas[0].precos[3] = 109.9;
    assert.deepEqual(detalhes(menuComPrecoProprio(), depois), ['Tradicionais — Grande | R$ 105,90 → R$ 109,90 · muda 1 sabor']);
});

test('serializar preserva o preço próprio', () => {
    assert.deepEqual(JSON.parse(MenuCore.serializar(menuComPrecoProprio())), menuComPrecoProprio());
});
