/**
 * Cofre da senha do painel.
 * O token do GitHub fica cifrado (AES-256-GCM, chave PBKDF2-SHA256) em admin/chave.json.
 * O arquivo é público: a proteção é a senha. Quanto mais curta ou óbvia, mais fácil de quebrar.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.Cofre = api;
})(typeof self !== 'undefined' ? self : this, function () {
    const ALFABETO = 'abcdefghjkmnpqrstuvwxyz23456789'; // sem i, l, o, 0, 1
    const ITERACOES = 600000;
    const cripto = globalThis.crypto;

    const paraBase64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
    const deBase64 = (texto) => Uint8Array.from(atob(texto), c => c.charCodeAt(0));
    const normalizar = (senha) => String(senha).toLowerCase().replace(/[^a-z0-9]/g, '');

    function gerarSenha() {
        const letras = [];
        const limite = 256 - (256 % ALFABETO.length); // descarta bytes que enviesariam o sorteio
        while (letras.length < 10) {
            for (const byte of cripto.getRandomValues(new Uint8Array(32))) {
                if (byte < limite && letras.length < 10) letras.push(ALFABETO[byte % ALFABETO.length]);
            }
        }
        return letras.join('').match(/.{5}/g).join('-');
    }

    async function derivarChave(senha, salt, iteracoes) {
        const base = await cripto.subtle.importKey('raw', new TextEncoder().encode(normalizar(senha)), 'PBKDF2', false, ['deriveKey']);
        return cripto.subtle.deriveKey(
            { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iteracoes },
            base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    }

    async function cifrar(token, senha) {
        const salt = cripto.getRandomValues(new Uint8Array(16));
        const iv = cripto.getRandomValues(new Uint8Array(12));
        const chave = await derivarChave(senha, salt, ITERACOES);
        const dados = await cripto.subtle.encrypt({ name: 'AES-GCM', iv }, chave, new TextEncoder().encode(token));
        return { v: 1, iter: ITERACOES, salt: paraBase64(salt), iv: paraBase64(iv), dados: paraBase64(dados) };
    }

    async function decifrar(cofre, senha) {
        try {
            const chave = await derivarChave(senha, deBase64(cofre.salt), cofre.iter);
            const claro = await cripto.subtle.decrypt({ name: 'AES-GCM', iv: deBase64(cofre.iv) }, chave, deBase64(cofre.dados));
            return new TextDecoder().decode(claro);
        } catch (erro) {
            throw new Error('SENHA_ERRADA');
        }
    }

    return { gerarSenha, normalizar, cifrar, decifrar };
});
