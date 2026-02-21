/**
 * ============================================
 * PIZZARIA HIT — CARDÁPIO DIGITAL PREMIUM
 * Vanilla JavaScript ES6+
 * ============================================
 */

// ── CONFIG ──
const CONFIG = {
    whatsapp: '5565981572829',
    endereco: 'R. Mal. Floriano Peixoto, 982, Duque de Caxias, Cuiabá - MT',
    horarioAbertura: 18,
    horarioFechamento: 23,
    diaSemanaFechado: 1,
    placeholders: {
        pizza: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23222'  width='200' height='200'/%3E%3Ctext x='100' y='108' text-anchor='middle' fill='%23555' font-size='40'%3E🍕%3C/text%3E%3C/svg%3E",
        pizzaDoce: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23222' width='200' height='200'/%3E%3Ctext x='100' y='108' text-anchor='middle' fill='%23555' font-size='40'%3E🍫%3C/text%3E%3C/svg%3E",
        bebida: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23222' width='200' height='200'/%3E%3Ctext x='100' y='108' text-anchor='middle' fill='%23555' font-size='40'%3E🥤%3C/text%3E%3C/svg%3E",
        suco: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23222' width='200' height='200'/%3E%3Ctext x='100' y='108' text-anchor='middle' fill='%23555' font-size='40'%3E🧃%3C/text%3E%3C/svg%3E",
        cerveja: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23222' width='200' height='200'/%3E%3Ctext x='100' y='108' text-anchor='middle' fill='%23555' font-size='40'%3E🍺%3C/text%3E%3C/svg%3E"
    }
};

// ── DADOS: TAMANHOS & BORDAS ──
const TAMANHOS = [
    { id: 'broto', nome: 'Broto', fatias: 2, sabores: 1, index: 0 },
    { id: 'pequena', nome: 'Pequena', fatias: 4, sabores: 2, index: 1 },
    { id: 'media', nome: 'Média', fatias: 6, sabores: 2, index: 2 },
    { id: 'grande', nome: 'Grande', fatias: 8, sabores: 3, index: 3 }
];

const BORDAS = [
    { id: 'sem-borda', nome: 'Sem Borda', preco: 0 },
    { id: 'catupiry', nome: 'Catupiry', preco: 12 },
    { id: 'cheddar', nome: 'Cheddar', preco: 12 },
    { id: 'chocolate', nome: 'Chocolate', preco: 15 },
    { id: 'goiabada', nome: 'Goiabada', preco: 18 },
    { id: 'doce-leite', nome: 'Doce de Leite', preco: 18 }
];

