/**
 * ============================================
 * PIZZARIA HIT - CARDÁPIO DIGITAL
 * Vanilla JavaScript ES6+
 * ============================================
 */

// ============================================
// CONFIGURAÇÕES GLOBAIS
// ============================================
const CONFIG = {
    whatsapp: '5565981572829',
    endereco: 'R. Mal. Floriano Peixoto, 982, Duque de Caxias, Cuiabá - MT',
    horarioAbertura: 18,
    horarioFechamento: 23,
    diaSemanaFechado: 1, // Segunda-feira = 1
    // Placeholders SVG profissionais com fundo escuro
    placeholders: {
        pizza: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzJEMUYxQSIvPjxwYXRoIGQ9Ik0xMjAgMjMwTDIwMCA1MEwyODAgMjMwSC0xMjBaIiBmaWxsPSIjRjdDQTQ1Ii8+PHBhdGggZD0iTTEzMCAyMjBMMjAwIDYwTDI3MCAyMjBIMTMwWiIgZmlsbD0iI0VBQTkzNSIvPjxjaXJjbGUgY3g9IjE3MCIgY3k9IjE0MCIgcj0iMTgiIGZpbGw9IiNFODRDM0QiLz48Y2lyY2xlIGN4PSIyMjAiIGN5PSIxNjAiIHI9IjE1IiBmaWxsPSIjRTg0QzNEIi8+PGNpcmNsZSBjeD0iMTkwIiBjeT0iMTkwIiByPSIxMiIgZmlsbD0iI0U4NEMzRCIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE4MCIgcj0iOCIgZmlsbD0iIzI3QUU2MCIvPjxjaXJjbGUgY3g9IjIzNSIgY3k9IjE5NSIgcj0iNiIgZmlsbD0iIzI3QUU2MCIvPjxwYXRoIGQ9Ik0xMjAgMjMwQzEyMCAyMzAgMTQwIDI0MCAyMDAgMjQwQzI2MCAyNDAgMjgwIDIzMCAyODAgMjMwIiBzdHJva2U9IiNDODhCMjUiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
        pizzaDoce: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzJEMUYxQSIvPjxwYXRoIGQ9Ik0xMjAgMjMwTDIwMCA1MEwyODAgMjMwSC0xMjBaIiBmaWxsPSIjRjdDQTQ1Ii8+PHBhdGggZD0iTTEzMCAyMjBMMjAwIDYwTDI3MCAyMjBIMTMwWiIgZmlsbD0iIzZCNDQyMyIvPjxjaXJjbGUgY3g9IjE3MCIgY3k9IjE1MCIgcj0iMTIiIGZpbGw9IiNGRkYiIG9wYWNpdHk9IjAuOCIvPjxjaXJjbGUgY3g9IjIxNSIgY3k9IjE3MCIgcj0iMTAiIGZpbGw9IiNGRkYiIG9wYWNpdHk9IjAuOCIvPjxjaXJjbGUgY3g9IjE4NSIgY3k9IjE5NSIgcj0iOCIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC44Ii8+PGNpcmNsZSBjeD0iMjM1IiBjeT0iMjAwIiByPSI2IiBmaWxsPSIjRTg0QzNEIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTgwIiByPSI1IiBmaWxsPSIjRTg0QzNEIi8+PHBhdGggZD0iTTEyMCAyMzBDMTIwIDIzMCAxNDAgMjQwIDIwMCAyNDBDMjYwIDI0MCAyODAgMjMwIDI4MCAyMzAiIHN0cm9rZT0iI0M4OEIyNSIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIi8+PC9zdmc+',
        bebida: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFBMUExQSIvPjxyZWN0IHg9IjE0MCIgeT0iNTAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMjAwIiByeD0iMTAiIGZpbGw9IiNFNTM5MzUiLz48cmVjdCB4PSIxNTAiIHk9IjcwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiByeD0iNSIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0xNTAgMTQwaDEwMHYxNUgxNTB6IiBmaWxsPSIjRkZGIiBvcGFjaXR5PSIwLjMiLz48cGF0aCBkPSJNMTU1IDE2MGg5MHYxMEgxNTV6IiBmaWxsPSIjRkZGIiBvcGFjaXR5PSIwLjIiLz48L3N2Zz4=',
        suco: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFBMUExQSIvPjxwYXRoIGQ9Ik0xNDAgNzBIMjYwTDI0MCAyNTBIMTYwTDE0MCA3MFoiIGZpbGw9IiNGNTlFMEIiLz48ZWxsaXBzZSBjeD0iMjAwIiBjeT0iNzAiIHJ4PSI2MCIgcnk9IjE1IiBmaWxsPSIjRkJCRjI0Ii8+PGNpcmNsZSBjeD0iMTc1IiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iI0Y5NzMxNiIgb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMjE1IiBjeT0iMTUwIiByPSIxNSIgZmlsbD0iI0Y5NzMxNiIgb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMTkwIiBjeT0iMTkwIiByPSIxMiIgZmlsbD0iI0Y5NzMxNiIgb3BhY2l0eT0iMC43Ii8+PHBhdGggZD0iTTE3MCA1MEgyMzBWNzBIMTcwWiIgZmlsbD0iIzlDQTNBRiIvPjwvc3ZnPg==',
        cerveja: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFBMUExQSIvPjxyZWN0IHg9IjEzMCIgeT0iODAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMTcwIiByeD0iNSIgZmlsbD0iI0Y1OUUwQiIvPjxlbGxpcHNlIGN4PSIxOTAiIGN5PSI4MCIgcng9IjYwIiByeT0iMTUiIGZpbGw9IiNGRkYiLz48cmVjdCB4PSIxMzUiIHk9IjkwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRkZGIiBvcGFjaXR5PSIwLjMiLz48cmVjdCB4PSIyNTAiIHk9IjEyMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjgwIiByeD0iMTUiIGZpbGw9IiNGNTlFMEIiLz48cmVjdCB4PSIyNTAiIHk9IjEyMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjgwIiByeD0iMTUiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+PC9zdmc+'
    }
};

