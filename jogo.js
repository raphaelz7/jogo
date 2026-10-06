const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const pontuacaoEl = document.getElementById("pontuacao");
const recordeEl = document.getElementById("recorde");
const gameOverEl = document.getElementById("gameOver");
const reiniciarBtn = document.getElementById("reiniciar");

const LARGURA = canvas.width;
const ALTURA = canvas.height;
const CHAO = 245;

let jogando = true;
let pontos = 0;
let recorde = Number(localStorage.getItem("dinoRecorde")) || 0;
let velocidade = 6;
let nivel = 0;
let ultimoTempo = 0;
let animacao = 0;
let agachado = false;

recordeEl.textContent = "HI " + String(recorde).padStart(5, "0");

const dino = {
    x: 80,
    y: CHAO - 50,
    largura: 40,
    altura: 50,
    velocidadeY: 0,
    gravidade: 0.65,
    pulo: -11,
    noChao: true
};

const obstaculos = [];
const nuvens = [];

const marcas = [];

for (let i = 0; i < 45; i++) {
    marcas.push({
        x: i * 25,
        y: CHAO + 10 + Math.random() * 18,
        largura: 12 + Math.random() * 18
    });
}

for (let i = 0; i < 5; i++) {
    nuvens.push({
        x: Math.random() * LARGURA,
        y: 40 + Math.random() * 70,
        largura: 35 + Math.random() * 35,
        velocidade: 0.25 + Math.random() * 0.3
    });
}

function atualizarPontuacao(dt) {
    pontos += dt / 111;

    const inteiro = Math.floor(pontos);

    if (inteiro > recorde) {
        recorde = inteiro;
        localStorage.setItem("dinoRecorde", recorde);
    }

    pontuacaoEl.textContent =
        String(inteiro).padStart(5, "0");

    recordeEl.textContent =
        "HI " + String(recorde).padStart(5, "0");

    const novoNivel = Math.floor(inteiro / 100);

    if (novoNivel !== nivel) {
        nivel = novoNivel;
        velocidade = Math.min(13, 6 + nivel * 0.35);
    }

    const ciclo = Math.floor(inteiro / 700);
    document.body.classList.toggle("noite", ciclo % 2 === 1);
}

function atualizarDino(dt) {
    dino.velocidadeY += dino.gravidade;
    dino.y += dino.velocidadeY;

    const alturaAtual =
        agachado && dino.noChao ? 40 : 50;

    if (dino.y >= CHAO - alturaAtual) {
        dino.y = CHAO - alturaAtual;
        dino.velocidadeY = 0;
        dino.noChao = true;
    } else {
        dino.noChao = false;
    }

    animacao += dt;
}

