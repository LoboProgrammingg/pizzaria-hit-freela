/**
 * PIZZARIA HIT — regras do cardápio (menu.json)
 * Funções puras usadas pelo site, pelo painel e pelos testes.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.MenuCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
    const TAMANHOS = ['Broto', 'Pequena', 'Média', 'Grande'];
    const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

    // ── TEXTO E PREÇO ──
    function slug(texto) {
        const s = String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '')
            .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        return s || 'item';
    }

    function idUnico(base, existentes) {
        if (!existentes.includes(base)) return base;
        let n = 2;
        while (existentes.includes(`${base}-${n}`)) n++;
        return `${base}-${n}`;
    }

    function lerPreco(texto) {
        if (typeof texto === 'number') return Number.isFinite(texto) && texto >= 0 ? texto : null;
        if (typeof texto !== 'string') return null;
        let s = texto.replace(/R\$/i, '').replace(/\s/g, '');
        if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
        if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
        return Math.round(parseFloat(s) * 100) / 100;
    }

    function formatarPreco(n) {
        return n.toFixed(2).replace('.', ',');
    }

    function formatarWhatsapp(digitos) {
        const n = digitos.length > 11 && digitos.startsWith('55') ? digitos.slice(2) : digitos;
        if (n.length < 10) return digitos;
        return `(${n.slice(0, 2)}) ${n.slice(2, -4)}-${n.slice(-4)}`;
    }

    const reais = (n) => typeof n === 'number' ? 'R$ ' + formatarPreco(n) : 'sem preço';
    const precoValido = (n) => typeof n === 'number' && Number.isFinite(n) && n > 0;

    // ── CONSULTAS ──
    function todosItens(menu) {
        return menu.categorias.flatMap(c => c.itens);
    }

    function indexar(menu) {
        const indice = new Map();
        for (const categoria of menu.categorias) {
            for (const item of categoria.itens) indice.set(item.id, { item, categoria });
        }
        return indice;
    }

    function faixaDe(menu, item) {
        return item.faixa ? menu.faixas.find(f => f.id === item.faixa) : undefined;
    }

    // Pizza tira os 4 preços da faixa, ou dela mesma quando tem preço próprio.
    function precosDe(menu, item) {
        if (Array.isArray(item.precos)) return item.precos;
        const faixa = faixaDe(menu, item);
        return faixa ? faixa.precos : null;
    }

    const ehPizza = (item) => item.faixa !== undefined || Array.isArray(item.precos);

    function bordas(menu) {
        return [{ id: 'sem-borda', nome: 'Sem Borda', preco: 0 }]
            .concat(menu.borda.recheios.map(nome => ({ id: slug(nome), nome, preco: menu.borda.preco })));
    }

    function novoIdItem(menu) {
        return todosItens(menu).reduce((maior, i) => Math.max(maior, i.id), 0) + 1;
    }

    // Um item por linha, para o histórico do repo mostrar só o que mudou.
    function serializar(menu) {
        const linha = (o) => JSON.stringify(o);
        const bloco = (lista, recuo) => lista.length
            ? '[\n' + lista.map(o => `${recuo}  ${linha(o)}`).join(',\n') + `\n${recuo}]`
            : '[]';
        const categorias = menu.categorias.map(({ itens, ...cabecalho }) =>
            `    ${linha(cabecalho).slice(0, -1)},"itens":${bloco(itens, '    ')}}`);
        return '{\n'
            + `  "versao": ${linha(menu.versao)},\n`
            + `  "loja": ${linha(menu.loja)},\n`
            + `  "borda": ${linha(menu.borda)},\n`
            + `  "faixas": ${bloco(menu.faixas, '  ')},\n`
            + `  "categorias": [\n${categorias.join(',\n')}\n  ]\n`
            + '}\n';
    }

    // ── VALIDAÇÃO ──
    function validarMenu(menu) {
        const erros = [];
        const { loja, borda } = menu;
        if (!HORA.test(loja.abre)) erros.push('Loja: horário de abrir inválido');
        if (!HORA.test(loja.fecha)) erros.push('Loja: horário de fechar inválido');
        if (!/^\d{10,13}$/.test(loja.whatsapp)) erros.push('Loja: WhatsApp inválido');
        if (!precoValido(borda.preco)) erros.push('Borda recheada: preço inválido');

        for (const faixa of menu.faixas) {
            if (!faixa.nome.trim()) erros.push('Tem uma faixa de preço sem nome');
            TAMANHOS.forEach((tamanho, i) => {
                if (!precoValido(faixa.precos[i])) erros.push(`Faixa "${faixa.nome}": preço ${tamanho} inválido`);
            });
        }

        const vistos = new Set();
        for (const categoria of menu.categorias) {
            if (!categoria.nome.trim()) erros.push('Tem uma categoria sem nome');
            for (const item of categoria.itens) {
                if (!item.nome.trim()) { erros.push(`${categoria.nome}: tem um item sem nome`); continue; }
                if (vistos.has(item.id)) erros.push(`"${item.nome}": código repetido (${item.id})`);
                vistos.add(item.id);
                if (Array.isArray(item.precos)) {
                    TAMANHOS.forEach((tamanho, i) => {
                        if (!precoValido(item.precos[i])) erros.push(`"${item.nome}": preço ${tamanho} inválido`);
                    });
                } else if (item.faixa !== undefined) {
                    if (!faixaDe(menu, item)) erros.push(`"${item.nome}": escolha uma faixa de preço`);
                } else if (!precoValido(item.preco)) {
                    erros.push(`"${item.nome}": preço inválido`);
                }
            }
        }
        return erros;
    }

    // ── RESUMO DE MUDANÇAS (tela Conferir) ──
    const diaTexto = (d) => d === null ? 'Abre todo dia' : DIAS[d] + (d >= 1 && d <= 5 ? '-feira' : '');

    function mudancasLoja(antes, depois) {
        const campos = [['abre', 'Abre às'], ['fecha', 'Fecha às'], ['diaFechado', 'Dia que não abre'],
            ['whatsapp', 'WhatsApp'], ['endereco', 'Endereço']];
        const texto = (campo, v) => campo === 'diaFechado' ? diaTexto(v) : v;
        return campos.filter(([campo]) => antes[campo] !== depois[campo]).map(([campo, rotulo]) =>
            ({ titulo: 'Loja', detalhe: `${rotulo}: ${texto(campo, antes[campo])} → ${texto(campo, depois[campo])}` }));
    }

    function mudancasBorda(antes, depois) {
        const titulo = 'Borda recheada';
        const lista = [];
        if (antes.preco !== depois.preco) lista.push({ titulo, detalhe: `${reais(antes.preco)} → ${reais(depois.preco)}` });
        depois.recheios.filter(r => !antes.recheios.includes(r)).forEach(r => lista.push({ titulo, detalhe: `Recheio novo: ${r}` }));
        antes.recheios.filter(r => !depois.recheios.includes(r)).forEach(r => lista.push({ titulo, detalhe: `Recheio retirado: ${r}` }));
        return lista;
    }

    function mudancasFaixas(antes, depois) {
        const lista = [];
        const sabores = (id) => todosItens(depois).filter(i => i.faixa === id).length;
        for (const faixa of depois.faixas) {
            const antiga = antes.faixas.find(f => f.id === faixa.id);
            if (!antiga) { lista.push({ titulo: faixa.nome, detalhe: 'Faixa de preço nova' }); continue; }
            if (antiga.nome !== faixa.nome) lista.push({ titulo: faixa.nome, detalhe: `Nome da faixa: ${antiga.nome} → ${faixa.nome}` });
            const n = sabores(faixa.id);
            TAMANHOS.forEach((tamanho, i) => {
                if (antiga.precos[i] === faixa.precos[i]) return;
                lista.push({
                    titulo: `${faixa.nome} — ${tamanho}`,
                    detalhe: `${reais(antiga.precos[i])} → ${reais(faixa.precos[i])} · muda ${n} ${n === 1 ? 'sabor' : 'sabores'}`
                });
            });
        }
        antes.faixas.filter(f => !depois.faixas.some(d => d.id === f.id))
            .forEach(f => lista.push({ titulo: f.nome, detalhe: 'Faixa de preço apagada' }));
        return lista;
    }

    function ordemMudou(idsAntes, idsDepois) {
        const comuns = (ids, outros) => ids.filter(id => outros.includes(id)).join(',');
        return comuns(idsAntes, idsDepois) !== comuns(idsDepois, idsAntes);
    }

    function mudancasCategorias(antes, depois) {
        const lista = [];
        for (const categoria of depois.categorias) {
            const antiga = antes.categorias.find(c => c.id === categoria.id);
            if (!antiga) lista.push({ titulo: categoria.nome, detalhe: 'Categoria nova' });
            else if (antiga.nome !== categoria.nome) lista.push({ titulo: categoria.nome, detalhe: `Nome da categoria: ${antiga.nome} → ${categoria.nome}` });
        }
        for (const antiga of antes.categorias) {
            if (depois.categorias.some(c => c.id === antiga.id)) continue;
            const n = antiga.itens.length;
            lista.push({ titulo: antiga.nome, detalhe: `Categoria apagada com ${n} ${n === 1 ? 'item' : 'itens'}` });
        }
        if (ordemMudou(antes.categorias.map(c => c.id), depois.categorias.map(c => c.id))) {
            lista.push({ titulo: 'Categorias', detalhe: 'Ordem alterada' });
        }
        return lista;
    }

    function mudancasDoItem(antes, depois, antigo, item) {
        const partes = [];
        const nomeFaixa = (menu, i) => Array.isArray(i.precos) ? 'Preço próprio' : (faixaDe(menu, i) || { nome: 'sem faixa' }).nome;
        if (antigo.nome !== item.nome) partes.push(`Nome: ${antigo.nome} → ${item.nome}`);
        if ((antigo.descricao || '') !== (item.descricao || '')) partes.push('Descrição alterada');
        if (antigo.imagem !== item.imagem) partes.push('Foto nova');
        if (antigo.faixa !== item.faixa) partes.push(`Faixa de preço: ${nomeFaixa(antes, antigo)} → ${nomeFaixa(depois, item)}`);
        else if (Array.isArray(antigo.precos) && Array.isArray(item.precos)) {
            TAMANHOS.forEach((tamanho, i) => {
                if (antigo.precos[i] !== item.precos[i]) partes.push(`${tamanho}: ${reais(antigo.precos[i])} → ${reais(item.precos[i])}`);
            });
        }
        if (antigo.preco !== item.preco) partes.push(`${reais(antigo.preco)} → ${reais(item.preco)}`);
        if (antigo.disponivel !== item.disponivel) partes.push(item.disponivel ? 'Volta para o site' : 'Em falta, sai do site');
        return partes;
    }

    function mudancasItens(antes, depois) {
        const lista = [];
        const indiceAntes = indexar(antes);
        const indiceDepois = indexar(depois);
        for (const categoria of antes.categorias) {
            if (!depois.categorias.some(c => c.id === categoria.id)) continue;
            categoria.itens.filter(i => !indiceDepois.has(i.id))
                .forEach(i => lista.push({ titulo: i.nome, detalhe: 'Apagado do cardápio' }));
        }
        for (const categoria of depois.categorias) {
            for (const item of categoria.itens) {
                const antigo = indiceAntes.get(item.id);
                if (!antigo) { lista.push({ titulo: item.nome, detalhe: `Novo em ${categoria.nome}` }); continue; }
                const partes = mudancasDoItem(antes, depois, antigo.item, item);
                if (partes.length) lista.push({ titulo: item.nome, detalhe: partes.join(' · ') });
            }
        }
        for (const categoria of depois.categorias) {
            const antiga = antes.categorias.find(c => c.id === categoria.id);
            if (antiga && ordemMudou(antiga.itens.map(i => i.id), categoria.itens.map(i => i.id))) {
                lista.push({ titulo: categoria.nome, detalhe: 'Ordem alterada' });
            }
        }
        return lista;
    }

    function resumirMudancas(antes, depois) {
        return [
            ...mudancasLoja(antes.loja, depois.loja),
            ...mudancasBorda(antes.borda, depois.borda),
            ...mudancasFaixas(antes, depois),
            ...mudancasCategorias(antes, depois),
            ...mudancasItens(antes, depois)
        ];
    }

    // ── HORÁRIO ──
    const minutos = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3));

    function estaAberto(loja, data) {
        const agora = data.getHours() * 60 + data.getMinutes();
        const abre = minutos(loja.abre);
        const fecha = minutos(loja.fecha);
        const hoje = data.getDay();
        const ontem = (hoje + 6) % 7;
        if (fecha > abre) return hoje !== loja.diaFechado && agora >= abre && agora < fecha;
        if (agora >= abre) return hoje !== loja.diaFechado;
        return agora < fecha && ontem !== loja.diaFechado;
    }

    function textoHorario(loja) {
        const hora = (hhmm) => Number(hhmm.slice(0, 2)) + 'h' + (hhmm.slice(3) === '00' ? '' : hhmm.slice(3));
        const f = loja.diaFechado;
        return {
            dias: f === null ? 'Todos os dias' : `${DIAS[(f + 1) % 7]} a ${DIAS[(f + 6) % 7]}`,
            abre: hora(loja.abre),
            fecha: hora(loja.fecha),
            fechado: f === null ? '' : `${diaTexto(f)}: Fechado`
        };
    }

    return {
        TAMANHOS, slug, idUnico, lerPreco, formatarPreco, formatarWhatsapp, indexar, faixaDe, precosDe, ehPizza, bordas,
        novoIdItem, serializar, validarMenu, resumirMudancas, diaTexto, estaAberto, textoHorario
    };
});