// ============================================
// DADOS DO CARDÁPIO - TAMANHOS
// ============================================
const TAMANHOS = [
    { id: 'broto', nome: 'Broto', fatias: 2, sabores: 1, index: 0 },
    { id: 'pequena', nome: 'Pequena', fatias: 4, sabores: 2, index: 1 },
    { id: 'media', nome: 'Média', fatias: 6, sabores: 2, index: 2 },
    { id: 'grande', nome: 'Grande', fatias: 8, sabores: 3, index: 3 }
];

// ============================================
// DADOS DO CARDÁPIO - BORDAS
// ============================================
const BORDAS = [
    { id: 'nenhuma', nome: 'Sem Borda', preco: 0 },
    { id: 'cream-cheese', nome: 'Cream Cheese', preco: 18 },
    { id: 'catupiry', nome: 'Catupiry', preco: 18 },
    { id: 'cheddar', nome: 'Cheddar', preco: 18 },
    { id: 'chocolate', nome: 'Chocolate', preco: 18 },
    { id: 'goiabada', nome: 'Goiabada', preco: 18 },
    { id: 'doce-leite', nome: 'Doce de Leite', preco: 18 }
];

// ============================================
// DADOS DO CARDÁPIO - PIZZAS SALGADAS
// ============================================
const PIZZAS_SALGADAS = [
    { id: 1, name: 'Mussarela', description: 'Molho, mussarela, parmesão, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Mussarela.jpeg' },
    { id: 2, name: 'Portuguesa', description: 'Molho, mussarela, presunto, tomate, ovos, cebola, pimentão, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Portuguesaa.jpeg' },
    { id: 3, name: 'Tradicional', description: 'Molho, mussarela, presunto, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Tradicional.jpeg' },
    { id: 4, name: 'Napolitana', description: 'Molho, mussarela, tomate, parmesão, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Napolitana.jpeg' },
    { id: 5, name: 'Calabresa', description: 'Molho, mussarela, calabresa, cebola, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Calabresa.jpeg' },
    { id: 6, name: 'Calabresa Especial', description: 'Molho, calabresa moída, mussarela, catupiry, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Calabresa-especial.jpeg' },
    { id: 7, name: 'Toscana', description: 'Molho, calabresa moída, mussarela, catupiry, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Toscana.jpeg' },
    { id: 8, name: 'Dom Camilo', description: 'Molho, mussarela, presunto, calabresa, creme de leite, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Dom-Camilo.jpeg' },
    { id: 9, name: 'Mexicana', description: 'Molho, mussarela, pimenta jalapeño, carne moída, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Mexicana.jpeg' },
    { id: 10, name: 'Catupiry', description: 'Molho, mussarela, catupiry, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Catupiry.jpeg' },
    { id: 11, name: 'Frango com Catupiry', description: 'Molho, mussarela, peito de frango, catupiry, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Frango-Catupiry.jpeg' },
    { id: 12, name: 'Frango Especial', description: 'Molho, mussarela, peito de frango, cebola, tomate seco, manjericão, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Frango-especial.jpeg' },
    { id: 13, name: 'À Brasileira', description: 'Molho, mussarela, peito de frango, milho verde, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/A-Brasileira.jpeg' },
    { id: 14, name: 'Atum', description: 'Molho, mussarela, atum, cebola, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Atum.jpeg' },
    { id: 15, name: 'Pizza Hit', description: 'Molho, mussarela, catupiry, presunto, bacon, champignon, cebola, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/hit.jpeg' },
    { id: 16, name: 'Marguerita', description: 'Molho, mussarela, manjericão fresco, tomate, parmesão, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Margherita.jpeg' },
    { id: 17, name: 'Marguerita Especial', description: 'Molho, mussarela, manjericão fresco, tomate, alho gratinado, tomate seco, parmesão, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Margherita-especial.jpeg' },
    { id: 18, name: 'Aliche', description: 'Molho, mussarela, aliche, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Aliche.jpeg' },
    { id: 19, name: 'Bacon', description: 'Molho, mussarela, bacon, ovos, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Bacon.jpeg' },
    { id: 20, name: 'Alho e Óleo', description: 'Molho, mussarela, alho frito, azeite, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Alho-e-Oleo.jpeg' },
    { id: 21, name: 'Lombo ao Creme', description: 'Molho, mussarela, lombinho canadense, requeijão cremoso, tomate, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Lombo-ao-Creme.jpeg' },
    { id: 22, name: 'Genovesa', description: 'Molho, mussarela, pesto genovês, tomate, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Genovesa.jpeg' },
    { id: 23, name: 'Palmito', description: 'Molho, mussarela, palmito, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Palmito.jpeg' },
    { id: 24, name: 'Quatro Queijos', description: 'Molho, mussarela, provolone, catupiry, parmesão, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Quatro-Queijos.jpeg' },
    { id: 25, name: 'Super Hit', description: 'Molho, mussarela, catupiry, presunto, calabresa, bacon, champignon, requeijão, cebola, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Super-hit.jpeg' },
    { id: 26, name: 'Caprese', description: 'Molho, mussarela, tomate, manjericão, mussarela de búfala, pasta de azeitona preta, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/caprese.jpeg' },
    { id: 27, name: 'Pizza do Chef', description: 'Molho, mussarela, ricota, tomate cereja, manjericão, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Pizza-do-chef.jpeg' },
    { id: 28, name: 'Dom Valério', description: 'Molho, mussarela, bacon, calabresa, catupiry, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Dom-Valerio.jpeg' },
    { id: 29, name: 'Moda Aracì', description: 'Molho, mussarela, frango, milho, catupiry, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/moda-araci.jpeg' },
    { id: 30, name: 'Vegetariana', description: 'Molho, mussarela, champignon, tomate, cebola, pimentão verde, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Vegetariana.jpeg' },
    { id: 31, name: 'Escarola', description: 'Molho, mussarela, escarola refogada, alho, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Escarola.jpeg' },
    { id: 32, name: 'Brócolis', description: 'Molho, mussarela, brócolis, alho, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Brocolis.jpeg' },
    { id: 33, name: 'Brócolis com Berinjela', description: 'Molho, mussarela, brócolis, berinjela, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/brocolis-berinjela.jpeg' },
    { id: 34, name: 'Berinjela', description: 'Molho, mussarela, berinjela, tomate, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Berinjela.jpeg' },
    { id: 35, name: 'Rúcula', description: 'Molho, mussarela, rúcula, tomate seco, mussarela de búfala, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Rucula.jpeg' },
    { id: 36, name: 'Milho', description: 'Molho, mussarela, milho verde, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/milho.jpeg' },
    { id: 37, name: 'Milho com Catupiry', description: 'Molho, mussarela, milho verde, catupiry, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Milho-com-catupiry.jpeg' },
    { id: 38, name: 'Super Portuguesa', description: 'Molho, mussarela, presunto, calabresa, tomate, ovos, cebola, azeitona, pimentão e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Super-Portuguesa.jpeg' },
    { id: 39, name: 'Super Quatro Queijos', description: 'Molho, mussarela, provolone, catupiry, parmesão, gorgonzola, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Super-quatro-queijos.jpeg' },
    { id: 40, name: 'Strogonoff de Frango', description: 'Molho, mussarela, peito de frango, creme de leite, palmito, azeitona, orégano e batata palha', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/strogonoff-frango.jpeg' },
    { id: 41, name: 'Strogonoff de Filé', description: 'Molho, mussarela, filé, creme de leite, champignon, batata palha, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Strogonoff-file.jpeg' },
    { id: 42, name: 'Filé Especial', description: 'Molho, mussarela, filé, tomate cereja, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/File-Especial.jpeg' },
    { id: 43, name: 'Pantaneira', description: 'Molho, mussarela, carne seca, cebola, pimenta, azeitona e orégano', prices: [53.90, 76.90, 93.90, 102.90], image: 'media/flavors/ifood_ready/Pantanera.jpeg' },
    { id: 44, name: 'Suíça', description: 'Molho, mussarela, presunto, queijo suíço, azeitona e orégano', prices: [51.90, 73.90, 84.90, 98.90], image: 'media/flavors/ifood_ready/Suica.jpeg' },
    { id: 45, name: 'Camarão', description: 'Molho, mussarela, camarão, catupiry, azeitona e orégano', prices: [71.90, 81.90, 112.90, 119.90], image: 'media/flavors/ifood_ready/Camarao.jpeg' },
    { id: 46, name: 'Bacalhau', description: 'Molho, mussarela, bacalhau, cebola, pimentão, azeitona e orégano', prices: [71.90, 81.90, 112.90, 119.90], image: 'media/flavors/ifood_ready/Bacalhau.jpeg' },
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

// ============================================
// DADOS DO CARDÁPIO - PIZZAS DOCES
// ============================================
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

// ============================================
// DADOS DO CARDÁPIO - BEBIDAS
// ============================================
const BEBIDAS = [
    // Refrigerantes 1.5L
    { id: 201, name: 'Coca-Cola 1,5L', price: 14.00, image: 'media/drinks_nobg/Coca-cola.png', category: 'refrigerante' },
    { id: 202, name: 'Coca-Cola Zero 1,5L', price: 14.00, image: 'media/drinks_nobg/Coca-zero.png', category: 'refrigerante' },
    { id: 203, name: 'Guaraná Antarctica 1,5L', price: 13.00, image: 'media/drinks_nobg/guarana-litro-removebg-preview.png', category: 'refrigerante' },
    { id: 204, name: 'Guaraná Zero 1,5L', price: 13.00, image: 'media/drinks_nobg/guarana-zero-litro-removebg-preview.png', category: 'refrigerante' },
    { id: 205, name: 'Sprite 1,5L', price: 13.00, image: 'media/drinks_nobg/Sprite.png', category: 'refrigerante' },
    { id: 206, name: 'Fanta 1,5L', price: 13.00, image: 'media/drinks_nobg/Fanta.png', category: 'refrigerante' },
    { id: 207, name: 'Água Mineral Puríssima 1,5L', price: 10.00, image: 'media/drinks_nobg/purissima-1.5l-removebg-preview.png', category: 'agua' },
    // Refrigerantes Lata
    { id: 208, name: 'Coca-Cola Lata 310ml', price: 8.90, image: 'media/drinks_nobg/coca-cola-310ml-1-removebg-preview.png', category: 'refrigerante' },
    { id: 209, name: 'Coca Zero Lata 310ml', price: 8.90, image: 'media/drinks_nobg/coca-zero-310ml.png', category: 'refrigerante' },
    { id: 210, name: 'Guaraná Lata 350ml', price: 8.90, image: 'media/drinks_nobg/Guarana-lata.png', category: 'refrigerante' },
    { id: 211, name: 'Guaraná Zero Lata 350ml', price: 8.90, image: 'media/drinks_nobg/guarana-lata-zero.png', category: 'refrigerante' },
    { id: 212, name: 'Schweppes Citrus 310ml', price: 8.90, image: 'media/drinks_nobg/schweppes-310ml-removebg-preview.png', category: 'refrigerante' },
    { id: 213, name: 'Schweppes Tônica 310ml', price: 8.90, image: 'media/drinks_nobg/schweppes-tonica-310ml-removebg-preview.png', category: 'refrigerante' },
    { id: 214, name: 'Sprite Lata 350ml', price: 8.90, image: 'media/drinks_nobg/sprite-lata.png', category: 'refrigerante' },
    { id: 215, name: 'Fanta Lata 350ml', price: 8.90, image: 'media/drinks_nobg/Fanta-lata.png', category: 'refrigerante' },
    // Águas
    { id: 216, name: 'Água Mineral Puríssima 497ml', price: 6.00, image: 'media/drinks_nobg/purissima-497ml-removebg-preview.png', category: 'agua' },
    { id: 217, name: 'Água com Gás Puríssima 497ml', price: 7.90, image: 'media/drinks_nobg/purissima-497ml-comgas-removebg-preview.png', category: 'agua' },
    { id: 218, name: 'Aquárius Lemon 510ml', price: 8.00, image: 'media/drinks_nobg/Aquarius-lemon.png', category: 'agua' }
];

// ============================================
// DADOS DO CARDÁPIO - CERVEJAS
// ============================================
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

// ============================================
// DADOS DO CARDÁPIO - SUCOS
// ============================================
const SUCOS = [
    // Sucos Naturais 1L
    { id: 401, name: 'Suco de Laranja 1L', description: 'Suco natural de laranja', price: 29.90, image: null, category: 'natural' },
    { id: 402, name: 'Suco Laranja com Acerola 1L', description: 'Suco natural de laranja com acerola', price: 29.90, image: null, category: 'natural' },
    { id: 403, name: 'Suco de Abacaxi 1L', description: 'Suco natural de abacaxi', price: 29.90, image: null, category: 'natural' },
    { id: 404, name: 'Suco de Limão 1L', description: 'Suco natural de limão', price: 29.90, image: null, category: 'natural' },
    { id: 405, name: 'Suco de Maracujá 1L', description: 'Suco natural de maracujá', price: 29.90, image: null, category: 'natural' },
    { id: 406, name: 'Suco Verde 1L', description: 'Laranja, couve, hortelã, manjericão e gengibre', price: 29.90, image: null, category: 'natural' },
    { id: 407, name: 'Suco Vermelho 1L', description: 'Laranja, cenoura e beterraba', price: 29.90, image: null, category: 'natural' },
    { id: 408, name: 'Suco Abacaxi com Hortelã 1L', description: 'Suco natural de abacaxi com hortelã', price: 29.90, image: null, category: 'natural' },
    // Sucos de Polpa 1L
    { id: 409, name: 'Suco de Acerola 1L', description: 'Suco de polpa de acerola', price: 29.90, image: null, category: 'polpa' },
    { id: 410, name: 'Suco de Morango 1L', description: 'Suco de polpa de morango', price: 29.90, image: null, category: 'polpa' },
    { id: 411, name: 'Suco de Uva 1L', description: 'Suco de polpa de uva', price: 29.90, image: null, category: 'polpa' }
];

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================
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

// ============================================
// UTILITÁRIOS
// ============================================
const Utils = {
    /**
     * Formata valor para moeda brasileira
     */
    formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    /**
     * Verifica se está aberto baseado no horário
     */
    isOpen() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        
        // Segunda-feira fechado (day = 1)
        if (day === CONFIG.diaSemanaFechado) return false;
        
        // Verifica horário de funcionamento
        return hour >= CONFIG.horarioAbertura && hour < CONFIG.horarioFechamento;
    },

    /**
     * Gera ID único para itens do carrinho
     */
    generateCartItemId() {
        return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Mostra toast de notificação
     */
    showToast(message) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
};

// ============================================
// RENDERIZAÇÃO
// ============================================
const Render = {
    /**
     * Atualiza badge de status (Aberto/Fechado)
     */
    updateStatusBadge() {
        const badge = document.getElementById('status-badge');
        const isOpen = Utils.isOpen();
        badge.textContent = isOpen ? 'Aberto agora' : 'Fechado';
        badge.className = `text-xs px-2 py-0.5 rounded-full inline-block ${isOpen ? 'status-open' : 'status-closed'}`;
    },

    /**
     * Retorna o placeholder correto baseado no tipo
     */
    getPlaceholder(type) {
        return CONFIG.placeholders[type] || CONFIG.placeholders.pizza;
    },

    /**
     * Renderiza card de pizza (compacto para 3 colunas)
     */
    createPizzaCard(pizza) {
        const minPrice = Math.min(...pizza.prices);
        const isDoce = pizza.id >= 100;
        const placeholder = isDoce ? CONFIG.placeholders.pizzaDoce : CONFIG.placeholders.pizza;
        const imageSrc = pizza.image || placeholder;
        
        return `
            <div class="product-card bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer active:scale-95 transition-transform" onclick="App.openPizzaModal(${pizza.id}, '${isDoce ? 'doce' : 'salgada'}')">
                <div class="aspect-square overflow-hidden">
                    <img src="${imageSrc}" alt="${pizza.name}" 
                         class="w-full h-full object-cover"
                         onerror="this.src='${placeholder}'">
                </div>
                <div class="p-2">
                    <h3 class="font-semibold text-gray-800 text-xs leading-tight line-clamp-2 mb-1">${pizza.name}</h3>
                    <p class="text-primary font-bold text-xs">${Utils.formatCurrency(minPrice)}</p>
                </div>
            </div>
        `;
    },

    /**
     * Renderiza card de bebida/cerveja
     */
    createDrinkCard(drink, type = 'bebida') {
        const placeholder = CONFIG.placeholders[type] || CONFIG.placeholders.bebida;
        const imageSrc = drink.image || placeholder;
        const hasRealImage = drink.image !== null;
        
        // Bebidas com imagem real usam fundo neutro + object-contain para PNG transparente
        // Bebidas sem imagem usam o placeholder com object-cover
        const bgColor = hasRealImage ? 'bg-gradient-to-b from-gray-100 to-gray-200' : '';
        const objectFit = hasRealImage ? 'object-contain p-4' : 'object-cover';
        
        return `
            <div class="drink-card bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer" onclick="App.openDrinkModal(${drink.id}, '${type}')">
                <div class="aspect-square ${bgColor} flex items-center justify-center">
                    <img src="${imageSrc}" alt="${drink.name}" 
                         class="w-full h-full ${objectFit}"
                         onerror="this.src='${placeholder}'; this.classList.remove('object-contain', 'p-4'); this.classList.add('object-cover');">
                </div>
                <div class="p-3 text-center">
                    <h3 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">${drink.name}</h3>
                    ${drink.description ? `<p class="text-gray-400 text-xs mb-1 line-clamp-1">${drink.description}</p>` : ''}
                    <p class="text-primary font-bold">${Utils.formatCurrency(drink.price)}</p>
                </div>
            </div>
        `;
    },

    /**
     * Renderiza todas as seções do menu
     */
    renderMenu() {
        // Pizzas Salgadas
        const salgadasGrid = document.getElementById('pizzas-salgadas-grid');
        salgadasGrid.innerHTML = PIZZAS_SALGADAS.map(p => this.createPizzaCard(p)).join('');

        // Pizzas Doces
        const docesGrid = document.getElementById('pizzas-doces-grid');
        docesGrid.innerHTML = PIZZAS_DOCES.map(p => this.createPizzaCard(p)).join('');

        // Bebidas
        const bebidasGrid = document.getElementById('bebidas-grid');
        bebidasGrid.innerHTML = BEBIDAS.map(d => this.createDrinkCard(d, 'bebida')).join('');

        // Sucos
        const sucosGrid = document.getElementById('sucos-grid');
        sucosGrid.innerHTML = SUCOS.map(d => this.createDrinkCard(d, 'suco')).join('');

        // Cervejas
        const cervejasGrid = document.getElementById('cervejas-grid');
        cervejasGrid.innerHTML = CERVEJAS.map(d => this.createDrinkCard(d, 'cerveja')).join('');
    },

    /**
     * Renderiza opções de tamanho no modal
     */
    renderSizeOptions() {
        const container = document.getElementById('size-options');
        const pizza = AppState.currentPizza;
        
        container.innerHTML = TAMANHOS.map(size => `
            <div class="size-option border-2 rounded-xl p-4 cursor-pointer transition-all ${AppState.selectedSize?.id === size.id ? 'selected' : ''}" 
                 onclick="App.selectSize('${size.id}')">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-bold text-gray-800">${size.nome}</h4>
                        <p class="text-sm text-gray-500">${size.fatias} fatias • até ${size.sabores} sabor(es)</p>
                    </div>
                    <div class="text-right">
                        <p class="text-primary font-bold text-lg">${Utils.formatCurrency(pizza.prices[size.index])}</p>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * Renderiza opções de sabores no modal
     */
    renderFlavorOptions() {
        const container = document.getElementById('flavor-options');
        const allPizzas = AppState.currentPizza.id >= 100 ? PIZZAS_DOCES : PIZZAS_SALGADAS;
        const sizeIndex = AppState.selectedSize.index;
        
        container.innerHTML = allPizzas.map(pizza => {
            const isSelected = AppState.selectedFlavors.some(f => f.id === pizza.id);
            return `
                <div class="flavor-option border-2 rounded-xl p-3 cursor-pointer transition-all flex items-center gap-3 ${isSelected ? 'selected' : ''}" 
                     onclick="App.toggleFlavor(${pizza.id})">
                    <div class="flavor-checkbox flex-shrink-0"></div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-gray-800 truncate">${pizza.name}</h4>
                        <p class="text-xs text-gray-500 truncate">${pizza.description}</p>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <p class="text-primary font-bold">${Utils.formatCurrency(pizza.prices[sizeIndex])}</p>
                    </div>
                </div>
            `;
        }).join('');

        // Atualiza info de sabores
        const maxFlavors = AppState.selectedSize.sabores;
        document.getElementById('flavor-info').textContent = 
            `Selecione até ${maxFlavors} sabor(es). O preço será pelo sabor de maior valor.`;
    },

    /**
     * Renderiza opções de borda no modal
     */
    renderBordaOptions() {
        const container = document.getElementById('borda-options');
        container.innerHTML = BORDAS.map(borda => `
            <label class="borda-option border-2 rounded-xl p-3 cursor-pointer transition-all block ${AppState.selectedBorda?.id === borda.id ? 'selected' : ''}" 
                   onclick="App.selectBorda('${borda.id}')">
                <div class="text-center">
                    <p class="font-semibold text-gray-800">${borda.nome}</p>
                    <p class="text-sm ${borda.preco > 0 ? 'text-primary font-bold' : 'text-gray-500'}">
                        ${borda.preco > 0 ? '+ ' + Utils.formatCurrency(borda.preco) : 'Incluso'}
                    </p>
                </div>
            </label>
        `).join('');
    },

    /**
     * Atualiza indicadores de step
     */
    updateStepIndicators() {
        const steps = document.querySelectorAll('.step-indicator');
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            const circle = step.querySelector('span:first-child');
            const text = step.querySelector('span:last-child');
            
            if (stepNum < AppState.currentStep) {
                step.classList.remove('opacity-50');
                circle.className = 'w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold';
                circle.innerHTML = '<i class="fas fa-check text-xs"></i>';
                text.className = 'text-sm font-medium text-gray-800';
            } else if (stepNum === AppState.currentStep) {
                step.classList.remove('opacity-50');
                circle.className = 'w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold';
                circle.textContent = stepNum;
                text.className = 'text-sm font-medium text-gray-800';
            } else {
                step.classList.add('opacity-50');
                circle.className = 'w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold';
                circle.textContent = stepNum;
                text.className = 'text-sm font-medium text-gray-500';
            }
        });
    },

    /**
     * Atualiza total no modal
     */
    updateModalTotal() {
        const totalEl = document.getElementById('modal-total');
        totalEl.textContent = Utils.formatCurrency(App.calculatePizzaPrice());
    },

    /**
     * Renderiza itens do carrinho
     */
    renderCartItems() {
        const container = document.getElementById('cart-items');
        
        if (AppState.cart.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <i class="fas fa-shopping-cart text-4xl mb-3"></i>
                    <p>Seu carrinho está vazio</p>
                </div>
            `;
            return;
        }

        container.innerHTML = AppState.cart.map((item, index) => `
            <div class="cart-item flex items-start gap-3 p-3 border-b">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">${item.name}</h4>
                    <p class="text-xs text-gray-500">${item.details}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-primary">${Utils.formatCurrency(item.price)}</p>
                    <button class="remove-item-btn text-xs text-gray-400 mt-1 px-2 py-1 rounded" onclick="App.removeFromCart(${index})">
                        <i class="fas fa-trash-alt mr-1"></i>Remover
                    </button>
                </div>
            </div>
        `).join('');
    },

    /**
     * Atualiza contador do carrinho
     */
    updateCartCount() {
        const countEl = document.getElementById('cart-count');
        const count = AppState.cart.length;
        
        if (count > 0) {
            countEl.textContent = count;
            countEl.classList.remove('hidden');
            document.getElementById('cart-float-btn').classList.add('pulse-cart');
            setTimeout(() => document.getElementById('cart-float-btn').classList.remove('pulse-cart'), 300);
        } else {
            countEl.classList.add('hidden');
        }
    },

    /**
     * Atualiza total do carrinho
     */
    updateCartTotal() {
        const total = AppState.cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('cart-total').textContent = Utils.formatCurrency(total);
    }
};

// ============================================
// APLICAÇÃO PRINCIPAL
// ============================================
const App = {
    /**
     * Inicializa a aplicação
     */
    init() {
        Render.renderMenu();
        this.setupEventListeners();
        this.setupCategoryNavigation();
    },

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Modal de pizza
        document.getElementById('modal-overlay').addEventListener('click', () => this.closePizzaModal());
        document.getElementById('close-modal').addEventListener('click', () => this.closePizzaModal());
        document.getElementById('prev-step').addEventListener('click', () => this.prevStep());
        document.getElementById('next-step').addEventListener('click', () => this.nextStep());

        // Modal do carrinho
        document.getElementById('cart-float-btn').addEventListener('click', () => this.openCart());
        document.getElementById('cart-overlay').addEventListener('click', () => this.closeCart());
        document.getElementById('close-cart').addEventListener('click', () => this.closeCart());
        document.getElementById('checkout-btn').addEventListener('click', () => this.checkout());

        // Modal de bebida
        document.getElementById('drink-overlay').addEventListener('click', () => this.closeDrinkModal());
        document.getElementById('close-drink-modal').addEventListener('click', () => this.closeDrinkModal());
        document.getElementById('drink-qty-minus').addEventListener('click', () => this.changeDrinkQty(-1));
        document.getElementById('drink-qty-plus').addEventListener('click', () => this.changeDrinkQty(1));
        document.getElementById('add-drink-btn').addEventListener('click', () => this.addDrinkToCart());

        // Busca
        const searchInput = document.getElementById('search-input');
        const clearSearch = document.getElementById('clear-search');
        
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            clearSearch.classList.add('hidden');
            this.clearSearch();
        });

        // Banner de informações
        document.getElementById('info-btn').addEventListener('click', () => {
            document.getElementById('info-banner').classList.toggle('hidden');
        });
        document.getElementById('close-info-banner').addEventListener('click', () => {
            document.getElementById('info-banner').classList.add('hidden');
        });

    },

    /**
     * Processa busca
     */
    handleSearch(query) {
        const clearBtn = document.getElementById('clear-search');
        
        if (query.trim().length === 0) {
            clearBtn.classList.add('hidden');
            this.clearSearch();
            return;
        }
        
        clearBtn.classList.remove('hidden');
        
        if (query.trim().length < 2) return;
        
        this.performSearch(query.trim().toLowerCase());
    },

    /**
     * Executa busca
     */
    performSearch(query) {
        const results = [];
        
        // Busca em pizzas salgadas
        PIZZAS_SALGADAS.forEach(pizza => {
            if (pizza.name.toLowerCase().includes(query) || 
                pizza.description.toLowerCase().includes(query)) {
                results.push({ type: 'pizza', subtype: 'salgada', item: pizza });
            }
        });
        
        // Busca em pizzas doces
        PIZZAS_DOCES.forEach(pizza => {
            if (pizza.name.toLowerCase().includes(query) || 
                pizza.description.toLowerCase().includes(query)) {
                results.push({ type: 'pizza', subtype: 'doce', item: pizza });
            }
        });
        
        // Busca em bebidas
        BEBIDAS.forEach(drink => {
            if (drink.name.toLowerCase().includes(query)) {
                results.push({ type: 'drink', subtype: 'bebida', item: drink });
            }
        });
        
        // Busca em sucos
        SUCOS.forEach(drink => {
            if (drink.name.toLowerCase().includes(query) || 
                (drink.description && drink.description.toLowerCase().includes(query))) {
                results.push({ type: 'drink', subtype: 'suco', item: drink });
            }
        });
        
        // Busca em cervejas
        CERVEJAS.forEach(drink => {
            if (drink.name.toLowerCase().includes(query)) {
                results.push({ type: 'drink', subtype: 'cerveja', item: drink });
            }
        });
        
        this.showSearchResults(results);
    },

    /**
     * Mostra resultados da busca
     */
    showSearchResults(results) {
        // Esconde todas as seções do cardápio
        const allSections = document.getElementById('all-sections');
        if (allSections) allSections.classList.add('hidden');
        
        // Mostra seção de resultados
        const section = document.getElementById('search-results');
        const grid = document.getElementById('search-results-grid');
        const noResults = document.getElementById('no-results');
        
        section.classList.remove('hidden');
        
        if (results.length === 0) {
            grid.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }
        
        noResults.classList.add('hidden');
        
        grid.innerHTML = results.map(r => {
            if (r.type === 'pizza') {
                return Render.createPizzaCard(r.item);
            } else {
                return Render.createDrinkCard(r.item, r.subtype);
            }
        }).join('');
    },

    /**
     * Limpa busca e volta ao menu
     */
    clearSearch() {
        document.getElementById('search-results').classList.add('hidden');
        const allSections = document.getElementById('all-sections');
        if (allSections) allSections.classList.remove('hidden');
    },

    /**
     * Configura navegação de categorias (não mais necessário - layout único)
     */
    setupCategoryNavigation() {
        // Layout único - não há mais navegação por abas
    },

    /**
     * Abre modal de pizza
     */
    openPizzaModal(pizzaId, type) {
        const pizzas = type === 'doce' ? PIZZAS_DOCES : PIZZAS_SALGADAS;
        const pizza = pizzas.find(p => p.id === pizzaId);
        
        if (!pizza) return;

        // Reset estado
        AppState.currentPizza = pizza;
        AppState.currentStep = 1;
        AppState.selectedSize = null;
        AppState.selectedFlavors = [pizza]; // Já adiciona o sabor clicado
        AppState.selectedMassa = 'tradicional';
        AppState.selectedBorda = BORDAS[0];

        // Atualiza UI
        document.getElementById('modal-title').textContent = pizza.name;
        Render.renderSizeOptions();
        Render.updateStepIndicators();
        Render.updateModalTotal();

        // Mostra step 1, esconde outros
        document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
        document.getElementById('step-1').classList.remove('hidden');

        // Botões
        document.getElementById('prev-step').classList.add('hidden');
        document.getElementById('next-step').innerHTML = 'Próximo<i class="fas fa-arrow-right ml-2"></i>';

        // Abre modal
        document.getElementById('pizza-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Fecha modal de pizza
     */
    closePizzaModal() {
        document.getElementById('pizza-modal').classList.add('hidden');
        document.body.style.overflow = '';
    },

    /**
     * Seleciona tamanho
     */
    selectSize(sizeId) {
        AppState.selectedSize = TAMANHOS.find(s => s.id === sizeId);
        
        // Limita sabores selecionados ao máximo do tamanho
        if (AppState.selectedFlavors.length > AppState.selectedSize.sabores) {
            AppState.selectedFlavors = AppState.selectedFlavors.slice(0, AppState.selectedSize.sabores);
        }
        
        Render.renderSizeOptions();
        Render.updateModalTotal();
    },

    /**
     * Alterna sabor selecionado
     */
    toggleFlavor(pizzaId) {
        const allPizzas = AppState.currentPizza.id >= 100 ? PIZZAS_DOCES : PIZZAS_SALGADAS;
        const pizza = allPizzas.find(p => p.id === pizzaId);
        
        const index = AppState.selectedFlavors.findIndex(f => f.id === pizzaId);
        
        if (index >= 0) {
            // Remove se já está selecionado (mas mantém pelo menos 1)
            if (AppState.selectedFlavors.length > 1) {
                AppState.selectedFlavors.splice(index, 1);
            }
        } else {
            // Adiciona se não atingiu o limite
            if (AppState.selectedFlavors.length < AppState.selectedSize.sabores) {
                AppState.selectedFlavors.push(pizza);
            } else {
                Utils.showToast(`Máximo ${AppState.selectedSize.sabores} sabor(es) para ${AppState.selectedSize.nome}`);
            }
        }
        
        Render.renderFlavorOptions();
        Render.updateModalTotal();
    },

    /**
     * Seleciona borda
     */
    selectBorda(bordaId) {
        AppState.selectedBorda = BORDAS.find(b => b.id === bordaId);
        Render.renderBordaOptions();
        Render.updateModalTotal();
    },

    /**
     * Calcula preço da pizza atual
     */
    calculatePizzaPrice() {
        if (!AppState.selectedSize) return 0;
        
        const sizeIndex = AppState.selectedSize.index;
        
        // Pega o maior preço entre os sabores selecionados
        const maxFlavorPrice = Math.max(...AppState.selectedFlavors.map(f => f.prices[sizeIndex]));
        
        // Adiciona preço da borda
        const bordaPrice = AppState.selectedBorda?.preco || 0;
        
        return maxFlavorPrice + bordaPrice;
    },

    /**
     * Vai para próximo step
     */
    nextStep() {
        if (AppState.currentStep === 1) {
            if (!AppState.selectedSize) {
                Utils.showToast('Selecione um tamanho');
                return;
            }
            AppState.currentStep = 2;
            Render.renderFlavorOptions();
        } else if (AppState.currentStep === 2) {
            if (AppState.selectedFlavors.length === 0) {
                Utils.showToast('Selecione pelo menos 1 sabor');
                return;
            }
            AppState.currentStep = 3;
            Render.renderBordaOptions();
            
            // Setup radio de massa
            document.querySelectorAll('input[name="massa"]').forEach(input => {
                input.checked = input.value === AppState.selectedMassa;
                input.addEventListener('change', (e) => {
                    AppState.selectedMassa = e.target.value;
                });
            });
        } else if (AppState.currentStep === 3) {
            // Adiciona ao carrinho
            this.addPizzaToCart();
            return;
        }

        // Atualiza UI
        document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
        document.getElementById(`step-${AppState.currentStep}`).classList.remove('hidden');
        Render.updateStepIndicators();

        // Atualiza botões
        document.getElementById('prev-step').classList.remove('hidden');
        if (AppState.currentStep === 3) {
            document.getElementById('next-step').innerHTML = '<i class="fas fa-cart-plus mr-2"></i>Adicionar';
        }
    },

    /**
     * Volta para step anterior
     */
    prevStep() {
        if (AppState.currentStep > 1) {
            AppState.currentStep--;
            
            document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
            document.getElementById(`step-${AppState.currentStep}`).classList.remove('hidden');
            Render.updateStepIndicators();

            // Atualiza botões
            if (AppState.currentStep === 1) {
                document.getElementById('prev-step').classList.add('hidden');
            }
            document.getElementById('next-step').innerHTML = 'Próximo<i class="fas fa-arrow-right ml-2"></i>';
        }
    },

    /**
     * Adiciona pizza ao carrinho
     */
    addPizzaToCart() {
        const flavorNames = AppState.selectedFlavors.map(f => f.name).join(' + ');
        const sizeName = AppState.selectedSize.nome;
        const massaName = AppState.selectedMassa === 'tradicional' ? 'Tradicional' : 'Fina';
        const bordaName = AppState.selectedBorda.nome;
        
        let details = `${sizeName} (${AppState.selectedSize.fatias} fatias) • Massa ${massaName}`;
        if (AppState.selectedBorda.preco > 0) {
            details += ` • Borda ${bordaName}`;
        }

        const cartItem = {
            id: Utils.generateCartItemId(),
            type: 'pizza',
            name: `Pizza ${flavorNames}`,
            details: details,
            price: this.calculatePizzaPrice(),
            data: {
                flavors: [...AppState.selectedFlavors],
                size: AppState.selectedSize,
                massa: AppState.selectedMassa,
                borda: AppState.selectedBorda
            }
        };

        AppState.cart.push(cartItem);
        Render.updateCartCount();
        Utils.showToast('Pizza adicionada ao carrinho!');
        this.closePizzaModal();

        // Meta Pixel - AddToCart Event
        if (typeof fbq !== 'undefined') {
            fbq('track', 'AddToCart', {
                content_name: cartItem.name,
                content_type: 'product',
                value: cartItem.price,
                currency: 'BRL'
            });
        }
    },

    /**
     * Abre modal de bebida
     */
    openDrinkModal(drinkId, type = 'bebida') {
        const allDrinks = [...BEBIDAS, ...CERVEJAS, ...SUCOS];
        const drink = allDrinks.find(d => d.id === drinkId);
        
        if (!drink) return;

        AppState.currentDrink = drink;
        AppState.drinkQty = 1;

        const placeholder = CONFIG.placeholders[type] || CONFIG.placeholders.bebida;
        const imageSrc = drink.image || placeholder;
        const titleText = type === 'suco' ? 'Adicionar Suco' : 
                          type === 'cerveja' ? 'Adicionar Cerveja' : 'Adicionar Bebida';

        document.getElementById('drink-modal-title').textContent = titleText;
        document.getElementById('drink-modal-name').textContent = drink.name;
        document.getElementById('drink-modal-price').textContent = Utils.formatCurrency(drink.price);
        document.getElementById('drink-modal-image').src = imageSrc;
        document.getElementById('drink-modal-image').onerror = function() { this.src = placeholder; };
        document.getElementById('drink-qty').textContent = '1';

        document.getElementById('drink-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Fecha modal de bebida
     */
    closeDrinkModal() {
        document.getElementById('drink-modal').classList.add('hidden');
        document.body.style.overflow = '';
    },

    /**
     * Altera quantidade de bebida
     */
    changeDrinkQty(delta) {
        AppState.drinkQty = Math.max(1, AppState.drinkQty + delta);
        document.getElementById('drink-qty').textContent = AppState.drinkQty;
    },

    /**
     * Adiciona bebida ao carrinho
     */
    addDrinkToCart() {
        for (let i = 0; i < AppState.drinkQty; i++) {
            const cartItem = {
                id: Utils.generateCartItemId(),
                type: 'drink',
                name: AppState.currentDrink.name,
                details: 'Bebida',
                price: AppState.currentDrink.price,
                data: { drink: AppState.currentDrink }
            };
            AppState.cart.push(cartItem);
        }

        Render.updateCartCount();
        Utils.showToast(`${AppState.drinkQty}x ${AppState.currentDrink.name} adicionado!`);
        this.closeDrinkModal();

        // Meta Pixel - AddToCart Event
        if (typeof fbq !== 'undefined') {
            fbq('track', 'AddToCart', {
                content_name: AppState.currentDrink.name,
                content_type: 'product',
                value: AppState.currentDrink.price * AppState.drinkQty,
                currency: 'BRL'
            });
        }
    },

    /**
     * Abre carrinho
     */
    openCart() {
        Render.renderCartItems();
        Render.updateCartTotal();
        document.getElementById('cart-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Meta Pixel - InitiateCheckout Event
        if (typeof fbq !== 'undefined' && AppState.cart.length > 0) {
            const total = AppState.cart.reduce((sum, item) => sum + item.price, 0);
            fbq('track', 'InitiateCheckout', {
                value: total,
                currency: 'BRL',
                num_items: AppState.cart.length
            });
        }
    },

    /**
     * Fecha carrinho
     */
    closeCart() {
        document.getElementById('cart-modal').classList.add('hidden');
        document.body.style.overflow = '';
    },

    /**
     * Remove item do carrinho
     */
    removeFromCart(index) {
        AppState.cart.splice(index, 1);
        Render.renderCartItems();
        Render.updateCartTotal();
        Render.updateCartCount();
    },

    /**
     * Valida campo e destaca erro
     */
    validateField(fieldId, message) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        
        if (!value) {
            field.classList.add('shake', 'border-red-500');
            setTimeout(() => field.classList.remove('shake', 'border-red-500'), 500);
            field.focus();
            Utils.showToast(message);
            return false;
        }
        return true;
    },

    /**
     * Finaliza pedido via WhatsApp
     */
    checkout() {
        const name = document.getElementById('customer-name').value.trim();
        const cpf = document.getElementById('customer-cpf').value.trim();
        const cep = document.getElementById('customer-cep').value.trim();
        const complemento = document.getElementById('customer-complemento').value.trim();

        if (AppState.cart.length === 0) {
            Utils.showToast('Carrinho vazio!');
            return;
        }

        // Monta mensagem
        let message = `🍕 *NOVO PEDIDO - PIZZARIA HIT*\n\n`;
        
        // Dados do cliente (se preenchidos)
        const hasCustomerData = name || cpf || cep || complemento;
        if (hasCustomerData) {
            message += `� *DADOS DO CLIENTE:*\n`;
            if (name) message += `👤 Nome: ${name}\n`;
            if (cpf) message += `🪪 CPF: ${cpf}\n`;
            if (cep) message += `📍 CEP: ${cep}\n`;
            if (complemento) message += `🏠 Complemento: ${complemento}\n`;
            message += `\n`;
        }
        
        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `📋 *ITENS DO PEDIDO:*\n\n`;

        AppState.cart.forEach((item, i) => {
            message += `${i + 1}. *${item.name}*\n`;
            message += `   ${item.details}\n`;
            message += `   💰 ${Utils.formatCurrency(item.price)}\n\n`;
        });

        const total = AppState.cart.reduce((sum, item) => sum + item.price, 0);
        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `💵 *TOTAL: ${Utils.formatCurrency(total)}*\n\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `⏳ *AGUARDE A CONFIRMAÇÃO*\n\n`;
        message += `Agradecemos pelo seu pedido! Um de nossos atendentes entrará em contato em instantes para confirmar os detalhes, informar o valor da taxa de entrega e o tempo estimado para chegada do seu pedido.\n\n`;
        message += `📱 Fique com o celular por perto!\n\n`;
        message += `🍕 *Pizzaria Hit*`;

        // Codifica e abre WhatsApp
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');

        // Meta Pixel - Contact Event (Pedido finalizado via WhatsApp)
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact', {
                value: total,
                currency: 'BRL'
            });
        }

        // Limpa carrinho e campos
        AppState.cart = [];
        Render.updateCartCount();
        this.closeCart();
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-cpf').value = '';
        document.getElementById('customer-cep').value = '';
        document.getElementById('customer-complemento').value = '';
    }
};

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

