const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ler = (arquivo) => fs.readFileSync(path.join(__dirname, '..', arquivo), 'utf8');

// O site e o painel dividem o mesmo endereço, então script de fora rodando no site
// alcança o que o painel guarda no navegador. Script de CDN tem que vir com integrity.
test('scripts de outros domínios em index.html têm integrity e crossorigin', () => {
    const tags = [...ler('index.html').matchAll(/<script[^>]*\ssrc="https?:\/\/[^"]+"[^>]*>/g)].map(m => m[0]);
    assert.ok(tags.length >= 2);
    for (const tag of tags) {
        assert.match(tag, /\sintegrity="sha(384|512)-[A-Za-z0-9+/=]+"/, tag);
        assert.match(tag, /\scrossorigin="anonymous"/, tag);
    }
});

test('o painel não carrega nada de outro domínio', () => {
    assert.doesNotMatch(ler('admin/index.html'), /\s(src|href)="(https?:)?\/\//);
});
