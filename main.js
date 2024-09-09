const cardBoard = document.querySelector("#cardboard");
const placar = document.querySelector('#pontos');
const erros = document.querySelector('#erro');
const segundosElement = document.querySelector('#segundos');
const startButton = document.querySelector('#Start');
let pontos = 0;
let erro = 0;
let segundos = 0;
let timer;

const imgs = [
  'vue.svg',
  'angular.svg',
  'react.svg',
  'ember.svg', 
  'js-badge.svg',
  'aurelia.svg',
];

function generateRan() {
  var max = 6;
  var random = [];
  for (var i = 0; i < max; i++) {
    var temp = Math.floor(Math.random() * max);
    if (random.indexOf(temp) == -1) {
      random.push(temp);
    } else {
      i--;
    }
  }
  return random;
}

function createBoard() {
  const valores1 = generateRan();
  const valores2 = generateRan();
  
  let cardHTML1 = "";
  let cardHTML2 = "";
  
  for (var i = 0; i < 6; i++) {
    cardHTML1 += `<div class="memory-card" data-card="${imgs[valores1[i]]}">
    <img class="front-face" src="./img/${imgs[valores1[i]]}"/>
    <img class="back-face" src="backbone.svg" style="backface-visibility: hidden;" />
  </div>`;
    cardHTML2 += `<div class="memory-card" data-card="${imgs[valores2[i]]}">
    <img class="front-face" src="./img/${imgs[valores2[i]]}"/>
    <img class="back-face" src="backbone.svg" style="backface-visibility: hidden;">
  </div>`;
  }
  
  cardBoard.innerHTML = cardHTML1 + cardHTML2;
}

/** Fim da Renderização HTML */

let firstCard, secondCard;
let lockCards = false;

function flipCard() {
  if (lockCards) return false;
  if (this === firstCard) return false;

  this.classList.add("flip");

  if (!firstCard) {
    firstCard = this;
    return false;
  }

  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.card === secondCard.dataset.card;

  !isMatch ? unFlipCards() : pontuarCartas();
}

function pontuarCartas() {
  pontos++;
  placar.innerText = 'PONTUAÇÃO: ' + pontos;
  resetCards(true);
  if (pontos === 6) {
    clearInterval(timer); // Parar o temporizador quando o jogo termina
    setTimeout(() => {
      if (pontos > erro) {
        placar.innerText = "VOCÊ GANHOU!!";
        placar.style.color = 'blue';
      } else if (pontos === erro) {
        placar.style.color = 'darkcyan';
        placar.innerText = "EMPATE!";
      } else if (pontos < erro) {
        placar.innerText = "VOCÊ PERDEU!!";
        placar.style.color = 'red';
      }
    }, 2000);
  }
}

function unFlipCards() {
  lockCards = true;
  erro++;
  erros.innerText = 'ERROS: ' + erro;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetCards();
  }, 1000);
}

function resetCards(isMatch = false) {
  if (isMatch) {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
  }

  [firstCard, secondCard, lockCards] = [null, null, false];
}

function startGame() {
  // Resetar o temporizador se já estiver rodando
  if (timer) {
    clearInterval(timer);
  }
  segundos = 0;
  segundosElement.textContent = 'segundos: ' + segundos;

  // Iniciar o temporizador
  timer = setInterval(() => {
    segundos++;
    segundosElement.textContent = 'segundos: ' + segundos;
  }, 1000);

  // Resetar o placar e os erros
  pontos = 0;
  erro = 0;
  placar.innerText = 'PONTUAÇÃO: 0';
  erros.innerText = 'ERROS: 0';

  // Criar o tabuleiro
  createBoard();

  // Resetar os cartões
  const cards = document.querySelectorAll(".memory-card");
  cards.forEach(card => card.classList.remove('flip'));
  cards.forEach(card => card.addEventListener("click", flipCard));
}

startButton.addEventListener('click', startGame);
