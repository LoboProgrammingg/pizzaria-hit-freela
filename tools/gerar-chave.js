#!/usr/bin/env node
// Gera a senha do painel e o arquivo admin/chave.json (token do GitHub cifrado com essa senha).
// Uso: node tools/gerar-chave.js [--senha-arquivo caminho] [--sem-conferir] [--saida caminho]
// Rode num terminal seu. O token é digitado sem aparecer na tela.
// Senha: a primeira linha de --senha-arquivo, ou a que você digitar, ou uma sorteada (Enter).
const fs = require('node:fs');
const path = require('node:path');
const Cofre = require('../admin/cofre.js');

const RAIZ = path.join(__dirname, '..');
const args = process.argv.slice(2);
const semConferir = args.includes('--sem-conferir');
const opcao = (nome) => args.includes(nome) ? path.resolve(args[args.indexOf(nome) + 1]) : null;
const saida = opcao('--saida') || path.join(RAIZ, 'admin', 'chave.json');
const arquivoDaSenha = opcao('--senha-arquivo');

const SENHA_MINIMA = 8;

function conferirSenha(senha) {
    if (Cofre.normalizar(senha).length < SENHA_MINIMA) {
        throw new Error(`Senha curta demais: precisa de pelo menos ${SENHA_MINIMA} letras ou números.`);
    }
    return senha.trim();
}

function perguntar(pergunta) {
    const leitor = require('node:readline').createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => leitor.question(pergunta, (resposta) => { leitor.close(); resolve(resposta.trim()); }));
}

async function escolherSenha() {
    if (arquivoDaSenha) return conferirSenha(fs.readFileSync(arquivoDaSenha, 'utf8').split('\n')[0]);
    if (!process.stdin.isTTY) return Cofre.gerarSenha();
    const digitada = await perguntar('Senha que a pizzaria vai usar (Enter para eu criar uma): ');
    return digitada ? conferirSenha(digitada) : Cofre.gerarSenha();
}

function lerConfig() {
    const janela = {};
    new Function('window', fs.readFileSync(path.join(RAIZ, 'admin', 'config.js'), 'utf8'))(janela);
    return janela.PAINEL_CONFIG;
}

function lerToken() {
    const entrada = process.stdin;
    if (!entrada.isTTY) {
        return new Promise((resolve) => {
            let texto = '';
            entrada.on('data', (p) => { texto += p; });
            entrada.on('end', () => resolve(texto.trim()));
        });
    }
    process.stdout.write('Cole o token do GitHub e aperte Enter (não aparece na tela): ');
    return new Promise((resolve) => {
        let texto = '';
        entrada.setRawMode(true);
        entrada.resume();
        entrada.on('data', function ler(pedaco) {
            for (const letra of pedaco.toString('utf8')) {
                if (letra === '\u0003') { entrada.setRawMode(false); process.stdout.write('\n'); process.exit(1); }
                if (letra === '\r' || letra === '\n') {
                    entrada.setRawMode(false);
                    entrada.pause();
                    entrada.off('data', ler);
                    process.stdout.write('\n');
                    return resolve(texto.trim());
                }
                if (letra === '\u007f') texto = texto.slice(0, -1);
                else texto += letra;
            }
        });
    });
}

async function conferir(token, cfg) {
    const resposta = await fetch(`${cfg.api}/repos/${cfg.owner}/${cfg.repo}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
    });
    if (resposta.status === 401) throw new Error('O GitHub recusou o token (401). Confira se copiou inteiro e se não venceu.');
    if (!resposta.ok) throw new Error(`O token não enxerga ${cfg.owner}/${cfg.repo} (HTTP ${resposta.status}). Marque esse repositório ao criar o token.`);
    const repo = await resposta.json();
    if (!repo.permissions || !repo.permissions.push) throw new Error('O token não pode gravar. Dê a permissão "Contents: Read and write".');
}

async function principal() {
    const cfg = lerConfig();
    const token = await lerToken();
    if (!/^(github_pat_|ghp_)[A-Za-z0-9_]{10,}$/.test(token)) {
        throw new Error('Isso não parece um token do GitHub (deveria começar com github_pat_).');
    }
    if (semConferir) console.log('Pulando a conferência no GitHub (--sem-conferir).');
    else { await conferir(token, cfg); console.log(`Token conferido: grava em ${cfg.owner}/${cfg.repo}.`); }

    const senha = await escolherSenha();
    const cofre = await Cofre.cifrar(token, senha);
    if (await Cofre.decifrar(cofre, senha) !== token) throw new Error('Falha interna ao cifrar.');
    fs.writeFileSync(saida, JSON.stringify(cofre, null, 2) + '\n');

    console.log(`\nArquivo gravado: ${path.relative(process.cwd(), saida)}`);
    if (arquivoDaSenha) console.log(`\nSenha do painel: a primeira linha de ${arquivoDaSenha}\n`);
    else console.log(`\nSenha do painel (anote agora, ela não fica guardada em lugar nenhum):\n\n    ${senha}\n`);
    console.log('Próximo passo: publicar admin/chave.json junto com o site.');
    console.log('Para trocar a senha, rode este comando de novo e publique o arquivo novo.');
    console.log('Se a senha vazou, isso não basta: apague o token no GitHub e crie outro antes de rodar de novo.');
}

principal().catch((erro) => { console.error('\nErro: ' + erro.message); process.exit(1); });
