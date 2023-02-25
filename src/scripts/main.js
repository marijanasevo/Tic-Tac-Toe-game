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

// Choice buttons & slider
const xSelected = document.querySelector('.player-selection__x-selected');
const oSelected = document.querySelector('.player-selection__o-selected');
const slider = document.querySelector('.player-selection__choice__slider');

// Start game buttons
const startGameBtns = document.querySelectorAll('.start-game__button');

// Board
const board = document.querySelector('.board');
const boardFields = document.querySelectorAll('.board__field');

// Modals
const winnerModal = document.querySelector('.modal__winner');
const tieModal = document.querySelector('.modal__tie');
const restartModal = document.querySelector('.modal__restart');

// Game variables
let currentPlayer = 'x';
let gameBoard = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];
let oponent;

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

  if(isResolved() == 'o won') {
    winnerModal?.classList.add('displayed');
  } else if (isResolved() == 'x won') {
    winnerModal?.classList.add('displayed');
  } else if (isResolved() == 'tie') {
    tieModal?.classList.add('displayed');
  }

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
  if(/222|2...2...2|2..-.2.-..2|2-.2.-2/.test(currentBoard)) return 'o won';
  if(/111|1...1...1|1..-.1.-..1|1-.1.-1/.test(currentBoard)) return 'x won';
  if(/0/.test(currentBoard)) return 'in progress';
  return 'tie';
}

oSelected?.addEventListener('click', toggleSelectedPlayer);
xSelected?.addEventListener('click', toggleSelectedPlayer);

boardFields.forEach(field => field.addEventListener('click', playMove));



//initialize new game
// function initializeGame() {
//   let selectedMark = slider.classList.contains('x-selected') ? 'x' : 'o';
//   console.log(selectedMark);

//   if (this.classList.contains('vs-pc')) {
//     goesfirst
//   } else {
    
//   }

//   console.log(slider?.classList.value);
 
// }

// startGameBtns.forEach(button => button.addEventListener('click', initializeGame));


