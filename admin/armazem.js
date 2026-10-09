/**
 * Guarda o rascunho e as fotos pendentes no aparelho (IndexedDB),
 * para o trabalho não se perder se o navegador recarregar a aba.
 */
const Armazem = (() => {
    const abrir = () => new Promise((resolve, reject) => {
        const pedido = indexedDB.open('painel-hit', 1);
        pedido.onupgradeneeded = () => pedido.result.createObjectStore('dados');
        pedido.onsuccess = () => resolve(pedido.result);
        pedido.onerror = () => reject(pedido.error);
    });

    async function operar(modo, acao) {
        const banco = await abrir();
        return new Promise((resolve, reject) => {
            const transacao = banco.transaction('dados', modo);
            const pedido = acao(transacao.objectStore('dados'));
            transacao.oncomplete = () => { banco.close(); resolve(pedido.result); };
            transacao.onerror = () => { banco.close(); reject(transacao.error); };
        });
    }

    return {
        ler: (chave) => operar('readonly', loja => loja.get(chave)),
        gravar: (chave, valor) => operar('readwrite', loja => loja.put(valor, chave)),
        apagar: (chave) => operar('readwrite', loja => loja.delete(chave))
    };
})();
