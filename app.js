const frutas = ['CAQUI', 'CAJU', 'BANANA', 'BATATA', 'MELAO', 'MANGA', 'PERA', 'PESSEGO'];
let sacolas = [];
let jogadorAtual = 0; // Índice do jogador que está jogando atualmente
let jogoEmAndamento = true;

document.getElementById('comecar-jogo').addEventListener('click', iniciarJogo);
document.getElementById('mostrar-regras').addEventListener('click', function() {
    document.getElementById('modal-regras').style.display = 'block';
});

function iniciarJogo() {
    const numeroJogadores = parseInt(document.getElementById('numero-jogadores').value);
    if (numeroJogadores < 2 || numeroJogadores > 4) {
        alert("Por favor, insira um número de jogadores entre 2 e 4.");
        return;
    }

    const sacolasDiv = document.getElementById('sacolas');
    const cartoesDiv = document.getElementById('cartoes');

    sacolasDiv.innerHTML = '';
    cartoesDiv.innerHTML = '';
    sacolas = [];
    jogadorAtual = 0; // Reinicia o turno para o primeiro jogador
    jogoEmAndamento = true; // Reinicia o estado do jogo

    // Embaralhar e distribuir as sacolas e cartões
    embaralharArray(frutas);

    // Criar sacolas, uma para cada jogador
    for (let i = 0; i < numeroJogadores; i++) {
        const fruta = frutas[i];
        sacolas.push({ fruta, conteudo: [] });
        sacolasDiv.innerHTML += `
            <div class="sacola" id="sacola-${i}" data-fruta="${fruta}">
                <strong>${fruta}</strong>
                <div class="cesta-conteudo" id="cesta-${fruta}"></div>
            </div>`;
    }

    // Criar cartões
    for (let i = 0; i < frutas.length; i++) {
        const fruta = frutas[i];
        cartoesDiv.innerHTML += `<div class="cartao" data-fruta="${fruta}">${fruta}</div>`;
    }

    // Mostrar de quem é a vez
    mostrarVezJogador(numeroJogadores);

    // Adicionar eventos de clique aos cartões
    document.querySelectorAll('.cartao').forEach(cartao => {
        cartao.addEventListener('click', () => {
            if (jogoEmAndamento) {
                const fruta = cartao.getAttribute('data-fruta');
                verificarCartao(fruta, cartao, numeroJogadores);
            }
        });
    });
}

// Fechar modal ao clicar no 'x' ou fora do modal
document.querySelector('.fechar').addEventListener('click', function() {
    document.getElementById('modal-regras').style.display = 'none';
});

window.onclick = function(event) {
    if (event.target === document.getElementById('modal-regras')) {
        document.getElementById('modal-regras').style.display = 'none';
    }
}

function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function verificarCartao(fruta, cartaoElement, numeroJogadores) {
    const frutaInicial = fruta.slice(0, 2);
    const sacola = sacolas[jogadorAtual];

    if (sacola.fruta.slice(0, 2) === frutaInicial) {
        sacola.conteudo.push(fruta);
        document.getElementById(`cesta-${sacola.fruta}`).innerHTML += `<span class="fruta">${fruta}</span>`;
        cartaoElement.remove();

        // Declaração de vitória após um acerto
        alert(`Jogador ${jogadorAtual + 1} venceu!`);
        jogoEmAndamento = false;  // Finaliza o jogo
        return;
    } else {
        alert(`A fruta ${fruta} não combina com a sacola de ${sacola.fruta}.`);
    }

    // Passar a vez para o próximo jogador
    jogadorAtual = (jogadorAtual + 1) % numeroJogadores;
    mostrarVezJogador(numeroJogadores);
}

function mostrarVezJogador(numeroJogadores) {
    const vezJogadorDiv = document.getElementById('vez-jogador');
    vezJogadorDiv.textContent = `Vez do Jogador ${jogadorAtual + 1}`;

    // Esconde todas as cestas e mostra apenas a do jogador atual
    sacolas.forEach((_, index) => {
        document.getElementById(`sacola-${index}`).style.display = index === jogadorAtual ? 'block' : 'none';
    });
}