function desenharDino() {
    const x = dino.x;
    const y = dino.y;

    ctx.fillStyle =
        document.body.classList.contains("noite")
            ? "#fff"
            : "#535353";

    // Agachado
    if (agachado && dino.noChao) {
        // cauda curta
        ctx.fillRect(x - 4, y + 17, 10, 7);
        ctx.fillRect(x - 10, y + 13, 8, 7);

        // corpo compacto
        ctx.fillRect(x + 5, y + 12, 29, 19);

        // pescoço
        ctx.fillRect(x + 27, y + 5, 8, 18);

        // cabeça curta
        ctx.fillRect(x + 32, y + 3, 18, 16);

        // focinho bem curto
        ctx.fillRect(x + 47, y + 9, 6, 7);

        // olho
        ctx.fillStyle = document.body.classList.contains("noite")
            ? "#202124"
            : "#fff";

        ctx.fillRect(x + 42, y + 6, 3, 3);

        // pernas
        ctx.fillStyle =
            document.body.classList.contains("noite")
                ? "#fff"
                : "#535353";

        ctx.fillRect(x + 10, y + 29, 6, 9);
        ctx.fillRect(x + 24, y + 29, 6, 9);

        ctx.fillRect(x + 8, y + 37, 9, 3);
        ctx.fillRect(x + 22, y + 37, 9, 3);

        return;
    }

    // Cauda curta
    ctx.fillRect(x - 3, y + 27, 10, 7);
    ctx.fillRect(x - 9, y + 23, 8, 7);

    // Corpo
    ctx.fillRect(x + 5, y + 17, 27, 23);

    // Pescoço
    ctx.fillRect(x + 25, y + 8, 9, 24);

    // Cabeça compacta
    ctx.fillRect(x + 29, y + 4, 18, 18);

    // Focinho curto
    ctx.fillRect(x + 43, y + 10, 6, 7);

    // Olho
    ctx.fillStyle =
        document.body.classList.contains("noite")
            ? "#202124"
            : "#fff";

    ctx.fillRect(x + 39, y + 7, 3, 3);

    ctx.fillStyle =
        document.body.classList.contains("noite")
            ? "#fff"
            : "#535353";

    // Braço
    ctx.fillRect(x + 27, y + 25, 5, 12);
    ctx.fillRect(x + 31, y + 34, 7, 4);

    // Pernas retas, sem abrir para os lados
    if (Math.floor(animacao / 120) % 2 === 0) {
        ctx.fillRect(x + 9, y + 38, 6, 10);
        ctx.fillRect(x + 8, y + 47, 8, 3);

        ctx.fillRect(x + 23, y + 38, 6, 10);
        ctx.fillRect(x + 22, y + 47, 8, 3);
    } else {
        ctx.fillRect(x + 9, y + 38, 6, 8);
        ctx.fillRect(x + 8, y + 45, 8, 3);

        ctx.fillRect(x + 23, y + 38, 6, 8);
        ctx.fillRect(x + 22, y + 45, 8, 3);
    }
}

function atualizarChao(dt) {
    const deslocamento = velocidade * dt / 16.67;

    for (const marca of marcas) {
        marca.x -= deslocamento;

        if (marca.x + marca.largura < 0) {
            marca.x = LARGURA + Math.random() * 30;
            marca.y = CHAO + 10 + Math.random() * 18;
            marca.largura = 12 + Math.random() * 18;
        }
    }
}

function desenharChao() {
    ctx.fillStyle =
        document.body.classList.contains("noite")
            ? "#fff"
            : "#535353";

    ctx.fillRect(0, CHAO, LARGURA, 2);

    for (const marca of marcas) {
        ctx.fillRect(
            marca.x,
            marca.y,
            marca.largura,
            2
        );
    }
}

function atualizarNuvens(dt) {
    for (const nuvem of nuvens) {
        nuvem.x -= nuvem.velocidade * dt / 16.67;

        if (nuvem.x + nuvem.largura < 0) {
            nuvem.x = LARGURA + Math.random() * 100;
        }
    }
}

function desenharNuvens() {
    ctx.fillStyle =
        document.body.classList.contains("noite")
            ? "#777"
            : "#d9d9d9";

    for (const nuvem of nuvens) {
        ctx.fillRect(
            nuvem.x,
            nuvem.y,
            nuvem.largura,
            5
        );

        ctx.fillRect(
            nuvem.x + 8,
            nuvem.y - 5,
            nuvem.largura * 0.45,
            6
        );
    }
}

function criarCacto() {
    const tamanho = 28 + Math.random() * 30;

    obstaculos.push({
        tipo: "cacto",
        x: LARGURA + 20,
        y: CHAO - tamanho,
        largura: 15 + Math.random() * 8,
        altura: tamanho
    });

    if (Math.random() < 0.3) {
        obstaculos.push({
            tipo: "cacto",
            x: LARGURA + 42,
            y: CHAO - tamanho * 0.8,
            largura: 13,
            altura: tamanho * 0.8
        });
    }
}

function criarPterodactilo() {
    const alturas = [
        CHAO - 90,
        CHAO - 125,
        CHAO - 155
    ];

    obstaculos.push({
        tipo: "ptero",
        x: LARGURA + 20,
        y: alturas[Math.floor(Math.random() * alturas.length)],
        largura: 42,
        altura: 20,
        fase: 0
    });
}

let proximoObstaculo = 900;