// ── DADOS: PIZZAS SALGADAS ──
const PIZZAS_SALGADAS = [
    { id: 1, name: 'Mussarela', description: 'Molho, mussarela, parmesão, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Mussarela.jpeg' },
    { id: 2, name: 'Portuguesa', description: 'Molho, mussarela, presunto, ovos, cebola, azeitona, ervilha e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Portuguesaa.jpeg' },
    { id: 3, name: 'Tradicional', description: 'Molho, mussarela, presunto, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Tradicional.jpeg' },
    { id: 4, name: 'Napolitana', description: 'Molho, mussarela, parmesão, tomate, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Napolitana.jpeg' },
    { id: 5, name: 'Calabresa', description: 'Molho, mussarela, calabresa, cebola, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Calabresa.jpeg' },
    { id: 6, name: 'Calabresa Especial', description: 'Molho, mussarela, calabresa, catupiry, cebola, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Calabresa-especial.jpeg' },
    { id: 7, name: 'Toscana', description: 'Molho, calabresa moída, mussarela, catupiry, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Toscana.jpeg' },
    { id: 8, name: 'Dom Camilo', description: 'Molho, mussarela, presunto, calabresa, creme de leite, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Dom-Camilo.jpeg' },
    { id: 9, name: 'Bacon', description: 'Molho, mussarela, bacon, cebola, catupiry, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Bacon.jpeg' },
    { id: 10, name: 'Mexicana', description: 'Molho, mussarela, carne moída, pimentão, cebola, pimenta, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Mexicana.jpeg' },
    { id: 11, name: 'Catupiry', description: 'Molho, mussarela, catupiry, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Catupiry.jpeg' },
    { id: 12, name: 'Frango com Catupiry', description: 'Molho, mussarela, peito de frango, catupiry, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Frango-Catupiry.jpeg' },
    { id: 13, name: 'À Brasileira', description: 'Molho, mussarela, peito de frango, milho verde, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/A-Brasileira.jpeg' },
    { id: 14, name: 'Atum', description: 'Molho, mussarela, atum, cebola, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Atum.jpeg' },
    { id: 15, name: 'Quatro Queijos', description: 'Molho, mussarela, provolone, catupiry, parmesão, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Quatro-Queijos.jpeg' },
    { id: 16, name: 'Margherita', description: 'Molho, mussarela, tomate, manjericão, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Margherita.jpeg' },
    { id: 17, name: 'Margherita Especial', description: 'Molho, mussarela de búfala, tomate cereja, manjericão, parmesão, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Margherita-especial.jpeg' },
    { id: 18, name: 'Palmito', description: 'Molho, mussarela, palmito, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Palmito.jpeg' },
    { id: 19, name: 'Milho', description: 'Molho, mussarela, milho verde, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/milho.jpeg' },
    { id: 20, name: 'Alho e Óleo', description: 'Molho, mussarela, alho frito, azeite, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Alho-e-Oleo.jpeg' },
    { id: 21, name: 'Lombo ao Creme', description: 'Molho, mussarela, lombinho canadense, requeijão cremoso, tomate, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Lombo-ao-Creme.jpeg' },
    { id: 22, name: 'Filé Especial', description: 'Molho, mussarela, filé mignon, cebola, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/File-Especial.jpeg' },
    { id: 23, name: 'Strogonoff de Filé', description: 'Molho, mussarela, strogonoff de filé, batata palha, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Strogonoff-file.jpeg' },
    { id: 24, name: 'Strogonoff de Frango', description: 'Molho, mussarela, strogonoff de frango, batata palha, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/strogonoff-frango.jpeg' },
    { id: 25, name: 'Frango Especial', description: 'Molho, mussarela, peito de frango, catupiry, milho verde, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Frango-especial.jpeg' },
    { id: 26, name: 'Caprese', description: 'Molho, mussarela, tomate, manjericão, mussarela de búfala, pasta de azeitona preta, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/caprese.jpeg' },
    { id: 27, name: 'Pizza do Chef', description: 'Molho, mussarela, ricota, tomate cereja, manjericão, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Pizza-do-chef.jpeg' },
    { id: 28, name: 'Vegetariana', description: 'Molho, mussarela, palmito, milho, ervilha, tomate, cebola, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Vegetariana.jpeg' },
    { id: 29, name: 'Milho com Catupiry', description: 'Molho, mussarela, milho verde, catupiry, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Milho-com-catupiry.jpeg' },
    { id: 30, name: 'Rúcula', description: 'Molho, mussarela, rúcula, tomate seco, parmesão, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Rucula.jpeg' },
    { id: 31, name: 'Escarola', description: 'Molho, mussarela, escarola refogada, alho, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Escarola.jpeg' },
    { id: 32, name: 'Brócolis', description: 'Molho, mussarela, brócolis, alho, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Brocolis.jpeg' },
    { id: 33, name: 'Brócolis com Berinjela', description: 'Molho, mussarela, brócolis, berinjela, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/brocolis-berinjela.jpeg' },
    { id: 34, name: 'Berinjela', description: 'Molho, mussarela, berinjela, alho, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Berinjela.jpeg' },
    { id: 35, name: 'Genovesa', description: 'Molho, mussarela, champignon, presunto, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Genovesa.jpeg' },
    { id: 36, name: 'Aliche', description: 'Molho, mussarela, aliche, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Aliche.jpeg' },
    { id: 37, name: 'Dom Valério', description: 'Molho, mussarela, presunto, ovo, cebola, pimentão, ervilha, milho, palmito, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Dom-Valerio.jpeg' },
    { id: 38, name: 'Super Portuguesa', description: 'Molho, mussarela, presunto, calabresa, tomate, ovos, cebola, azeitona, pimentão e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Super-Portuguesa.jpeg' },
    { id: 39, name: 'Super Quatro Queijos', description: 'Molho, mussarela, provolone, catupiry, parmesão, gorgonzola, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Super-quatro-queijos.jpeg' },
    { id: 40, name: 'Pantanera', description: 'Molho, mussarela, carne de sol, cebola, catupiry, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Pantanera.jpeg' },
    { id: 41, name: 'Super Hit', description: 'Molho, mussarela, presunto, calabresa, bacon, catupiry, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Super-hit.jpeg' },
    { id: 42, name: 'Hit', description: 'Molho, mussarela, presunto, catupiry, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/hit.jpeg' },
    { id: 43, name: 'À Moda Araci', description: 'Molho, mussarela, frango, bacon, catupiry, cebola, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/moda-araci.jpeg' },
    { id: 44, name: 'Suíça', description: 'Molho, mussarela, presunto, queijo suíço, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Suica.jpeg' },
    { id: 45, name: 'Camarão', description: 'Molho, mussarela, camarão, catupiry, azeitona e orégano', prices: [71.90, 81.90, 112.90, 119.90], image: 'media/flavors/ifood_ready/Camarao.jpeg' },
    { id: 46, name: 'Bacalhau', description: 'Molho, mussarela, bacalhau, cebola, azeitona e orégano', prices: [71.90, 81.90, 112.90, 119.90], image: 'media/flavors/ifood_ready/Bacalhau.jpeg' },
    { id: 47, name: 'Mussarela de Búfala', description: 'Molho, mussarela de búfala, tomate, manjericão, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Mussarela-bufala.jpeg' },
    { id: 48, name: 'Abobrinha', description: 'Molho, abobrinha refogada, mussarela de búfala, parmesão, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Abobrinha.jpeg' },
    { id: 49, name: 'Light', description: 'Molho, mussarela, ricota, tomate seco, manjericão, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Light.jpeg' },
    { id: 50, name: 'Pepperone', description: 'Molho, mussarela, pepperone, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Peperone.jpeg' },
    { id: 51, name: 'Peito de Peru', description: 'Molho, mussarela, peito de peru, catupiry, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Peito-de-peru.jpeg' },
    { id: 52, name: 'Basílica', description: 'Molho, mussarela, tomate cereja, pesto de rúcula, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/basilica.jpeg' },
    { id: 53, name: 'Caprese com Pepperone', description: 'Molho, mussarela, pepperone, tomate, mussarela de búfala, manjericão, pasta de azeitona preta e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Caprese-com-peperone.jpeg' },
    { id: 54, name: 'Presunto de Parma', description: 'Molho de tomate, mussarela de Búfala, tomate cereja, presunto de Parma, azeitona preta e orégano', prices: [71.90, 81.90, 112.90, 119.90], image: 'media/flavors/ifood_ready/presunto-de-parma.jpeg' },
    { id: 55, name: 'Vegetariana Hit', description: 'Molho de tomate, mussarela de Búfala, tomate cereja, palmito, brócolis, abobrinha, azeitona e orégano', prices: [71.90, 81.90, 112.90, 119.90], image: 'media/flavors/ifood_ready/Vegetariana-Hit.jpeg' }
];

