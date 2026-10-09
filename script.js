/**
 * ============================================
 * PIZZARIA HIT — CARDÁPIO DIGITAL PREMIUM
 * Vanilla JavaScript ES6+
 * ============================================
 */

// ── CONFIG ──
const CONFIG = {
    placeholders: {
        pizza: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23222'  width='200' height='200'/%3E%3Ctext x='100' y='108' text-anchor='middle' fill='%23555' font-size='40'%3E🍕%3C/text%3E%3C/svg%3E",
        pizzaDoce: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23222' width='200' height='200'/%3E%3Ctext x='100' y='108' text-anchor='middle' fill='%23555' font-size='40'%3E🍫%3C/text%3E%3C/svg%3E",
        bebida: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23222' width='200' height='200'/%3E%3Ctext x='100' y='108' text-anchor='middle' fill='%23555' font-size='40'%3E🥤%3C/text%3E%3C/svg%3E",
        suco: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23222' width='200' height='200'/%3E%3Ctext x='100' y='108' text-anchor='middle' fill='%23555' font-size='40'%3E🧃%3C/text%3E%3C/svg%3E",
        cerveja: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23222' width='200' height='200'/%3E%3Ctext x='100' y='108' text-anchor='middle' fill='%23555' font-size='40'%3E🍺%3C/text%3E%3C/svg%3E",
        outro: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23222' width='200' height='200'/%3E%3Ctext x='100' y='108' text-anchor='middle' fill='%23555' font-size='40'%3E🍽️%3C/text%3E%3C/svg%3E"
    }
};

const TAMANHOS = [
    { id: 'broto', nome: 'Broto', fatias: 2, sabores: 1, index: 0 },
    { id: 'pequena', nome: 'Pequena', fatias: 4, sabores: 2, index: 1 },
    { id: 'media', nome: 'Média', fatias: 6, sabores: 2, index: 2 },
    { id: 'grande', nome: 'Grande', fatias: 8, sabores: 3, index: 3 }
];

const ICONES = {
    pizza: { css: 'pizzas', fa: 'fa-pizza-slice', placeholder: 'pizza', emoji: '🍕', titulo: 'Adicionar ao Pedido' },
    doce: { css: 'doces', fa: 'fa-cookie-bite', placeholder: 'pizzaDoce', emoji: '🍫', titulo: 'Adicionar Sobremesa' },
    bebida: { css: 'bebidas', fa: 'fa-glass-water', placeholder: 'bebida', emoji: '🥤', titulo: 'Adicionar Bebida' },
    suco: { css: 'sucos', fa: 'fa-blender', placeholder: 'suco', emoji: '🧃', titulo: 'Adicionar Bebida' },
    cerveja: { css: 'cervejas', fa: 'fa-beer-mug-empty', placeholder: 'cerveja', emoji: '🍺', titulo: 'Adicionar Bebida' },
    outro: { css: 'outro', fa: 'fa-utensils', placeholder: 'outro', emoji: '🍽️', titulo: 'Adicionar ao Pedido' }
};

// ── DADOS (menu.json) ──
let MENU = null;
let INDICE = new Map();
let BORDAS = [];

const Dados = {
    async carregar() {
        const resposta = await fetch('menu.json', { cache: 'no-cache' });
        if (!resposta.ok) throw new Error('menu.json ' + resposta.status);
        MENU = await resposta.json();
        INDICE = MenuCore.indexar(MENU);
        BORDAS = MenuCore.bordas(MENU);
    },
    precos(item) { return MenuCore.precosDe(MENU, item); },
    icone(categoria) { return ICONES[categoria.icone] || ICONES.outro; },
    vendavel(item) {
        if (item.disponivel === false) return false;
        if (!MenuCore.ehPizza(item)) return typeof item.preco === 'number';
        const precos = this.precos(item);
        return !!precos && precos.length === 4 && precos.every(n => typeof n === 'number');
    },
    visiveis(categoria) { return categoria.itens.filter(i => this.vendavel(i)); },
    sabores(categoria) { return this.visiveis(categoria).filter(i => MenuCore.ehPizza(i)); }
};

// ── STATE ──
const AppState = {
    cart: [],
    currentPizza: null,
    currentCategoria: null,
    currentStep: 1,
    selectedSize: null,
    selectedFlavors: [],
    selectedMassa: 'tradicional',
    selectedBorda: null,
    currentDrink: null,
    drinkQty: 1,
    selectedDessertOption: null
};

