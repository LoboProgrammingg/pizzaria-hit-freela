/**
 * PIZZARIA HIT — Painel do cardápio
 * Telas e estado. Regras em ../menu-core.js, gravação em github.js, senha em cofre.js.
 * Todo texto vai para a tela por textContent: nada do cardápio vira HTML.
 */
(() => {
    if (location.protocol === 'http:' && !['localhost', '127.0.0.1'].includes(location.hostname)) {
        location.replace('https://' + location.host + location.pathname);
        return;
    }

    const CFG = window.PAINEL_CONFIG;
    const CHAVE_TOKEN = 'painel-hit-token';
    const CHAVE_TRAVA = 'painel-hit-trava';
    const LOGO = '../media/company/logo_no_bg.png';
    const EMOJI = { pizza: '🍕', doce: '🍫', bebida: '🥤', suco: '🧃', cerveja: '🍺', outro: '🍽️' };
    const { TAMANHOS } = MenuCore;
    const app = document.getElementById('app');

    // base = o que está no site; rascunho = o que a pessoa está mudando;
    // fotos = fotos novas ainda não publicadas (caminho → data URL).
    const estado = { gh: null, base: null, textoBase: '', rascunho: null, fotos: {}, fotosNoAr: {}, busca: '', temp: null };

    // ── DOM ──
    function h(tag, props, ...filhos) {
        const el = document.createElement(tag);
        const { value, ...resto } = props || {};
        for (const [nome, v] of Object.entries(resto)) {
            if (v === false || v == null) continue;
            if (nome === 'class') el.className = v;
            else if (nome === 'text') el.textContent = v;
            else if (nome.startsWith('on')) el.addEventListener(nome.slice(2), v);
            else if (nome in el) el[nome] = v;
            else el.setAttribute(nome, v);
        }
        for (const filho of filhos.flat(Infinity)) if (filho != null && filho !== false) el.append(filho);
        if (value != null) el.value = value;
        return el;
    }

    const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
    const todosItens = () => estado.rascunho.categorias.flatMap(c => c.itens);
    const categoriaDe = (id) => estado.rascunho.categorias.find(c => c.id === id);
    const mudancas = () => MenuCore.resumirMudancas(estado.base, estado.rascunho);

    // ── RASCUNHO NO APARELHO ──
    function fotosEmUso() {
        const usados = new Set(todosItens().map(i => i.imagem));
        if (estado.temp) usados.add(estado.temp.item.imagem);
        return Object.fromEntries(Object.entries(estado.fotos).filter(([caminho]) => usados.has(caminho)));
    }

    let relogioGuardar;
    function guardar() {
        clearTimeout(relogioGuardar);
        relogioGuardar = setTimeout(() => {
            estado.fotos = fotosEmUso();
            Armazem.gravar('sessao', { textoBase: estado.textoBase, rascunho: estado.rascunho, fotos: estado.fotos }).catch(() => {});
        }, 250);
    }

    function mudou() {
        guardar();
        atualizarBarra();
    }

    // ── NAVEGAÇÃO ──
    function ir(rota, substituir) {
        const alvo = '#/' + rota;
        if (location.hash === alvo) return render();
        if (substituir) { history.replaceState(null, '', alvo); render(); }
        else location.hash = alvo;
    }

    function redesenhar() {
        const y = window.scrollY;
        render(true);
        window.scrollTo(0, y);
    }

    // ── PEÇAS ──
    function campoPreco(valor, aoMudar, props) {
        const campo = h('input', {
            class: 'campo preco', type: 'text', inputmode: 'decimal', autocomplete: 'off',
            value: typeof valor === 'number' ? MenuCore.formatarPreco(valor) : '', ...props
        });
        const ler = () => { const n = MenuCore.lerPreco(campo.value); return n > 0 ? n : null; };
        campo.classList.toggle('invalido', valor === null);
        campo.addEventListener('focus', () => campo.select());
        campo.addEventListener('input', () => { campo.classList.toggle('invalido', ler() === null); aoMudar(ler()); });
        campo.addEventListener('blur', () => { if (ler() !== null) campo.value = MenuCore.formatarPreco(ler()); });
        return campo;
    }

    function campoTexto(valor, aoMudar, props) {
        const tag = props && props.rows ? 'textarea' : 'input';
        const campo = h(tag, { class: 'campo', type: tag === 'input' ? 'text' : null, autocomplete: 'off', value: valor || '', ...props });
        campo.addEventListener('input', () => aoMudar(campo.value));
        campo.addEventListener('blur', () => { if (campo.value !== campo.value.trim()) { campo.value = campo.value.trim(); aoMudar(campo.value); } });
        return campo;
    }

    const rotulado = (texto, campo) => h('div', null, h('label', { class: 'rotulo', text: texto }), campo);

    function srcDaFoto(caminho) {
        return estado.fotos[caminho] || estado.fotosNoAr[caminho] || '../' + caminho;
    }

    function miniatura(item, categoria) {
        const semFoto = () => h('div', { class: 'sem-foto', text: EMOJI[categoria.icone] || EMOJI.outro });
        if (!item.imagem) return semFoto();
        const img = h('img', { class: 'miniatura' + (/\.png$/i.test(item.imagem) ? ' recorte' : ''), alt: '', loading: 'lazy', src: srcDaFoto(item.imagem) });
        img.addEventListener('error', () => img.replaceWith(semFoto()));
        return img;
    }

    function chave(ligada, rotulo, aoMudar) {
        return h('button', { class: 'chave', role: 'switch', 'aria-checked': String(ligada), 'aria-label': rotulo, onclick: () => aoMudar(!ligada) });
    }

    function abas(lista, ativa, aoEscolher) {
        return h('div', { class: 'abas' }, lista.map(([id, nome, classe]) =>
            h('button', { class: 'aba' + (id === ativa ? ' ativa' : '') + (classe ? ' ' + classe : ''), text: nome, onclick: () => aoEscolher(id) })));
    }

    // ── FOLHA DE BAIXO ──
    let folhaAberta = null;
    let publicando = false; // enquanto publica, nada fecha a folha nem troca de tela
    function fecharFolha() {
        if (publicando) return;
        if (folhaAberta) folhaAberta.remove();
        folhaAberta = null;
    }

    function abrirFolha(...conteudo) {
        fecharFolha();
        folhaAberta = h('div', { class: 'veu', onclick: (e) => { if (e.target === folhaAberta) fecharFolha(); } },
            h('div', { class: 'folha', role: 'dialog', 'aria-modal': 'true' }, conteudo));
        document.body.append(folhaAberta);
    }

    function avisar(titulo, texto) {
        abrirFolha(h('h2', { text: titulo }), h('p', { class: 'guia', text: texto }), h('button', { class: 'botao', text: 'Entendi', onclick: fecharFolha }));
    }

    function confirmar(titulo, texto, rotuloSim, aoConfirmar) {
        abrirFolha(
            h('h2', { text: titulo }), h('p', { class: 'guia', text: texto }),
            h('button', { class: 'botao perigo', text: rotuloSim, onclick: () => { fecharFolha(); aoConfirmar(); } }),
            h('button', { class: 'elo', text: 'Não', onclick: fecharFolha }));
    }

    // ── FOTO ──
    function reduzirFoto(arquivo) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(arquivo);
            const img = new Image();
            img.onload = () => {
                const escala = Math.min(1, 1000 / Math.max(img.naturalWidth, img.naturalHeight));
                const tela = document.createElement('canvas');
                tela.width = Math.round(img.naturalWidth * escala);
                tela.height = Math.round(img.naturalHeight * escala);
                tela.getContext('2d').drawImage(img, 0, 0, tela.width, tela.height);
                URL.revokeObjectURL(url);
                // PNG continua PNG para não perder o fundo transparente das bebidas.
                const png = arquivo.type === 'image/png' || /\.png$/i.test(arquivo.name);
                resolve({ dataUrl: tela.toDataURL(png ? 'image/png' : 'image/jpeg', 0.82), ext: png ? 'png' : 'jpg' });
            };
            img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('NAO_ABRIU')); };
            img.src = url;
        });
    }

    async function trocarFoto(arquivo, item) {
        if (!arquivo) return;
        let foto;
        try {
            foto = await reduzirFoto(arquivo);
        } catch (erro) {
            return avisar('Não consegui usar esse arquivo', 'Escolha uma foto da galeria ou tire uma na hora.');
        }
        const caminho = `media/uploads/${MenuCore.slug(item.nome || 'foto')}-${Date.now()}.${foto.ext}`;
        delete estado.fotos[item.imagem];
        estado.fotos[caminho] = foto.dataUrl;
        item.imagem = caminho;
        mudou();
        redesenhar();
    }

    function campoFoto(item, categoria) {
        const arquivo = h('input', { type: 'file', accept: 'image/*', onchange: () => trocarFoto(arquivo.files[0], item) });
        return h('label', { class: 'foto' },
            item.imagem ? miniatura(item, categoria) : h('div', { class: 'sem-foto', text: '📷' }),
            h('div', null, h('b', { text: item.imagem ? 'Trocar foto' : 'Colocar foto' }), h('small', { text: 'Tira na hora ou pega da galeria' })),
            arquivo);
    }

    // ── TELA: INÍCIO ──
    function telaInicio() {
        const emFalta = todosItens().filter(i => i.disponivel === false).length;
        const grande = (icone, titulo, texto, rota, selo) => h('button', { class: 'grande', onclick: () => ir(rota) },
            h('span', { class: 'icone', text: icone }),
            h('span', { class: 'txt' }, h('b', null, titulo, selo ? h('span', { class: 'selo', text: String(selo) }) : null), h('small', { text: texto })),
            h('span', { class: 'seta', text: '›' }));
        return {
            semTopo: true, estreito: true,
            corpo: [
                h('div', { class: 'ola' }, h('img', { src: LOGO, alt: 'Pizzaria Hit' }), h('h2', { text: 'O que você quer mudar?' })),
                grande('💰', 'Preços', 'Pizzas, bebidas e bordas', 'precos'),
                grande('🍕', 'Sabores e produtos', 'Criar, trocar foto, mudar nome', 'itens'),
                grande('🚫', 'Em falta', 'Tirar do cardápio o que acabou', 'falta', emFalta),
                grande('🏪', 'Loja', 'Horário, WhatsApp, endereço', 'loja'),
                h('a', { class: 'elo', href: '../', target: '_blank', rel: 'noopener', text: 'Ver o site ↗' })
            ]
        };
    }

    // ── TELA: PREÇOS ──
    function telaPrecos(aba) {
        const simples = estado.rascunho.categorias.filter(c => c.tipo === 'simples');
        const lista = [['pizzas', 'Pizzas'], ...simples.map(c => [c.id, c.nome]), ['bordas', 'Bordas']];
        const ativa = lista.some(([id]) => id === aba) ? aba : 'pizzas';
        const conteudo = ativa === 'pizzas' ? precosPizzas() : ativa === 'bordas' ? precosBordas() : precosSimples(categoriaDe(ativa));
        return { titulo: 'Preços', voltar: '', secao: 'precos', corpo: [abas(lista, ativa, id => ir('precos/' + id, true)), ...conteudo] };
    }

    function cartaoFaixa(faixa, indice) {
        const m = estado.rascunho;
        const sabores = todosItens().filter(i => i.faixa === faixa.id).length;
        const nome = h('input', {
            class: 'faixa-nome' + (faixa.nome.trim() ? '' : ' invalido'), type: 'text', maxLength: 30, autocomplete: 'off',
            'aria-label': 'Nome da faixa de preço', value: faixa.nome
        });
        nome.addEventListener('input', () => { faixa.nome = nome.value; nome.classList.toggle('invalido', !faixa.nome.trim()); mudou(); });
        nome.addEventListener('blur', () => { faixa.nome = nome.value = nome.value.trim(); mudou(); });
        return h('div', { class: 'faixa' },
            h('div', { class: 'faixa-topo' }, nome, h('small', { text: plural(sabores, 'sabor', 'sabores') })),
            h('div', { class: 'quatro' }, TAMANHOS.map((tamanho, i) => {
                const id = `faixa-${indice}-${i}`;
                return h('span', null, h('label', { for: id, text: tamanho }),
                    campoPreco(faixa.precos[i], v => { faixa.precos[i] = v; mudou(); }, { id, 'aria-label': `${faixa.nome} ${tamanho}` }));
            })),
            sabores === 0 && h('button', {
                class: 'elo perigo', text: 'Apagar esta faixa',
                onclick: () => { m.faixas.splice(m.faixas.indexOf(faixa), 1); mudou(); redesenhar(); }
            }));
    }

    function precosPizzas() {
        const m = estado.rascunho;
        const fixos = m.categorias.filter(c => c.tipo === 'pizza')
            .flatMap(c => c.itens.filter(i => !MenuCore.ehPizza(i)).map(i => linhaPreco(i, c)));
        const proprios = m.categorias.flatMap(c => c.itens.filter(i => Array.isArray(i.precos)).map(i => linhaItem(i, c)));
        return [
            h('p', { class: 'guia', text: 'Mudou aqui, muda em todas as pizzas da faixa.' }),
            h('div', { class: 'faixas' }, m.faixas.map(cartaoFaixa)),
            h('button', { class: 'botao tracejado', text: '+ Nova faixa de preço', onclick: () => ir('faixa') }),
            h('button', { class: 'elo acao', text: 'Mudar o preço de uma pizza só ›', onclick: () => ir('itens') }),
            proprios.length ? [h('div', { class: 'rotulo-secao', text: 'Pizzas com preço próprio' }), h('div', { class: 'lista' }, proprios)] : null,
            fixos.length ? [h('div', { class: 'rotulo-secao', text: 'Com preço único' }), h('div', { class: 'lista' }, fixos)] : null
        ];
    }

    function linhaPreco(item, categoria) {
        return h('div', { class: 'linha' }, miniatura(item, categoria),
            h('span', { class: 'txt' }, h('b', { text: item.nome })),
            campoPreco(item.preco, v => { item.preco = v; mudou(); }, { 'aria-label': 'Preço de ' + item.nome }));
    }

    function precosSimples(categoria) {
        if (!categoria.itens.length) return [h('p', { class: 'vazio', text: 'Nenhum produto nesta categoria ainda.' })];
        return [
            h('p', { class: 'guia', text: 'Toque no preço e digite o novo.' }),
            h('div', { class: 'lista' }, categoria.itens.map(i => linhaPreco(i, categoria)))
        ];
    }

    function precosBordas() {
        const borda = estado.rascunho.borda;
        const novo = h('input', { class: 'campo', type: 'text', placeholder: 'Novo recheio', maxLength: 30, autocomplete: 'off', 'aria-label': 'Novo recheio' });
        const adicionar = () => {
            const nome = novo.value.trim();
            if (!nome || borda.recheios.some(r => r.toLowerCase() === nome.toLowerCase())) return novo.focus();
            borda.recheios.push(nome);
            mudou();
            redesenhar();
        };
        novo.addEventListener('keydown', e => { if (e.key === 'Enter') adicionar(); });
        return [
            rotulado('Preço da borda recheada (vale para todos os recheios)',
                campoPreco(borda.preco, v => { borda.preco = v; mudou(); }, { class: 'campo preco enorme', 'aria-label': 'Preço da borda recheada' })),
            h('div', null, h('span', { class: 'rotulo', text: 'Recheios que a pizzaria tem' }),
                h('div', { class: 'recheios' }, borda.recheios.map(recheio => h('span', { class: 'recheio' }, recheio,
                    h('button', {
                        text: '✕', 'aria-label': 'Tirar ' + recheio,
                        onclick: () => { borda.recheios.splice(borda.recheios.indexOf(recheio), 1); mudou(); redesenhar(); }
                    }))))),
            h('div', { class: 'junto' }, novo, h('button', { class: 'botao', text: 'Adicionar', onclick: adicionar }))
        ];
    }

    // ── TELA: NOVA FAIXA DE PREÇO ──
    function telaFaixa() {
        const m = estado.rascunho;
        const nova = { nome: '', precos: [null, null, null, null] };
        const erro = h('p', { class: 'erro', role: 'alert' });
        const criar = () => {
            if (!nova.nome.trim()) return (erro.textContent = 'Escreva o nome da faixa.');
            if (nova.precos.some(p => p === null)) return (erro.textContent = 'Preencha os 4 preços.');
            m.faixas.push({ id: MenuCore.idUnico(MenuCore.slug(nova.nome), m.faixas.map(f => f.id)), nome: nova.nome.trim(), precos: nova.precos });
            mudou();
            ir('precos');
        };
        return {
            titulo: 'Nova faixa de preço', voltar: 'precos', secao: 'precos', estreito: true,
            corpo: [
                rotulado('Nome da faixa', campoTexto('', v => { nova.nome = v; }, { placeholder: 'Ex.: Gourmet', maxLength: 30 })),
                h('div', null, h('span', { class: 'rotulo', text: 'Preços desta faixa' }),
                    h('div', { class: 'quatro' }, TAMANHOS.map((tamanho, i) => h('span', null, h('label', { for: 'nova-' + i, text: tamanho }),
                        campoPreco(undefined, v => { nova.precos[i] = v; }, { id: 'nova-' + i }))))),
                h('p', { class: 'guia', text: 'Depois de criar, a faixa aparece para escolher em cada sabor.' }),
                erro,
                h('button', { class: 'botao', text: 'Criar faixa', onclick: criar })
            ]
        };
    }

    // ── TELA: SABORES E PRODUTOS ──
    function textoDoItem(item) {
        const faixa = MenuCore.faixaDe(estado.rascunho, item);
        if (Array.isArray(item.precos)) return 'Preço próprio';
        if (item.faixa !== undefined) return faixa ? faixa.nome : 'Sem faixa de preço';
        return typeof item.preco === 'number' ? 'R$ ' + MenuCore.formatarPreco(item.preco) : 'Sem preço';
    }

    function linhaItem(item, categoria) {
        const falta = item.disponivel === false;
        return h('button', { class: 'linha' + (falta ? ' apagada' : ''), onclick: () => ir('item/' + item.id) },
            miniatura(item, categoria),
            h('span', { class: 'txt' }, h('b', { text: item.nome }),
                h('small', { class: falta ? 'falta' : '', text: falta ? 'Em falta' : textoDoItem(item) })),
            h('span', { class: 'seta', text: '›' }));
    }

    function telaItens(idCategoria) {
        const m = estado.rascunho;
        const categoria = categoriaDe(idCategoria) || m.categorias[0];
        const listaAbas = [...m.categorias.map(c => [c.id, c.nome]), ['+', '+ Nova categoria', 'nova']];
        const barra = abas(listaAbas, categoria && categoria.id, id => id === '+' ? ir('categoria') : ir('itens/' + id, true));
        if (!categoria) return { titulo: 'Sabores e produtos', voltar: '', secao: 'itens', corpo: [barra] };

        const pizza = categoria.tipo === 'pizza';
        const montarLista = () => {
            const filtro = estado.busca.trim().toLowerCase();
            const itens = categoria.itens.filter(i => i.nome.toLowerCase().includes(filtro));
            return itens.length
                ? h('div', { class: 'lista' }, itens.map(i => linhaItem(i, categoria)))
                : h('p', { class: 'vazio', text: filtro ? 'Nada encontrado.' : 'Nada aqui ainda.' });
        };
        let lista = montarLista();
        const busca = h('input', { class: 'campo', type: 'search', placeholder: '🔍  Buscar', autocomplete: 'off', 'aria-label': 'Buscar', value: estado.busca });
        busca.addEventListener('input', () => { estado.busca = busca.value; const nova = montarLista(); lista.replaceWith(nova); lista = nova; });

        return {
            titulo: 'Sabores e produtos', voltar: '', secao: 'itens',
            corpo: [
                barra,
                h('button', { class: 'botao tracejado', text: pizza ? '+ Novo sabor' : '+ Novo produto', onclick: () => ir('item/novo/' + categoria.id) }),
                categoria.itens.length > 8 ? busca : null,
                lista,
                h('div', { class: 'rodape-lista' },
                    h('span', { text: plural(categoria.itens.length, pizza ? 'sabor' : 'item', pizza ? 'sabores' : 'itens') }),
                    h('span', null,
                        categoria.itens.length > 1 ? h('button', { text: 'Mudar a ordem', onclick: () => ir('ordem/' + categoria.id) }) : null,
                        h('button', { text: 'Editar categoria', onclick: () => ir('categoria/' + categoria.id) })))
            ]
        };
    }

    // ── TELA: EDITAR / NOVO ITEM ──
    function telaItem(idOuNovo, idCategoria) {
        const m = estado.rascunho;
        const novo = idOuNovo === 'novo';
        let item, categoria;
        if (novo) {
            categoria = categoriaDe(idCategoria);
            if (!categoria) return null;
            if (!estado.temp) {
                estado.temp = { rota: location.hash, item: { nome: '', descricao: '', imagem: null, ...(categoria.tipo === 'pizza' ? { faixa: null } : { preco: null }) } };
            }
            item = estado.temp.item;
        } else {
            const achado = MenuCore.indexar(m).get(Number(idOuNovo));
            if (!achado) return null;
            ({ item, categoria } = achado);
        }
        const pizza = MenuCore.ehPizza(item);
        const proprio = Array.isArray(item.precos);
        const aoMudar = novo ? () => {} : mudou;
        const voltar = 'itens/' + categoria.id;
        const erro = h('p', { class: 'erro', role: 'alert' });

        const pronto = () => {
            if (!item.nome.trim()) return (erro.textContent = 'Escreva o nome.');
            if (proprio && item.precos.some(p => p === null)) return (erro.textContent = 'Preencha os 4 preços.');
            if (!novo) return ir(voltar);
            if (pizza && !proprio && !item.faixa) return (erro.textContent = 'Escolha a faixa de preço.');
            if (!pizza && item.preco === null) return (erro.textContent = 'Coloque o preço.');
            const criado = { id: MenuCore.novoIdItem(m), nome: item.nome.trim() };
            const descricao = (item.descricao || '').trim();
            if (pizza || descricao) criado.descricao = descricao;
            if (proprio) criado.precos = item.precos; else if (pizza) criado.faixa = item.faixa; else criado.preco = item.preco;
            criado.imagem = item.imagem;
            criado.disponivel = true;
            categoria.itens.push(criado);
            estado.temp = null;
            estado.busca = '';
            mudou();
            ir(voltar);
        };
        const apagar = () => confirmar(`Apagar "${item.nome}"?`, 'Sai do cardápio quando você publicar.', 'Apagar', () => {
            categoria.itens.splice(categoria.itens.indexOf(item), 1);
            mudou();
            ir(voltar);
        });
        const mudarDescricao = (v) => {
            if (v || pizza) item.descricao = v; else delete item.descricao;
            aoMudar();
        };

        // Preço próprio começa com os valores que a pizza já tinha, para a pessoa só ajustar.
        const usarPrecoProprio = () => {
            const atuais = MenuCore.precosDe(m, item);
            item.precos = atuais ? [...atuais] : [null, null, null, null];
            delete item.faixa;
            aoMudar();
            redesenhar();
        };
        const precoOuFaixa = pizza
            ? h('div', null, h('span', { class: 'rotulo', text: 'Preço' }),
                h('div', { class: 'escolha' },
                    m.faixas.map(f => h('button', {
                        class: 'opcao', 'aria-pressed': String(!proprio && item.faixa === f.id),
                        onclick: () => { item.faixa = f.id; delete item.precos; aoMudar(); redesenhar(); }
                    }, h('b', { text: f.nome }), h('small', { text: faixaResumo(f) }))),
                    h('button', { class: 'opcao', 'aria-pressed': String(proprio), onclick: usarPrecoProprio },
                        h('b', { text: 'Preço próprio' }), h('small', { text: 'Só desta pizza' }))),
                proprio ? h('div', { class: 'quatro proprio' }, TAMANHOS.map((tamanho, i) => h('span', null,
                    h('label', { for: 'proprio-' + i, text: tamanho }),
                    campoPreco(novo && item.precos[i] === null ? undefined : item.precos[i], v => { item.precos[i] = v; aoMudar(); }, { id: 'proprio-' + i, 'aria-label': 'Preço ' + tamanho })))) : null)
            : rotulado('Preço', campoPreco(novo && item.preco === null ? undefined : item.preco, v => { item.preco = v; aoMudar(); }, { class: 'campo preco enorme', 'aria-label': 'Preço' }));

        return {
            titulo: novo ? (categoria.tipo === 'pizza' ? 'Novo sabor' : 'Novo produto') : item.nome || 'Sem nome',
            voltar, secao: 'itens', estreito: true,
            corpo: [
                campoFoto(item, categoria),
                rotulado('Nome', campoTexto(item.nome, v => { item.nome = v; aoMudar(); }, { maxLength: 60, placeholder: pizza ? 'Ex.: Quatro Queijos' : 'Ex.: Coca-Cola 2L' })),
                rotulado(pizza ? 'Ingredientes' : 'Descrição (se quiser)',
                    campoTexto(item.descricao, mudarDescricao, { rows: 3, maxLength: 200, placeholder: pizza ? 'Ex.: Molho, mussarela, catupiry…' : '' })),
                precoOuFaixa,
                item.disponivel === false ? h('p', { class: 'aviso', text: 'Este item está marcado como em falta. Para voltar ao site, use a tela Em falta.' }) : null,
                erro,
                h('button', { class: 'botao', text: 'Pronto', onclick: pronto }),
                novo ? null : h('button', { class: 'elo perigo', text: pizza ? 'Apagar este sabor' : 'Apagar este produto', onclick: apagar })
            ]
        };
    }

    function faixaResumo(faixa) {
        const validos = faixa.precos.filter(p => typeof p === 'number');
        if (validos.length < 4) return 'preços incompletos';
        return `${MenuCore.formatarPreco(Math.min(...validos))} a ${MenuCore.formatarPreco(Math.max(...validos))}`;
    }

    // ── TELA: NOVA / EDITAR CATEGORIA ──
    function telaCategoria(id) {
        const m = estado.rascunho;
        if (!id) return telaCategoriaNova();
        const categoria = categoriaDe(id);
        if (!categoria) return null;
        const posicao = m.categorias.indexOf(categoria);
        const mover = (passo) => {
            m.categorias.splice(posicao, 1);
            m.categorias.splice(posicao + passo, 0, categoria);
            mudou();
            redesenhar();
        };
        const erro = h('p', { class: 'erro', role: 'alert' });
        const n = categoria.itens.length;
        return {
            titulo: 'Editar categoria', voltar: 'itens/' + categoria.id, secao: 'itens', estreito: true,
            corpo: [
                rotulado('Nome', campoTexto(categoria.nome, v => { categoria.nome = v; mudou(); }, { maxLength: 40 })),
                h('div', null, h('span', { class: 'rotulo', text: `Posição no site: ${posicao + 1}ª de ${m.categorias.length}` }),
                    h('div', { class: 'dois' },
                        h('button', { class: 'botao tracejado', text: '▲ Subir', disabled: posicao === 0, onclick: () => mover(-1) }),
                        h('button', { class: 'botao tracejado', text: '▼ Descer', disabled: posicao === m.categorias.length - 1, onclick: () => mover(1) }))),
                erro,
                h('button', { class: 'botao', text: 'Pronto', onclick: () => categoria.nome.trim() ? ir('itens/' + categoria.id) : (erro.textContent = 'Escreva o nome.') }),
                h('button', {
                    class: 'elo perigo', text: 'Apagar esta categoria',
                    onclick: () => confirmar(`Apagar "${categoria.nome}"?`,
                        n ? `${plural(n, 'item vai', 'itens vão')} junto. Sai do site quando você publicar.` : 'Sai do site quando você publicar.',
                        'Apagar', () => { m.categorias.splice(posicao, 1); mudou(); ir('itens'); })
                })
            ]
        };
    }

    function telaCategoriaNova() {
        const m = estado.rascunho;
        if (!estado.temp) estado.temp = { rota: location.hash, item: { imagem: null }, nome: '', tipo: null };
        const nova = estado.temp;
        const erro = h('p', { class: 'erro', role: 'alert' });
        const opcao = (tipo, titulo, texto) => h('button', {
            class: 'opcao', 'aria-pressed': String(nova.tipo === tipo), onclick: () => { nova.tipo = tipo; redesenhar(); }
        }, h('b', { text: titulo }), h('small', { text: texto }));
        const criar = () => {
            if (!nova.nome.trim()) return (erro.textContent = 'Escreva o nome.');
            if (!nova.tipo) return (erro.textContent = 'Escolha o que vai ter nela.');
            const id = MenuCore.idUnico(MenuCore.slug(nova.nome), m.categorias.map(c => c.id));
            m.categorias.push({ id, nome: nova.nome.trim(), tipo: nova.tipo, icone: nova.tipo === 'pizza' ? 'pizza' : 'outro', itens: [] });
            estado.temp = null;
            mudou();
            ir('itens/' + id);
        };
        return {
            titulo: 'Nova categoria', voltar: 'itens', secao: 'itens', estreito: true,
            corpo: [
                rotulado('Nome da categoria', campoTexto(nova.nome, v => { nova.nome = v; }, { maxLength: 40, placeholder: 'Ex.: Esfihas' })),
                h('div', null, h('span', { class: 'rotulo', text: 'O que vai ter nela?' }),
                    h('div', { class: 'escolha uma' },
                        opcao('pizza', 'Pizzas', 'Tem tamanho (broto a grande) e faixa de preço'),
                        opcao('simples', 'Outros produtos', 'Um preço só: bebida, sobremesa, esfiha, porção'))),
                erro,
                h('button', { class: 'botao', text: 'Criar', onclick: criar })
            ]
        };
    }

    // ── TELA: MUDAR A ORDEM ──
    function telaOrdem(idCategoria) {
        const categoria = categoriaDe(idCategoria);
        if (!categoria) return null;
        const itens = categoria.itens;
        const mover = (i, passo) => {
            [itens[i], itens[i + passo]] = [itens[i + passo], itens[i]];
            mudou();
            redesenhar();
        };
        return {
            titulo: 'Ordem — ' + categoria.nome, voltar: 'itens/' + categoria.id, secao: 'itens', estreito: true,
            corpo: [
                h('p', { class: 'guia', text: 'A ordem daqui é a ordem do site.' }),
                h('div', { class: 'lista' }, itens.map((item, i) => h('div', { class: 'linha' },
                    miniatura(item, categoria), h('span', { class: 'txt' }, h('b', { text: item.nome })),
                    h('span', { class: 'setas' },
                        h('button', { text: '▲', 'aria-label': 'Subir ' + item.nome, disabled: i === 0, onclick: () => mover(i, -1) }),
                        h('button', { text: '▼', 'aria-label': 'Descer ' + item.nome, disabled: i === itens.length - 1, onclick: () => mover(i, 1) }))))),
                h('button', { class: 'botao', text: 'Pronto', onclick: () => ir('itens/' + categoria.id) })
            ]
        };
    }

    // ── TELA: EM FALTA ──
    function telaFalta() {
        const montar = () => {
            const filtro = estado.busca.trim().toLowerCase();
            const linha = (item, categoria) => h('div', { class: 'linha' + (item.disponivel === false ? ' apagada' : '') },
                miniatura(item, categoria),
                h('span', { class: 'txt' }, h('b', { text: item.nome }), item.disponivel === false ? h('small', { class: 'falta', text: 'Em falta' }) : null),
                chave(item.disponivel !== false, item.nome + ' no cardápio', (ligada) => { item.disponivel = ligada; mudou(); redesenhar(); }));
            const pares = estado.rascunho.categorias.flatMap(c => c.itens.map(i => [i, c]))
                .filter(([i]) => i.nome.toLowerCase().includes(filtro));
            const fora = pares.filter(([i]) => i.disponivel === false);
            const blocos = [];
            if (fora.length) blocos.push(h('div', { class: 'rotulo-secao', text: 'Fora do site agora' }), h('div', { class: 'lista' }, fora.map(p => linha(...p))));
            for (const categoria of estado.rascunho.categorias) {
                const dentro = pares.filter(([i, c]) => c === categoria && i.disponivel !== false);
                if (dentro.length) blocos.push(h('div', { class: 'rotulo-secao', text: categoria.nome }), h('div', { class: 'lista' }, dentro.map(p => linha(...p))));
            }
            return h('div', { class: 'corpo-falta' }, blocos.length ? blocos : h('p', { class: 'vazio', text: 'Nada encontrado.' }));
        };
        let bloco = montar();
        const busca = h('input', { class: 'campo', type: 'search', placeholder: '🔍  Buscar', autocomplete: 'off', 'aria-label': 'Buscar', value: estado.busca });
        busca.addEventListener('input', () => { estado.busca = busca.value; const novo = montar(); bloco.replaceWith(novo); bloco = novo; });
        return {
            titulo: 'Em falta', voltar: '', secao: 'falta', estreito: true,
            corpo: [h('p', { class: 'guia', text: 'Desligou, some do site. Ligou, volta. Nada é apagado.' }), busca, bloco]
        };
    }

    // ── TELA: LOJA ──
    function telaLoja() {
        const loja = estado.rascunho.loja;
        const lerWhatsapp = (texto) => {
            const digitos = texto.replace(/\D/g, '');
            return digitos.length === 10 || digitos.length === 11 ? '55' + digitos : digitos;
        };
        const hora = (campo, rotulo) => rotulado(rotulo, h('input', {
            class: 'campo enorme', type: 'time', value: loja[campo],
            oninput: (e) => { loja[campo] = e.target.value; mudou(); }
        }));
        const dia = h('select', {
            class: 'campo', 'aria-label': 'Dia que não abre', value: loja.diaFechado === null ? '' : String(loja.diaFechado),
            onchange: (e) => { loja.diaFechado = e.target.value === '' ? null : Number(e.target.value); mudou(); }
        }, [null, 0, 1, 2, 3, 4, 5, 6].map(d => h('option', { value: d === null ? '' : String(d), text: MenuCore.diaTexto(d) })));
        const whatsapp = h('input', { class: 'campo', type: 'tel', autocomplete: 'off', value: MenuCore.formatarWhatsapp(loja.whatsapp) });
        whatsapp.addEventListener('input', () => { loja.whatsapp = lerWhatsapp(whatsapp.value); whatsapp.classList.toggle('invalido', !/^\d{10,13}$/.test(loja.whatsapp)); mudou(); });
        whatsapp.addEventListener('blur', () => { whatsapp.value = MenuCore.formatarWhatsapp(loja.whatsapp); });
        return {
            titulo: 'Loja', voltar: '', secao: 'loja', estreito: true,
            corpo: [
                h('div', { class: 'dois' }, hora('abre', 'Abre às'), hora('fecha', 'Fecha às')),
                rotulado('Dia que não abre', dia),
                rotulado('WhatsApp que recebe os pedidos (com DDD)', whatsapp),
                rotulado('Endereço', campoTexto(loja.endereco, v => { loja.endereco = v; mudou(); }, { rows: 3, maxLength: 160 })),
                h('button', {
                    class: 'elo', text: 'Sair deste aparelho',
                    onclick: () => confirmar('Sair deste aparelho?', 'Para entrar de novo vai precisar da senha.', 'Sair', () => sair())
                })
            ]
        };
    }

    const TELAS = { inicio: telaInicio, precos: telaPrecos, faixa: telaFaixa, itens: telaItens, item: telaItem, categoria: telaCategoria, ordem: telaOrdem, falta: telaFalta, loja: telaLoja };

    // ── MOLDURA ──
    let barraEl = null;
    function atualizarBarra() {
        if (!barraEl) return;
        // Formulário de item ou categoria novos ainda não entrou no rascunho: publicar agora deixaria ele de fora.
        const n = estado.temp ? 0 : mudancas().length;
        barraEl.replaceChildren(...(n ? [
            h('span', { text: n === 1 ? '1 mudança ainda não está no site' : `${n} mudanças ainda não estão no site` }),
            h('button', { text: 'Publicar', onclick: abrirConferir })
        ] : []));
        barraEl.classList.toggle('oculto', n === 0);
        app.firstElementChild.classList.toggle('com-barra', n > 0);
        const emDia = app.querySelector('.em-dia');
        if (emDia) emDia.classList.toggle('oculto', n > 0);
    }

    function lateral(secao) {
        const elo = (id, texto, rota) => h('button', { class: id === secao ? 'ativa' : '', text: texto, onclick: () => ir(rota) });
        return h('nav', { class: 'lateral' },
            h('img', { src: LOGO, alt: 'Pizzaria Hit' }),
            elo('precos', '💰  Preços', 'precos'), elo('itens', '🍕  Sabores e produtos', 'itens'),
            elo('falta', '🚫  Em falta', 'falta'), elo('loja', '🏪  Loja', 'loja'),
            h('a', { href: '../', target: '_blank', rel: 'noopener', text: 'Ver o site ↗' }));
    }

    let rotaAnterior = null;
    function render(mesmaTela) {
        if (!estado.rascunho || publicando) return;
        fecharFolha();
        const partes = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
        if (partes[0] === 'publicado') return telaPublicado();
        if (estado.temp && estado.temp.rota !== location.hash) estado.temp = null;
        if (rotaAnterior !== partes[0]) estado.busca = '';
        rotaAnterior = partes[0];

        const fabrica = TELAS[partes[0] || 'inicio'];
        const tela = fabrica && fabrica(...partes.slice(1));
        if (!tela) return ir('', true);

        barraEl = h('div', { class: 'publicar oculto' });
        app.replaceChildren(h('div', { class: 'painel' },
            lateral(tela.secao),
            h('main', { class: 'tela' },
                tela.semTopo ? null : h('header', { class: 'topo' },
                    h('button', { class: 'voltar', text: '‹', 'aria-label': 'Voltar', onclick: () => ir(tela.voltar) }),
                    h('h1', { text: tela.titulo })),
                h('div', {
                    class: 'corpo' + (tela.estreito ? ' estreito' : ''),
                    // Aviso de erro some assim que a pessoa volta a digitar.
                    oninput: (e) => e.currentTarget.querySelectorAll('.erro').forEach(el => { el.textContent = ''; })
                }, tela.corpo, tela.semTopo ? h('p', { class: 'em-dia', text: '✓ O site está atualizado' }) : null)),
            barraEl));
        atualizarBarra();
        if (!mesmaTela) window.scrollTo(0, 0);
    }

    function telaCentro(...conteudo) {
        fecharFolha();
        app.replaceChildren(h('div', { class: 'centro' }, conteudo));
    }

    // ── PUBLICAR ──
    function abrirConferir() {
        const lista = mudancas();
        const erros = MenuCore.validarMenu(estado.rascunho);
        if (erros.length) {
            return abrirFolha(
                h('h2', { text: 'Falta corrigir antes de publicar' }),
                erros.map(texto => h('div', { class: 'mudanca', text: texto })),
                h('button', { class: 'botao', text: 'Voltar e corrigir', onclick: fecharFolha }));
        }
        const erro = h('p', { class: 'erro', role: 'alert' });
        const botao = h('button', { class: 'botao', text: 'Publicar agora' });
        const depois = h('button', { class: 'elo', text: 'Ainda não', onclick: fecharFolha });
        const desfazer = h('button', { class: 'elo perigo', text: 'Desfazer tudo', onclick: desfazerTudo });
        botao.addEventListener('click', () => publicar(lista, botao, erro, [depois, desfazer]));
        abrirFolha(
            h('h2', { text: 'Colocar no site?' }),
            lista.map(m => h('div', { class: 'mudanca' }, m.titulo, h('small', { text: m.detalhe }))),
            erro, botao, depois, desfazer);
    }

    function desfazerTudo() {
        const n = mudancas().length;
        confirmar('Desfazer tudo?', `${n === 1 ? 'A mudança que ainda não foi publicada some' : `As ${n} mudanças que ainda não foram publicadas somem`}. O site continua como está.`,
            'Desfazer tudo', async () => {
                estado.rascunho = JSON.parse(estado.textoBase);
                estado.fotos = {};
                estado.temp = null;
                clearTimeout(relogioGuardar);
                await Armazem.apagar('sessao').catch(() => {});
                ir('', true);
            });
    }

    function mensagemDoCommit(lista) {
        const titulo = `Painel: ${plural(lista.length, 'mudança', 'mudanças')} no cardápio`;
        return titulo + '\n\n' + lista.slice(0, 40).map(m => `- ${m.titulo}: ${m.detalhe}`).join('\n');
    }

    async function publicar(lista, botao, erro, outrosBotoes) {
        const travar = (sim) => { publicando = sim; for (const b of [botao, ...outrosBotoes]) b.disabled = sim; };
        travar(true);
        botao.textContent = 'Publicando…';
        erro.textContent = '';
        const texto = MenuCore.serializar(estado.rascunho);
        estado.fotos = fotosEmUso();
        const fotos = Object.entries(estado.fotos).map(([caminho, dataUrl]) => ({ caminho, base64: dataUrl.split(',')[1] }));
        try {
            await estado.gh.publicar({ texto, textoBase: estado.textoBase, fotos, mensagem: mensagemDoCommit(lista) });
        } catch (falha) {
            travar(false);
            if (falha.status === 401) return sair('Seu acesso venceu. Suas mudanças continuam guardadas neste aparelho. Peça uma senha nova ao Lobo.');
            if (falha.status === 409) return telaConflito();
            botao.textContent = 'Tentar de novo';
            erro.textContent = falha.status === 0 ? 'Sem internet. Suas mudanças estão guardadas neste aparelho.'
                : falha.status === 403 || falha.status === 404 ? 'Este acesso não tem permissão para mudar o cardápio. Fale com o Lobo.'
                : 'Não deu certo agora. Tente de novo em instantes.';
            return;
        }
        Object.assign(estado.fotosNoAr, estado.fotos);
        estado.fotos = {};
        estado.textoBase = texto;
        estado.base = JSON.parse(texto);
        estado.rascunho = JSON.parse(texto);
        clearTimeout(relogioGuardar);
        await Armazem.gravar('sessao', { textoBase: texto, rascunho: estado.rascunho, fotos: {} }).catch(() => {});
        travar(false);
        ir('publicado');
    }

    function telaPublicado() {
        telaCentro(
            h('div', { class: 'certo', text: '✓' }),
            h('h1', { text: 'Pronto!' }),
            h('p', { text: 'As mudanças aparecem no site em cerca de 1 minuto.' }),
            h('button', { class: 'botao', text: 'Voltar ao início', onclick: () => ir('') }),
            h('a', { class: 'elo', href: '../', target: '_blank', rel: 'noopener', text: 'Ver o site ↗' }));
    }

    function telaConflito() {
        const n = mudancas().length;
        telaCentro(
            h('h1', { text: 'O cardápio foi alterado em outro lugar' }),
            h('p', { text: `Alguém mudou o cardápio fora deste aparelho. ${n === 1 ? 'Sua mudança não pode' : `Suas ${n} mudanças não podem`} ser publicada${n === 1 ? '' : 's'} por cima.` }),
            h('p', { text: 'Se não quiser perder o que fez, fale com o Lobo antes de continuar.' }),
            h('button', {
                class: 'botao perigo', text: 'Descartar e abrir o cardápio atual',
                onclick: async () => { await Armazem.apagar('sessao').catch(() => {}); abrirPainel(localStorage.getItem(CHAVE_TOKEN)); }
            }));
    }

    // ── ENTRAR ──
    const lerTrava = () => JSON.parse(localStorage.getItem(CHAVE_TRAVA) || '{"erros":0,"ate":0}');

    function contarErroDeSenha() {
        const trava = lerTrava();
        trava.erros++;
        if (trava.erros >= 5) trava.ate = Date.now() + Math.min(30000 * 2 ** (trava.erros - 5), 5 * 60000); // teto de 5 minutos
        localStorage.setItem(CHAVE_TRAVA, JSON.stringify(trava));
    }

    function telaEntrar(aviso) {
        const senha = h('input', {
            class: 'campo', type: 'text', placeholder: 'Senha', autocomplete: 'off', autocapitalize: 'none',
            autocorrect: 'off', 'aria-label': 'Senha', maxLength: 60
        });
        senha.spellcheck = false;
        const erro = h('p', { class: 'erro', role: 'alert', text: aviso || '' });
        const botao = h('button', { class: 'botao', text: 'Entrar' });

        let relogio;
        const conferirTrava = () => {
            const falta = Math.ceil((lerTrava().ate - Date.now()) / 1000);
            botao.disabled = falta > 0;
            botao.textContent = falta > 0 ? `Aguarde ${falta} s` : 'Entrar';
            clearInterval(relogio);
            if (falta > 0) relogio = setInterval(conferirTrava, 1000);
        };

        const entrar = async () => {
            if (botao.disabled || !senha.value.trim()) return;
            botao.disabled = true;
            botao.textContent = 'Entrando…';
            erro.textContent = '';
            const falhar = (texto) => { erro.textContent = texto; conferirTrava(); };
            let cofre;
            try {
                const resposta = await fetch('chave.json', { cache: 'no-store' });
                if (resposta.status === 404) return falhar('O painel ainda não foi configurado. Fale com o Lobo.');
                if (!resposta.ok) throw new Error(resposta.status);
                cofre = await resposta.json();
            } catch (e) {
                return falhar('Sem internet. Confira a conexão e tente de novo.');
            }
            let token;
            try {
                token = await Cofre.decifrar(cofre, senha.value);
            } catch (e) {
                contarErroDeSenha();
                return falhar('Senha errada. Confira e tente de novo.');
            }
            try {
                await GitHub.criar({ ...CFG, token }).verificar();
            } catch (e) {
                return falhar(e.status === 0 ? 'Sem internet. Confira a conexão e tente de novo.' : 'Esta senha venceu. Peça uma nova ao Lobo.');
            }
            localStorage.removeItem(CHAVE_TRAVA);
            localStorage.setItem(CHAVE_TOKEN, token);
            clearInterval(relogio);
            abrirPainel(token);
        };
        botao.addEventListener('click', entrar);
        senha.addEventListener('keydown', e => { if (e.key === 'Enter') entrar(); });

        telaCentro(
            h('img', { src: LOGO, alt: 'Pizzaria Hit' }),
            h('h1', { text: 'Painel do cardápio' }),
            h('p', { text: 'Digite a senha para entrar.' }),
            senha, erro, botao);
        conferirTrava();
        senha.focus();
    }

    function sair(aviso) {
        localStorage.removeItem(CHAVE_TOKEN);
        estado.rascunho = null;
        history.replaceState(null, '', location.pathname);
        telaEntrar(aviso);
    }

    // ── ABRIR ──
    function usarSessao(sessao) {
        estado.textoBase = sessao.textoBase;
        estado.base = JSON.parse(sessao.textoBase);
        estado.rascunho = sessao.rascunho;
        estado.fotos = sessao.fotos || {};
    }

    async function abrirPainel(token) {
        estado.gh = GitHub.criar({ ...CFG, token });
        telaCentro(h('p', { text: 'Abrindo o cardápio…' }));
        const sessao = await Armazem.ler('sessao').catch(() => null);
        const pendentes = sessao ? MenuCore.resumirMudancas(JSON.parse(sessao.textoBase), sessao.rascunho).length : 0;
        let remoto;
        try {
            remoto = await estado.gh.lerMenu();
        } catch (erro) {
            if (erro.status === 401) return sair('Seu acesso venceu. Peça uma senha nova ao Lobo.');
            if (!sessao) {
                return telaCentro(
                    h('h1', { text: 'Não consegui abrir o cardápio' }),
                    h('p', { text: erro.status === 0 ? 'Confira a internet e tente de novo.' : 'Tente de novo em instantes. Se continuar, fale com o Lobo.' }),
                    h('button', { class: 'botao', text: 'Tentar de novo', onclick: () => abrirPainel(token) }));
            }
        }
        const jaPublicado = remoto && sessao && MenuCore.serializar(sessao.rascunho) === remoto.texto;
        if (!remoto) usarSessao(sessao);                                   // sem internet: segue no rascunho guardado
        else if (jaPublicado) usarSessao({ textoBase: remoto.texto, rascunho: remoto.menu, fotos: {} });
        else if (pendentes && sessao.textoBase !== remoto.texto) { usarSessao(sessao); return telaConflito(); }
        else if (pendentes) usarSessao(sessao);
        else usarSessao({ textoBase: remoto.texto, rascunho: remoto.menu, fotos: {} });
        render();
    }

    window.addEventListener('hashchange', () => render());
    const token = localStorage.getItem(CHAVE_TOKEN);
    if (token) abrirPainel(token); else telaEntrar();
})();
