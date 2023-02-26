// Importing images
import '../assets/logo.svg';
import '../assets/icon-x-dark.svg';
import '../assets/icon-o-dark.svg';
import '../assets/icon-x-silver.svg';
import '../assets/icon-restart.svg';
import '../assets/icon-x-outline.svg';
import '../assets/icon-o-outline.svg';
import '../assets/icon-x.svg';
import '../assets/icon-o.svg';

// Importing styles
import '../styles/styles.scss';

// Menu
const menuScreen = document.querySelector('.menu');

// Choice buttons & slider
const xSelected = document.querySelector('.player-selection__x-selected');
const oSelected = document.querySelector('.player-selection__o-selected');
const slider = document.querySelector('.player-selection__choice__slider');

// Start game buttons
const startGameBtns = document.querySelectorAll('.start-game__button');

// Board
const board = document.querySelector('.board');
const boardFields = document.querySelectorAll('.board__field');
// Board counters
const scoreX = document.querySelector('.board__score-x .value');
const scoreTie = document.querySelector('.board__score-tie .value');
const scoreO = document.querySelector('.board__score-o .value');

// Modals
const modals = document.querySelectorAll('.modal');
const winnerModal = document.querySelector('.modal__winner');
const takesHeading = document.querySelector('.wins-round');
const tieModal = document.querySelector('.modal__tie');
const restartModal = document.querySelector('.modal__restart');

// Buttons
const quitButtons = document.querySelectorAll('.cancel-button');
const nextRoundBtns = document.querySelectorAll('.next-button');
const logoToMenuBtn = document.querySelector('.board__logo');
const restartPromptButton = document.querySelector('.board__restart');
const restartButton = document.querySelector('.restart-button');

// Game variables
let currentPlayer = 'x'; // always goes first
let gameBoard;
let oponent; // human or cpu
let opponentMark; // opponent is x or y

let score;

// Toggling menu choice button
function toggleSelectedPlayer() {
  if (this == xSelected) {
    slider?.classList.remove('o-selected');
    slider?.classList.add('x-selected');
  } else {
    slider?.classList.add('o-selected');
    slider?.classList.remove('x-selected');
  }
}

function playMove() {
  if (this.classList.contains('occupied')) return;

  const row = this.dataset.row;
  const column = this.dataset.col; 

  gameBoard[row][column] = (currentPlayer == 'x') ? 1 : 2;

  this.classList.add('occupied', currentPlayer);

  // Checking if the game is resolved
  let status = isResolved();

  if (status.result.includes('won')) playerWon(status.result, status.indexes);
  if (status.result.includes('tie')) itsATie();

  switchPlayers();
}

function switchPlayers() {
  currentPlayer = (currentPlayer == 'x') ? 'o' : 'x';
  board?.classList.toggle('turn-x');
  board?.classList.toggle('turn-o');
}

function isResolved() {
  // 000-000-000
  let currentBoard = gameBoard.join('-').replace(/,/g, '');

  //row|  column |     \     |   /   
  if(/111|1...1...1|1..-.1.-..1|1-.1.-1/.test(currentBoard)) {
    scoreX.innerHTML = ++score.playerOne;
    console.log('score player 1: ' + score.playerOne);
    return { result: 'x won', indexes: getWinningIndexes(1) };
  }

  if(/222|2...2...2|2..-.2.-..2|2-.2.-2/.test(currentBoard)) {
    scoreO.innerHTML = ++score.playerTwo;
    console.log('score player 2: ' + score.playerTwo);
    return { result: 'o won', indexes: getWinningIndexes(2) };
  }

  if(/0/.test(currentBoard)) return { result: 'in progress', indexes: null };

  scoreTie.innerHTML = ++score.ties;
  console.log('score tie: ' + score.tie);
  return { result: 'tie', indexes: null };
}

function getWinningIndexes(player) {

  // check rows
  for (let i = 0; i < 3; i++) {
    if (gameBoard[i][0] == player && gameBoard[i][1] == player && gameBoard[i][2] == player) {
      return (i == 0) ? [0, 1, 2] : (i == 1) ? [3, 4, 5] : [6, 7, 8];
    }
  }

  // check columns
  for (let i = 0; i < 3; i++) {
    if (gameBoard[0][i] == player && gameBoard[1][i] == player && gameBoard[2][i] == player) {
      return (i == 0) ? [0, 3, 6] : (i == 1) ? [1, 4, 7] : [2, 5, 8];
    }
  }

  // check diagonal \
  if (gameBoard[0][0] == player && gameBoard[1][1] == player && gameBoard[2][2] == player) {
    return [0, 4, 8];
  }

  // check diagonal /
  if (gameBoard[0][2] == player && gameBoard[1][1] == player && gameBoard[2][0] == player) {
    return [2, 4, 6]
  }

  return null;
}

function playerWon(winner, indexes) {

  let takesRound = (winner.includes('x')) ? 'x' : 'o';
  takesHeading?.classList.add(takesRound);

  boardFields.forEach((field, i) => {
    if (i == indexes[0] || i == indexes[1] || i == indexes[2]) {
      setTimeout(() => {
        field.classList.add('win');
        if (i == indexes[2]) setTimeout(showModal, 600);
      }, 200 * i);
    }
  });

  function showModal() {
    winnerModal?.classList.add('displayed');
  }
}

function itsATie() {
  tieModal?.classList.add('displayed');
}

function quit() {
  location.reload();
  // board?.classList.remove('displayed');
  // menuScreen?.classList.add('displayed');
  // modals.forEach(modal => modal.classList.remove('displayed'));
}

function nextRound() {
  modals.forEach(modal => modal.classList.remove('displayed'));
  boardFields.forEach(field => field.classList.remove('occupied', 'x', 'o', 'win'));

  gameBoard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
}

// initialize new game
function initializeGame() {
  let selectedMark = slider.classList.contains('x-selected') ? 'x' : 'o';
  let opponent = (this.classList.value.includes('pc')) ? 'pc' : 'human';

  gameBoard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  
  score = {
    playerOne: 0,
    playerTwo: 0,
    ties: 0
  };

  if (this.classList.contains('vs-pc')) {
    // 
  } else {

  }

  menuScreen?.classList.remove('displayed');
  board?.classList.add('displayed');
}

function showRestartModal() {
  restartModal?.classList.add('displayed');
}

function restartGame() {
  gameBoard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  scoreX.innerHTML = scoreO.innerHTML = 0
  boardFields.forEach(field => field.classList.remove('occupied', 'x', 'o', 'win'));
  restartModal.classList.remove('displayed');
}

oSelected?.addEventListener('click', toggleSelectedPlayer);
xSelected?.addEventListener('click', toggleSelectedPlayer);

boardFields.forEach(field => field.addEventListener('click', playMove));

quitButtons.forEach(quitBtn => quitBtn.addEventListener('click', quit));
nextRoundBtns.forEach(nexRoundBtn => nexRoundBtn.addEventListener('click', nextRound));

startGameBtns.forEach(button => button.addEventListener('click', initializeGame));
logoToMenuBtn?.addEventListener('click', quit);
restartPromptButton?.addEventListener('click', showRestartModal);
restartButton?.addEventListener('click', restartGame)