// ── UTILS ──
const Utils = {
    formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
    isOpen() {
        return MenuCore.estaAberto(MENU.loja, new Date());
    },
    esc(texto) {
        return String(texto).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    },
    generateId() {
        return 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    },
    showToast(msg) {
        let t = document.querySelector('.toast');
        if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
        t.textContent = msg;
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf(t);
            gsap.fromTo(t, { opacity: 0, y: 20, scale: 0.9 }, {
                opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.4)',
                onComplete: () => gsap.to(t, { opacity: 0, y: -10, duration: 0.3, delay: 2, ease: 'power2.in' })
            });
        } else {
            t.style.opacity = '1';
            setTimeout(() => { t.style.opacity = '0'; }, 2500);
        }
    }
};

// ── RENDER ──
const Render = {
    updateStatus() {
        const badge = document.getElementById('status-badge');
        const text = document.getElementById('status-text');
        const isOpen = Utils.isOpen();
        badge.className = 'status-badge ' + (isOpen ? 'open' : 'closed');
        text.textContent = isOpen ? 'Aberto' : 'Fechado';
    },

    renderLoja() {
        const loja = MENU.loja;
        const h = MenuCore.textoHorario(loja);
        const partes = loja.endereco.split(', ').map(Utils.esc);
        const endereco = partes.length > 2 ? partes.slice(0, 2).join(', ') + '<br>' + partes.slice(2).join(', ') : partes.join(', ');
        document.getElementById('info-horario').innerHTML = Utils.esc(`${h.dias}: ${h.abre} às ${h.fecha}`) + (h.fechado ? `<br>${Utils.esc(h.fechado)}` : '');
        document.getElementById('info-endereco').innerHTML = endereco;
        document.getElementById('info-whatsapp').textContent = MenuCore.formatarWhatsapp(loja.whatsapp);
        document.getElementById('hero-hours-text').textContent = `${h.dias} • ${h.abre} – ${h.fecha}`;
    },

    pizzaCard(p, categoria) {
        const icone = Dados.icone(categoria);
        const ph = CONFIG.placeholders[icone.placeholder];
        const precos = Dados.precos(p);
        const priceHTML = precos
            ? `<span>a partir de </span>${Utils.formatCurrency(Math.min(...precos))}`
            : Utils.formatCurrency(p.preco);
        const action = precos ? `App.openPizzaModal(${p.id})` : `App.openProductModal(${p.id})`;
        const nome = Utils.esc(p.nome);
        const imageHTML = p.imagem
            ? `<div class="pizza-card-image"><img src="${Utils.esc(p.imagem)}" alt="${nome}" loading="lazy" onerror="this.src='${ph}'"></div>`
            : `<div class="pizza-card-image no-image"><span class="pizza-placeholder-icon">${icone.emoji}</span></div>`;
        const descHTML = p.descricao ? `<div class="pizza-card-desc">${Utils.esc(p.descricao)}</div>` : '';
        return `<div class="pizza-card" onclick="${action}">
            ${imageHTML}
            <div class="pizza-card-body">
                <div class="pizza-card-name">${nome}</div>
                ${descHTML}
                <div class="pizza-card-price">${priceHTML}</div>
            </div>
        </div>`;
    },

    drinkCard(d, categoria) {
        const ph = CONFIG.placeholders[Dados.icone(categoria).placeholder];
        const nome = Utils.esc(d.nome);
        return `<div class="drink-card" onclick="App.openProductModal(${d.id})">
            <div class="drink-card-image"><img src="${Utils.esc(d.imagem || ph)}" alt="${nome}" loading="lazy" onerror="this.src='${ph}'"></div>
            <div class="drink-card-body">
                <div class="drink-card-name">${nome}</div>
                ${d.descricao ? `<div class="drink-card-desc">${Utils.esc(d.descricao)}</div>` : ''}
                <div class="drink-card-price">${Utils.formatCurrency(d.preco)}</div>
            </div>
        </div>`;
    },

    card(item, categoria) {
        return categoria.tipo === 'pizza' ? this.pizzaCard(item, categoria) : this.drinkCard(item, categoria);
    },

    section(categoria) {
        const itens = Dados.visiveis(categoria);
        if (!itens.length) return '';
        const icone = Dados.icone(categoria);
        const pizza = categoria.tipo === 'pizza';
        const subtitulo = categoria.subtitulo ? `<div class="section-subtitle">${Utils.esc(categoria.subtitulo)}</div>` : '';
        return `<section class="menu-section" id="sec-${Utils.esc(categoria.id)}">
            <div class="section-header">
                <div class="section-icon ${icone.css}"><i class="fas ${icone.fa}"></i></div>
                <div>
                    <div class="section-title">${Utils.esc(categoria.nome)}</div>
                    ${subtitulo}
                </div>
                <span class="section-count">${itens.length} ${pizza ? (itens.length === 1 ? 'sabor' : 'sabores') : (itens.length === 1 ? 'item' : 'itens')}</span>
            </div>
            <div class="product-grid ${pizza ? 'cols-3' : 'cols-2'}">${itens.map(i => this.card(i, categoria)).join('')}</div>
        </section>`;
    },

    renderMenu() {
        document.getElementById('all-sections').innerHTML = MENU.categorias.map(c => this.section(c)).join('');
    },

    renderErroDeCarga() {
        document.getElementById('all-sections').innerHTML = `<div class="menu-erro">
            <i class="fas fa-triangle-exclamation"></i>
            <p>Não foi possível carregar o cardápio.</p>
            <button class="btn-primary" onclick="location.reload()">Tentar de novo</button>
        </div>`;
    },

    renderSizes() {
        const c = document.getElementById('size-options');
        const p = AppState.currentPizza;
        c.innerHTML = TAMANHOS.map(s => `
            <div class="option-card ${AppState.selectedSize?.id===s.id?'selected':''}" onclick="App.selectSize('${s.id}')">
                <div><div class="option-name">${s.nome}</div><div class="option-detail">${s.fatias} fatias • até ${s.sabores} sabor(es)</div></div>
                <div class="option-price">${Utils.formatCurrency(Dados.precos(p)[s.index])}</div>
            </div>`).join('');
    },

    renderFlavors() {
        const c = document.getElementById('flavor-options');
        const all = Dados.sabores(AppState.currentCategoria);
        const si = AppState.selectedSize.index;
        c.innerHTML = all.map(p => {
            const sel = AppState.selectedFlavors.some(f => f.id === p.id);
            return `<div class="flavor-card ${sel?'selected':''}" onclick="App.toggleFlavor(${p.id})">
                <div class="flavor-check"><i class="fas fa-check"></i></div>
                <div class="flavor-info"><div class="flavor-name">${Utils.esc(p.nome)}</div><div class="flavor-desc">${Utils.esc(p.descricao || '')}</div></div>
                <div class="flavor-price">${Utils.formatCurrency(Dados.precos(p)[si])}</div>
            </div>`;
        }).join('');
        const max = AppState.selectedSize.sabores;
        document.getElementById('flavor-info').textContent = `Selecione até ${max} sabor(es). O preço será pelo sabor de maior valor.`;
    },

    renderMassa() {
        const c = document.getElementById('massa-options');
        const massas = [{ id: 'tradicional', nome: 'Tradicional' }, { id: 'fina', nome: 'Fina' }];
        c.innerHTML = massas.map(m => `
            <div class="massa-option ${AppState.selectedMassa===m.id?'selected':''}" onclick="App.selectMassa('${m.id}')">
                <div class="massa-option-name">${m.nome}</div>
                <div class="massa-option-price">Incluso</div>
            </div>`).join('');
    },

    renderBordas() {
        const c = document.getElementById('borda-options');
        c.innerHTML = BORDAS.map(b => `
            <div class="borda-option ${AppState.selectedBorda?.id===b.id?'selected':''}" onclick="App.selectBorda('${b.id}')">
                <div class="borda-option-name">${Utils.esc(b.nome)}</div>
                <div class="borda-option-price">${b.preco > 0 ? '+ '+Utils.formatCurrency(b.preco) : 'Incluso'}</div>
            </div>`).join('');
    },

    updateStepper() {
        document.querySelectorAll('#pizza-stepper .step').forEach((el, i) => {
            const n = i + 1;
            const circle = el.querySelector('.step-circle');
            el.classList.remove('active');
            circle.className = 'step-circle';
            if (n < AppState.currentStep) {
                circle.classList.add('done');
                circle.innerHTML = '<i class="fas fa-check" style="font-size:11px"></i>';
            } else if (n === AppState.currentStep) {
                el.classList.add('active');
                circle.classList.add('active');
                circle.textContent = n;
            } else {
                circle.classList.add('pending');
                circle.textContent = n;
            }
        });
    },

    updateModalTotal() {
        document.getElementById('modal-total').textContent = Utils.formatCurrency(App.calcPizzaPrice());
    },

    renderCart() {
        const c = document.getElementById('cart-items');
        if (!AppState.cart.length) {
            c.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Seu carrinho está vazio</p></div>';
            return;
        }
        c.innerHTML = AppState.cart.map((item, i) => `
            <div class="cart-item">
                <div class="cart-item-info"><div class="cart-item-name">${Utils.esc(item.name)}</div><div class="cart-item-detail">${Utils.esc(item.details)}</div></div>
                <div class="cart-item-right"><div class="cart-item-price">${Utils.formatCurrency(item.price)}</div>
                <button class="cart-remove" onclick="App.removeFromCart(${i})"><i class="fas fa-trash-alt"></i> Remover</button></div>
            </div>`).join('');
    },

    updateCartBadge() {
        const b = document.getElementById('cart-badge');
        const n = AppState.cart.length;
        if (n > 0) {
            b.textContent = n;
            b.classList.add('visible');
            if (typeof gsap !== 'undefined') gsap.fromTo(b, { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
        } else {
            b.classList.remove('visible');
        }
    },

    updateCartTotal() {
        const total = AppState.cart.reduce((s, i) => s + i.price, 0);
        document.getElementById('cart-total').textContent = Utils.formatCurrency(total);
    }
};

// ── APP ──
const App = {
    async init() {
        try {
            await Dados.carregar();
            Render.updateStatus();
            Render.renderLoja();
            Render.renderMenu();
        } catch (erro) {
            console.error(erro);
            Render.renderErroDeCarga();
        }
        this.setupEvents();
        Animations.init();
    },

    setupEvents() {
        // Info toggle
        document.getElementById('info-btn').addEventListener('click', () => {
            const b = document.getElementById('info-banner');
            b.classList.toggle('active');
        });

        // Search
        const input = document.getElementById('search-input');
        const clear = document.getElementById('clear-search');
        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            if (q.length > 0) {
                clear.classList.add('visible');
                this.search(q);
            } else {
                clear.classList.remove('visible');
                this.clearSearch();
            }
        });
        clear.addEventListener('click', () => {
            input.value = '';
            clear.classList.remove('visible');
            this.clearSearch();
        });

        // Cart FAB
        document.getElementById('cart-fab').addEventListener('click', () => this.openCartModal());
        document.getElementById('close-cart').addEventListener('click', () => this.closeModal('cart'));
        document.getElementById('cart-backdrop').addEventListener('click', () => this.closeModal('cart'));

        // Pizza modal
        document.getElementById('close-pizza').addEventListener('click', () => this.closeModal('pizza'));
        document.getElementById('pizza-backdrop').addEventListener('click', () => this.closeModal('pizza'));
        document.getElementById('next-step').addEventListener('click', () => this.nextStep());
        document.getElementById('prev-step').addEventListener('click', () => this.prevStep());

        // Drink modal
        document.getElementById('close-drink').addEventListener('click', () => this.closeModal('drink'));
        document.getElementById('drink-backdrop').addEventListener('click', () => this.closeModal('drink'));
        document.getElementById('drink-qty-minus').addEventListener('click', () => { if (AppState.drinkQty > 1) { AppState.drinkQty--; document.getElementById('drink-qty').textContent = AppState.drinkQty; } });
        document.getElementById('drink-qty-plus').addEventListener('click', () => { AppState.drinkQty++; document.getElementById('drink-qty').textContent = AppState.drinkQty; });
        document.getElementById('add-drink-btn').addEventListener('click', () => this.addDrinkToCart());

        // Checkout
        document.getElementById('checkout-btn').addEventListener('click', () => this.checkout());

        // CPF mask
        document.getElementById('customer-cpf').addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 3) v = v.slice(0,3) + '.' + v.slice(3);
            if (v.length > 7) v = v.slice(0,7) + '.' + v.slice(7);
            if (v.length > 11) v = v.slice(0,11) + '-' + v.slice(11,13);
            e.target.value = v;
        });

        // CEP mask
        document.getElementById('customer-cep').addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5,8);
            e.target.value = v;
        });
    },

    // ─ Search ─
    search(q) {
        document.getElementById('all-sections').classList.add('hidden');
        document.getElementById('search-results').classList.remove('hidden');
        const grid = document.getElementById('search-results-grid');
        const noRes = document.getElementById('no-results');
        const html = (MENU ? MENU.categorias : []).map(c =>
            Dados.visiveis(c).filter(i => i.nome.toLowerCase().includes(q)).map(i => Render.card(i, c)).join('')
        ).join('');
        if (html) { grid.innerHTML = html; noRes.classList.add('hidden'); }
        else { grid.innerHTML = ''; noRes.classList.remove('hidden'); }
    },

    clearSearch() {
        document.getElementById('all-sections').classList.remove('hidden');
        document.getElementById('search-results').classList.add('hidden');
    },

    // ─ Modal Helpers ─
    openModal(id) {
        const m = document.getElementById(id + '-modal');
        const s = document.getElementById(id + '-sheet');
        m.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof gsap !== 'undefined') {
            const bd = document.getElementById(id + '-backdrop');
            gsap.fromTo(bd, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            gsap.fromTo(s, { y: '100%' }, { y: '0%', duration: 0.45, ease: 'power3.out' });
        } else {
            const s2 = document.getElementById(id + '-sheet');
            s2.style.transform = 'translateY(0)';
        }
    },

    closeModal(id) {
        const m = document.getElementById(id + '-modal');
        const s = document.getElementById(id + '-sheet');
        if (typeof gsap !== 'undefined') {
            const bd = document.getElementById(id + '-backdrop');
            gsap.to(s, { y: '100%', duration: 0.3, ease: 'power2.in' });
            gsap.to(bd, { opacity: 0, duration: 0.25, delay: 0.05, onComplete: () => {
                m.classList.remove('active');
                document.body.style.overflow = '';
            }});
        } else {
            m.classList.remove('active');
            document.body.style.overflow = '';
            s.style.transform = 'translateY(100%)';
        }
    },

    // ─ Pizza Modal ─
    openPizzaModal(id) {
        const { item, categoria } = INDICE.get(id);
        AppState.currentPizza = item;
        AppState.currentCategoria = categoria;
        AppState.currentStep = 1;
        AppState.selectedSize = null;
        AppState.selectedFlavors = [];
        AppState.selectedMassa = 'tradicional';
        AppState.selectedBorda = BORDAS[0];
        document.getElementById('modal-title').textContent = AppState.currentPizza.nome;
        document.getElementById('prev-step').classList.add('hidden');
        document.getElementById('next-step').innerHTML = 'Próximo <i class="fas fa-arrow-right"></i>';
        Render.renderSizes();
        this.showStep(1);
        Render.updateStepper();
        Render.updateModalTotal();
        this.openModal('pizza');
    },

    selectSize(id) {
        AppState.selectedSize = TAMANHOS.find(s => s.id === id);
        AppState.selectedFlavors = [AppState.currentPizza];
        Render.renderSizes();
        Render.updateModalTotal();
    },

    toggleFlavor(id) {
        const pizza = INDICE.get(id).item;
        const max = AppState.selectedSize.sabores;
        const idx = AppState.selectedFlavors.findIndex(f => f.id === id);
        if (idx >= 0) { AppState.selectedFlavors.splice(idx, 1); }
        else if (AppState.selectedFlavors.length < max) { AppState.selectedFlavors.push(pizza); }
        else { Utils.showToast(`Máximo de ${max} sabor(es)`); return; }
        Render.renderFlavors();
        Render.updateModalTotal();
    },

    selectMassa(id) { AppState.selectedMassa = id; Render.renderMassa(); },

    selectBorda(id) {
        AppState.selectedBorda = BORDAS.find(b => b.id === id);
        Render.renderBordas();
        Render.updateModalTotal();
    },

    showStep(n) {
        document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
        document.getElementById('step-' + n).classList.add('active');
    },

    nextStep() {
        if (AppState.currentStep === 1) {
            if (!AppState.selectedSize) { Utils.showToast('Selecione um tamanho'); return; }
            AppState.currentStep = 2;
            document.getElementById('prev-step').classList.remove('hidden');
            Render.renderFlavors();
        } else if (AppState.currentStep === 2) {
            if (!AppState.selectedFlavors.length) { Utils.showToast('Selecione ao menos um sabor'); return; }
            AppState.currentStep = 3;
            document.getElementById('next-step').innerHTML = '<i class="fas fa-check"></i> Adicionar';
            Render.renderMassa();
            Render.renderBordas();
        } else if (AppState.currentStep === 3) {
            this.addPizzaToCart();
            return;
        }
        this.showStep(AppState.currentStep);
        Render.updateStepper();
    },

    prevStep() {
        if (AppState.currentStep > 1) {
            AppState.currentStep--;
            if (AppState.currentStep === 1) document.getElementById('prev-step').classList.add('hidden');
            if (AppState.currentStep < 3) document.getElementById('next-step').innerHTML = 'Próximo <i class="fas fa-arrow-right"></i>';
            this.showStep(AppState.currentStep);
            Render.updateStepper();
        }
    },

    calcPizzaPrice() {
        if (!AppState.selectedSize || !AppState.selectedFlavors.length) return 0;
        const si = AppState.selectedSize.index;
        const maxPrice = Math.max(...AppState.selectedFlavors.map(f => Dados.precos(f)[si]));
        const bordaPrice = AppState.selectedBorda ? AppState.selectedBorda.preco : 0;
        return maxPrice + bordaPrice;
    },

    addPizzaToCart() {
        const flavors = AppState.selectedFlavors.map(f => f.nome).join(' / ');
        const size = AppState.selectedSize.nome;
        const massa = AppState.selectedMassa;
        const borda = AppState.selectedBorda?.nome || 'Sem Borda';
        const details = `${size} | ${massa} | ${borda}`;
        AppState.cart.push({
            id: Utils.generateId(),
            name: 'Pizza ' + flavors,
            details,
            price: this.calcPizzaPrice(),
            type: 'pizza'
        });
        this.closeModal('pizza');
        Render.updateCartBadge();
        Utils.showToast('Pizza adicionada ao pedido!');
    },

    // ─ Product Modal (preço único) ─
    openProductModal(id) {
        const { item, categoria } = INDICE.get(id);
        const icone = Dados.icone(categoria);
        AppState.currentDrink = item;
        AppState.drinkQty = 1;
        AppState.selectedDessertOption = item.opcoes?.[0] || null;
        document.getElementById('drink-modal-title').textContent = icone.titulo;
        document.getElementById('drink-modal-image').src = item.imagem || CONFIG.placeholders[icone.placeholder];
        document.getElementById('drink-modal-name').textContent = item.nome;
        document.getElementById('drink-modal-price').textContent = Utils.formatCurrency(item.preco);
        document.getElementById('drink-qty').textContent = '1';
        this.renderDessertOptions(item);
        this.openModal('drink');
    },

    renderDessertOptions(item) {
        const wrap = document.getElementById('dessert-options-wrap');
        const list = document.getElementById('dessert-options');
        if (!item.opcoes?.length) {
            wrap.classList.add('hidden');
            list.innerHTML = '';
            return;
        }
        wrap.classList.remove('hidden');
        list.innerHTML = item.opcoes.map((opcao, i) => `
            <button class="dessert-option ${AppState.selectedDessertOption === opcao ? 'selected' : ''}" onclick="App.selectDessertOption(${i})">
                ${Utils.esc(opcao)}
            </button>
        `).join('');
    },

    selectDessertOption(i) {
        AppState.selectedDessertOption = AppState.currentDrink.opcoes[i];
        this.renderDessertOptions(AppState.currentDrink);
    },

    addDrinkToCart() {
        const d = AppState.currentDrink;
        const isDessert = Array.isArray(d.opcoes);
        if (isDessert && !AppState.selectedDessertOption) {
            Utils.showToast('Selecione o sabor');
            return;
        }
        for (let i = 0; i < AppState.drinkQty; i++) {
            AppState.cart.push({
                id: Utils.generateId(),
                name: isDessert ? `${d.nome} - ${AppState.selectedDessertOption}` : d.nome,
                details: isDessert ? `Sabor: ${AppState.selectedDessertOption} | Qtd: 1` : 'Qtd: 1',
                price: d.preco,
                type: isDessert ? 'sobremesa' : 'bebida'
            });
        }
        this.closeModal('drink');
        Render.updateCartBadge();
        Utils.showToast(`${d.nome} adicionado!`);
    },

    // ─ Cart ─
    openCartModal() {
        Render.renderCart();
        Render.updateCartTotal();
        this.openModal('cart');
    },

    removeFromCart(idx) {
        AppState.cart.splice(idx, 1);
        Render.renderCart();
        Render.updateCartTotal();
        Render.updateCartBadge();
    },

    // ─ Checkout ─
    checkout() {
        if (!AppState.cart.length) { Utils.showToast('Carrinho vazio'); return; }
        const name = document.getElementById('customer-name').value.trim();
        const cpf = document.getElementById('customer-cpf').value.trim();
        const cep = document.getElementById('customer-cep').value.trim();
        const comp = document.getElementById('customer-complemento').value.trim();

        const line = '--------------------------------';
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        let msg = '';
        msg += `*PIZZARIA HIT*\n`;
        msg += `*Pedido Online*\n`;
        msg += `${line}\n\n`;

        let total = 0;
        AppState.cart.forEach((item, i) => {
            msg += `*${i + 1}. ${item.name}*\n`;
            msg += `   ${item.details}\n`;
            msg += `   Valor: ${Utils.formatCurrency(item.price)}\n\n`;
            total += item.price;
        });

        msg += `${line}\n`;
        msg += `*TOTAL: ${Utils.formatCurrency(total)}*\n`;
        msg += `${line}\n\n`;

        // Customer info section
        const hasCustomerInfo = name || cpf || cep || comp;
        if (hasCustomerInfo) {
            msg += `*DADOS DO CLIENTE*\n`;
            if (name) msg += `Nome: ${name}\n`;
            if (cpf)  msg += `CPF: ${cpf}\n`;
            if (cep)  msg += `CEP: ${cep}\n`;
            if (comp) msg += `Complemento: ${comp}\n`;
            msg += `\n`;
        }

        msg += `Data: ${dateStr}\n\n`;
        msg += `${line}\n`;
        msg += `*Aguarde um atendente confirmar o seu pedido e informar o valor da taxa de entrega.*\n`;
        msg += `Obrigado por escolher a Pizzaria Hit!\n`;

        const url = `https://wa.me/${MENU.loja.whatsapp}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
        if (typeof fbq !== 'undefined') fbq('track', 'Purchase', { value: total, currency: 'BRL' });
    }
};

// ── ANIMATIONS ──
const Animations = {
    init() {
        if (typeof gsap === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ ease: 'power2.out', duration: 0.6 });
        this.preloader();
        this.header();
        this.hero();
        this.scrollReveals();
        this.cardStagger();
        this.cartFab();
    },

    preloader() {
        const el = document.getElementById('preloader');
        gsap.to(el, {
            opacity: 0, duration: 0.6, delay: 1.2, ease: 'power2.inOut',
            onComplete: () => { el.style.display = 'none'; }
        });
    },

    header() {
        gsap.fromTo('#main-header', { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 1.4 });
    },

    hero() {
        const tl = gsap.timeline({ delay: 1.6 });
        tl.fromTo('#hero-logo', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.7)' })
          .fromTo('.hero-title', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
          .fromTo('.hero-subtitle', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2')
          .fromTo('.hero-divider', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.4 }, '-=0.2')
          .fromTo('.hero-hours', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2');
    },

    scrollReveals() {
        gsap.utils.toArray('.section-header').forEach(el => {
            gsap.fromTo(el,
                { x: -40, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6,
                  scrollTrigger: { trigger: el, start: 'top 88%', once: true }
                }
            );
        });
    },

    cardStagger() {
        gsap.utils.toArray('.product-grid').forEach(grid => {
            const cards = grid.children;
            if (!cards.length) return;
            gsap.fromTo(cards,
                { y: 30, opacity: 0, scale: 0.92 },
                { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.06,
                  scrollTrigger: { trigger: grid, start: 'top 90%', once: true }
                }
            );
        });
    },


    cartFab() {
        gsap.fromTo('#cart-fab',
            { x: 80, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6, delay: 2.2, ease: 'back.out(1.7)',
              onComplete: () => {
                  // Ensure the fab is fully visible after animation
                  const fab = document.getElementById('cart-fab');
                  if (fab) { fab.style.opacity = '1'; fab.style.transform = 'none'; }
                  // Subtle pulse
                  gsap.to('#cart-fab', { scale: 1.05, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
              }
            }
        );
    }
};

// ── BOOT ──
document.addEventListener('DOMContentLoaded', () => App.init());