function atualizarObstaculos(dt) {
    proximoObstaculo -= dt;

    if (proximoObstaculo <= 0) {
        if (pontos >= 450 && Math.random() < 0.3) {
            criarPterodactilo();
        } else {
            criarCacto();
        }

        proximoObstaculo =
            900 + Math.random() * 900 - nivel * 20;

        if (proximoObstaculo < 450) {
            proximoObstaculo = 450;
        }
    }

    for (let i = obstaculos.length - 1; i >= 0; i--) {
        const o = obstaculos[i];

        o.x -= velocidade * dt / 16.67;

        if (o.tipo === "ptero") {
            o.fase += dt;
        }

        if (o.x + o.largura < 0) {
            obstaculos.splice(i, 1);
        }
    }
}

function desenharObstaculos() {
    ctx.fillStyle =
        document.body.classList.contains("noite")
            ? "#fff"
            : "#2e7d32";

    for (const o of obstaculos) {
        if (o.tipo === "cacto") {
            ctx.fillRect(
                o.x,
                o.y,
                o.largura,
                o.altura
            );

            ctx.fillRect(
                o.x - 8,
                o.y + o.altura * 0.4,
                8,
                6
            );

            ctx.fillRect(
                o.x + o.largura,
                o.y + o.altura * 0.25,
                8,
                6
            );
        } else {
            const batida =
                Math.sin(o.fase / 100) > 0;

            ctx.fillRect(
                o.x + 8,
                o.y + 8,
                28,
                5
            );

            if (batida) {
                ctx.fillRect(
                    o.x + 2,
                    o.y,
                    15,
                    9
                );
                ctx.fillRect(
                    o.x + 27,
                    o.y + 2,
                    15,
                    7
                );
            } else {
                ctx.fillRect(
                    o.x + 3,
                    o.y + 5,
                    15,
                    9
                );
                ctx.fillRect(
                    o.x + 26,
                    o.y,
                    15,
                    9
                );
            }

            ctx.fillRect(
                o.x + 35,
                o.y + 7,
                7,
                4
            );
        }
    }
}

function colisao() {
    const alturaDino =
        agachado && dino.noChao ? 40 : 50;

    const dx = dino.x + 3;
    const dy = dino.y + 4;
    const dw = 43;
    const dh = alturaDino - 7;

    for (const o of obstaculos) {
        const ox = o.x + 2;
        const oy = o.y + 2;
        const ow = o.largura - 4;
        const oh = o.altura - 4;

        if (
            dx < ox + ow &&
            dx + dw > ox &&
            dy < oy + oh &&
            dy + dh > oy
        ) {
            gameOver();
            return;
        }
    }
}

function gameOver() {
    jogando = false;
    gameOverEl.classList.add("mostrar");
}

function reiniciar() {
    pontos = 0;
    nivel = 0;
    velocidade = 6;
    proximoObstaculo = 900;

    obstaculos.length = 0;

    dino.y = CHAO - 50;
    dino.velocidadeY = 0;
    dino.noChao = true;

    agachado = false;
    jogando = true;

    gameOverEl.classList.remove("mostrar");
    document.body.classList.remove("noite");
}

function pular() {
    if (!jogando) {
        reiniciar();
        return;
    }

    if (dino.noChao) {
        dino.velocidadeY = dino.pulo;
        dino.noChao = false;
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        pular();
    }

    if (e.code === "ArrowDown") {
        e.preventDefault();
        agachado = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowDown") {
        agachado = false;
    }
});

reiniciarBtn.addEventListener("click", reiniciar);

function loop(tempo) {
    if (!ultimoTempo) ultimoTempo = tempo;

    const dt = Math.min(
        tempo - ultimoTempo,
        50
    );

    ultimoTempo = tempo;

    if (jogando) {
        atualizarNuvens(dt);
        atualizarChao(dt);
        atualizarDino(dt);
        atualizarObstaculos(dt);
        atualizarPontuacao(dt);
        colisao();
    }

    ctx.clearRect(0, 0, LARGURA, ALTURA);

    desenharNuvens();
    desenharChao();
    desenharObstaculos();
    desenharDino();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);