// ── DADOS: PIZZAS DOCES ──
const PIZZAS_DOCES = [
    { id: 101, name: 'California', description: 'Creme de leite, mussarela, lombo, figo, pêssego, ameixa e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: null },
    { id: 102, name: 'Salada de Fruta', description: 'Creme de leite, mussarela, pêssego, figo, ameixa, cereja e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: null },
    { id: 103, name: 'Romeu e Julieta', description: 'Creme de leite, mussarela, banana, doce de goiaba e canela', prices: [51.90, 73.90, 84.90, 98.90], image: null },
    { id: 104, name: 'Banana', description: 'Creme de leite, mussarela, banana, leite condensado e canela', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/sweet_flavors/ifood_ready/banana.jpeg' },
    { id: 105, name: 'Chocolate com Granulado', description: 'Creme de leite, chocolate e granulado', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/sweet_flavors/ifood_ready/Chocolate.jpeg' },
    { id: 106, name: 'Chocolate com Cereja', description: 'Creme de leite, chocolate e cereja', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/sweet_flavors/ifood_ready/chocolate-cereja.jpeg' },
    { id: 107, name: 'Chocolate com Côco', description: 'Creme de leite, chocolate e coco', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/sweet_flavors/ifood_ready/chocolate-coco.jpeg' },
    { id: 108, name: 'Chocolate com Castanha', description: 'Creme de leite, chocolate e castanha de caju', prices: [51.90, 73.90, 84.90, 98.90], image: null },
    { id: 109, name: 'Chocolate com Banana', description: 'Creme de leite, mussarela, banana e chocolate', prices: [51.90, 73.90, 84.90, 98.90], image: null }
];

// ── DADOS: BEBIDAS ──
const BEBIDAS = [
    { id: 201, name: 'Coca-Cola 1,5L', price: 14.00, image: 'media/drinks_nobg/Coca-cola.png', category: 'refrigerante' },
    { id: 202, name: 'Coca-Cola Zero 1,5L', price: 14.00, image: 'media/drinks_nobg/Coca-zero.png', category: 'refrigerante' },
    { id: 203, name: 'Guaraná Antarctica 1,5L', price: 13.00, image: 'media/drinks_nobg/guarana-litro-removebg-preview.png', category: 'refrigerante' },
    { id: 204, name: 'Guaraná Zero 1,5L', price: 13.00, image: 'media/drinks_nobg/guarana-zero-litro-removebg-preview.png', category: 'refrigerante' },
    { id: 205, name: 'Sprite 1,5L', price: 13.00, image: 'media/drinks_nobg/Sprite.png', category: 'refrigerante' },
    { id: 206, name: 'Fanta 1,5L', price: 13.00, image: 'media/drinks_nobg/Fanta.png', category: 'refrigerante' },
    { id: 207, name: 'Água Mineral Puríssima 1,5L', price: 10.00, image: 'media/drinks_nobg/purissima-1.5l-removebg-preview.png', category: 'agua' },
    { id: 208, name: 'Coca-Cola Lata 310ml', price: 8.90, image: 'media/drinks_nobg/coca-cola-310ml-1-removebg-preview.png', category: 'refrigerante' },
    { id: 209, name: 'Coca Zero Lata 310ml', price: 8.90, image: 'media/drinks_nobg/coca-zero-310ml.png', category: 'refrigerante' },
    { id: 210, name: 'Guaraná Lata 350ml', price: 8.90, image: 'media/drinks_nobg/Guarana-lata.png', category: 'refrigerante' },
    { id: 211, name: 'Guaraná Zero Lata 350ml', price: 8.90, image: 'media/drinks_nobg/guarana-lata-zero.png', category: 'refrigerante' },
    { id: 212, name: 'Schweppes Citrus 310ml', price: 8.90, image: 'media/drinks_nobg/schweppes-310ml-removebg-preview.png', category: 'refrigerante' },
    { id: 213, name: 'Schweppes Tônica 310ml', price: 8.90, image: 'media/drinks_nobg/schweppes-tonica-310ml-removebg-preview.png', category: 'refrigerante' },
    { id: 214, name: 'Sprite Lata 350ml', price: 8.90, image: 'media/drinks_nobg/sprite-lata.png', category: 'refrigerante' },
    { id: 215, name: 'Fanta Lata 350ml', price: 8.90, image: 'media/drinks_nobg/Fanta-lata.png', category: 'refrigerante' },
    { id: 216, name: 'Água Mineral Puríssima 497ml', price: 6.00, image: 'media/drinks_nobg/purissima-497ml-removebg-preview.png', category: 'agua' },
    { id: 217, name: 'Água com Gás Puríssima 497ml', price: 7.90, image: 'media/drinks_nobg/purissima-497ml-comgas-removebg-preview.png', category: 'agua' },
    { id: 218, name: 'Aquárius Lemon 510ml', price: 8.00, image: 'media/drinks_nobg/Aquarius-lemon.png', category: 'agua' }
];

// ── DADOS: CERVEJAS ──
const CERVEJAS = [
    { id: 301, name: 'Budweiser Long Neck', price: 13.90, image: 'media/drinks_nobg/budweiser.png' },
    { id: 302, name: 'Stella Artois Long Neck', price: 13.90, image: 'media/drinks_nobg/Stella.png' },
    { id: 303, name: 'Malzbier Long Neck', price: 13.90, image: 'media/drinks_nobg/malzbier.png' },
    { id: 304, name: 'Bohemia Long Neck', price: 13.90, image: 'media/drinks_nobg/bohemia.png' },
    { id: 305, name: 'Heineken Long Neck', price: 15.90, image: 'media/drinks_nobg/heineken.png' },
    { id: 306, name: 'Eisenbahn Long Neck', price: 13.90, image: 'media/drinks_nobg/Eisenbahn.png' },
    { id: 307, name: 'Heineken Zero Long Neck', price: 15.90, image: 'media/drinks_nobg/heineken-zero.png' },
    { id: 308, name: 'Corona Long Neck', price: 15.90, image: 'media/drinks_nobg/corona.png' }
];

// ── DADOS: SUCOS ──
const SUCOS = [
    { id: 401, name: 'Suco de Laranja 1L', description: 'Suco natural de laranja', price: 29.90, image: null, category: 'natural' },
    { id: 402, name: 'Suco Laranja com Acerola 1L', description: 'Suco natural de laranja com acerola', price: 29.90, image: null, category: 'natural' },
    { id: 403, name: 'Suco de Abacaxi 1L', description: 'Suco natural de abacaxi', price: 29.90, image: null, category: 'natural' },
    { id: 404, name: 'Suco de Limão 1L', description: 'Suco natural de limão', price: 29.90, image: null, category: 'natural' },
    { id: 405, name: 'Suco de Maracujá 1L', description: 'Suco natural de maracujá', price: 29.90, image: null, category: 'natural' },
    { id: 406, name: 'Suco Verde 1L', description: 'Laranja, couve, hortelã, manjericão e gengibre', price: 29.90, image: null, category: 'natural' },
    { id: 407, name: 'Suco Vermelho 1L', description: 'Laranja, cenoura e beterraba', price: 29.90, image: null, category: 'natural' },
    { id: 408, name: 'Suco Abacaxi com Hortelã 1L', description: 'Suco natural de abacaxi com hortelã', price: 29.90, image: null, category: 'natural' },
    { id: 409, name: 'Suco de Acerola 1L', description: 'Suco de polpa de acerola', price: 29.90, image: null, category: 'polpa' },
    { id: 410, name: 'Suco de Morango 1L', description: 'Suco de polpa de morango', price: 29.90, image: null, category: 'polpa' },
    { id: 411, name: 'Suco de Uva 1L', description: 'Suco de polpa de uva', price: 29.90, image: null, category: 'polpa' }
];

// ── STATE ──
const AppState = {
    cart: [],
    currentPizza: null,
    currentStep: 1,
    selectedSize: null,
    selectedFlavors: [],
    selectedMassa: 'tradicional',
    selectedBorda: null,
    currentDrink: null,
    drinkQty: 1
};

// ── UTILS ──
const Utils = {
    formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
    isOpen() {
        const now = new Date();
        if (now.getDay() === CONFIG.diaSemanaFechado) return false;
        const h = now.getHours();
        return h >= CONFIG.horarioAbertura && h < CONFIG.horarioFechamento;
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

    pizzaCard(p) {
        const min = Math.min(...p.prices);
        const isDoce = p.id >= 100;
        const ph = isDoce ? CONFIG.placeholders.pizzaDoce : CONFIG.placeholders.pizza;
        const hasImage = !!p.image;
        const imageHTML = hasImage
            ? `<div class="pizza-card-image"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='${ph}'"></div>`
            : `<div class="pizza-card-image no-image"><span class="pizza-placeholder-icon">${isDoce ? '🍫' : '🍕'}</span></div>`;
        return `<div class="pizza-card" onclick="App.openPizzaModal(${p.id},'${isDoce?'doce':'salgada'}')">
            ${imageHTML}
            <div class="pizza-card-body">
                <div class="pizza-card-name">${p.name}</div>
                <div class="pizza-card-price"><span>a partir de </span>${Utils.formatCurrency(min)}</div>
            </div>
        </div>`;
    },

    drinkCard(d, type = 'bebida') {
        const ph = CONFIG.placeholders[type] || CONFIG.placeholders.bebida;
        const img = d.image || ph;
        return `<div class="drink-card" onclick="App.openDrinkModal(${d.id},'${type}')">
            <div class="drink-card-image"><img src="${img}" alt="${d.name}" loading="lazy" onerror="this.src='${ph}'"></div>
            <div class="drink-card-body">
                <div class="drink-card-name">${d.name}</div>
                ${d.description ? `<div class="drink-card-desc">${d.description}</div>` : ''}
                <div class="drink-card-price">${Utils.formatCurrency(d.price)}</div>
            </div>
        </div>`;
    },

    renderMenu() {
        document.getElementById('pizzas-salgadas-grid').innerHTML = PIZZAS_SALGADAS.map(p => this.pizzaCard(p)).join('');
        document.getElementById('pizzas-doces-grid').innerHTML = PIZZAS_DOCES.map(p => this.pizzaCard(p)).join('');
        document.getElementById('bebidas-grid').innerHTML = BEBIDAS.map(d => this.drinkCard(d, 'bebida')).join('');
        document.getElementById('sucos-grid').innerHTML = SUCOS.map(d => this.drinkCard(d, 'suco')).join('');
        document.getElementById('cervejas-grid').innerHTML = CERVEJAS.map(d => this.drinkCard(d, 'cerveja')).join('');
        // Counts
        document.getElementById('count-salgadas').textContent = PIZZAS_SALGADAS.length + ' sabores';
        document.getElementById('count-doces').textContent = PIZZAS_DOCES.length + ' sabores';
        document.getElementById('count-bebidas').textContent = BEBIDAS.length + ' itens';
        document.getElementById('count-sucos').textContent = SUCOS.length + ' itens';
        document.getElementById('count-cervejas').textContent = CERVEJAS.length + ' itens';
    },

    renderSizes() {
        const c = document.getElementById('size-options');
        const p = AppState.currentPizza;
        c.innerHTML = TAMANHOS.map(s => `
            <div class="option-card ${AppState.selectedSize?.id===s.id?'selected':''}" onclick="App.selectSize('${s.id}')">
                <div><div class="option-name">${s.nome}</div><div class="option-detail">${s.fatias} fatias • até ${s.sabores} sabor(es)</div></div>
                <div class="option-price">${Utils.formatCurrency(p.prices[s.index])}</div>
            </div>`).join('');
    },

    renderFlavors() {
        const c = document.getElementById('flavor-options');
        const all = AppState.currentPizza.id >= 100 ? PIZZAS_DOCES : PIZZAS_SALGADAS;
        const si = AppState.selectedSize.index;
        c.innerHTML = all.map(p => {
            const sel = AppState.selectedFlavors.some(f => f.id === p.id);
            return `<div class="flavor-card ${sel?'selected':''}" onclick="App.toggleFlavor(${p.id})">
                <div class="flavor-check"><i class="fas fa-check"></i></div>
                <div class="flavor-info"><div class="flavor-name">${p.name}</div><div class="flavor-desc">${p.description}</div></div>
                <div class="flavor-price">${Utils.formatCurrency(p.prices[si])}</div>
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
                <div class="borda-option-name">${b.nome}</div>
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
                <div class="cart-item-info"><div class="cart-item-name">${item.name}</div><div class="cart-item-detail">${item.details}</div></div>
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
    init() {
        Render.updateStatus();
        Render.renderMenu();
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
        const allPizzas = [...PIZZAS_SALGADAS, ...PIZZAS_DOCES];
        const allDrinks = [...BEBIDAS, ...SUCOS, ...CERVEJAS];
        const matchedPizzas = allPizzas.filter(p => p.name.toLowerCase().includes(q));
        const matchedDrinks = allDrinks.filter(d => d.name.toLowerCase().includes(q));
        let html = matchedPizzas.map(p => Render.pizzaCard(p)).join('');
        html += matchedDrinks.map(d => Render.drinkCard(d, d.category || 'bebida')).join('');
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
    openPizzaModal(id, type) {
        const list = type === 'doce' ? PIZZAS_DOCES : PIZZAS_SALGADAS;
        AppState.currentPizza = list.find(p => p.id === id);
        AppState.currentStep = 1;
        AppState.selectedSize = null;
        AppState.selectedFlavors = [];
        AppState.selectedMassa = 'tradicional';
        AppState.selectedBorda = BORDAS[0];
        document.getElementById('modal-title').textContent = AppState.currentPizza.name;
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
        const list = AppState.currentPizza.id >= 100 ? PIZZAS_DOCES : PIZZAS_SALGADAS;
        const pizza = list.find(p => p.id === id);
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
        const maxPrice = Math.max(...AppState.selectedFlavors.map(f => f.prices[si]));
        const bordaPrice = AppState.selectedBorda ? AppState.selectedBorda.preco : 0;
        return maxPrice + bordaPrice;
    },

    addPizzaToCart() {
        const flavors = AppState.selectedFlavors.map(f => f.name).join(' / ');
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

    // ─ Drink Modal ─
    openDrinkModal(id, type) {
        const lists = { bebida: BEBIDAS, suco: SUCOS, cerveja: CERVEJAS };
        const list = lists[type] || BEBIDAS;
        AppState.currentDrink = list.find(d => d.id === id);
        AppState.drinkQty = 1;
        const d = AppState.currentDrink;
        const ph = CONFIG.placeholders[type] || CONFIG.placeholders.bebida;
        document.getElementById('drink-modal-image').src = d.image || ph;
        document.getElementById('drink-modal-name').textContent = d.name;
        document.getElementById('drink-modal-price').textContent = Utils.formatCurrency(d.price);
        document.getElementById('drink-qty').textContent = '1';
        this.openModal('drink');
    },

    addDrinkToCart() {
        const d = AppState.currentDrink;
        for (let i = 0; i < AppState.drinkQty; i++) {
            AppState.cart.push({
                id: Utils.generateId(),
                name: d.name,
                details: 'Qtd: 1',
                price: d.price,
                type: 'bebida'
            });
        }
        this.closeModal('drink');
        Render.updateCartBadge();
        Utils.showToast(`${d.name} adicionado!`);
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

        msg += `Data: ${dateStr}\n`;

        const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
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
