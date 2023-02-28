// God bless this mess ++++++++++
// I promise I'll refactor and clean this up

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
const labelScoreX = document.querySelector('.board__score-x .label');
const labelScoreO = document.querySelector('.board__score-o .label');
const scoreX = document.querySelector('.board__score-x .value');
const scoreTie = document.querySelector('.board__score-tie .value');
const scoreO = document.querySelector('.board__score-o .value');

// Modals
const modals = document.querySelectorAll('.modal');
const winnerModal = document.querySelector('.modal__winner');
const whoTakesHeading = document.querySelector('.wins-round');
const whoTakesMessage = document.querySelector('.won-lost-tie');
const tieModal = document.querySelector('.modal__tie');
const restartModal = document.querySelector('.modal__restart');

// Buttons
const quitButtons = document.querySelectorAll('.cancel-button');
const nextRoundBtns = document.querySelectorAll('.next-button');
const logoToMenuBtn = document.querySelector('.board__logo');
const restartPromptButton = document.querySelector('.board__restart');
const restartButton = document.querySelector('.restart-button');

// Game variables
let currentPlayer = 'x'; // goes first
let gameBoard;
let opponent; // human, cpu
let playerOneMark; // x, o
// p1, p2, cpu, you
let x; 
let o;
let aiPlayer;
let huPlayer;
let vsCPU = false;

let score;

// initialize new game
function initializeGame() {
  playerOneMark = slider.classList.contains('x-selected') ? 'x' : 'o';
  opponent = (this.classList.value.includes('cpu')) ? 'cpu' : 'human';
  vsCPU = (opponent == 'cpu') ? true : false;

  x = (opponent == 'cpu' && playerOneMark == 'x') ? 'you' : 
      (opponent == 'cpu' && playerOneMark == 'o') ? 'cpu' :
      (opponent == 'human' && playerOneMark == 'x') ? 'p1' : 'p2';

  o = (opponent == 'cpu' && playerOneMark == 'x') ? 'cpu' : 
      (opponent == 'cpu' && playerOneMark == 'o') ? 'you' :
      (opponent == 'human' && playerOneMark == 'x') ? 'p2' : 'p1';

      console.log(playerOneMark, opponent, x, o, vsCPU);

  gameBoard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  
  score = {
    playerX: 0,
    playerO: 0,
    ties: 0
  };

  menuScreen?.classList.remove('displayed');
  board?.classList.add('displayed');
  labelScoreX.innerHTML = `X (${x})`;
  labelScoreO.innerHTML = `O (${o})`;

  if (vsCPU) {
    aiPlayer = (playerOneMark == 'x') ? 'o' : 'x';
    huPlayer = (aiPlayer == 'x') ? 'o' : 'x'; 
  }

  // if cpu goes first
  if (vsCPU && playerOneMark == 'o') {
    computerPlaysMove(true);
  }
}

function playMove() {
  if (this.classList.contains('occupied')) return;

  const row = this.dataset.row;
  const column = this.dataset.col; 

  gameBoard[row][column] = (currentPlayer == 'x') ? 1 : 2;

  this.classList.add('occupied', currentPlayer);

  // Checking if the game is resolved
  let status = isGameOver();

  if (status.result.includes('won')) playerWon(status.result, status.indexes);
  if (status.result.includes('tie')) itsATie();

  switchPlayers();
}

function computerPlaysMove(playsFirst = false) {
  if (!isGameOver(false).result.includes('progress')) return;

  let field;

  if (playsFirst) {
    field = document.querySelector(`[data-row="0"][data-col="0"]`);
  } else {
    const {index: [row, col]} = minimax(gameBoard, aiPlayer);
    field = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  }
  console.log(field);
  playMove.call(field);
}

function switchPlayers() {
  currentPlayer = (currentPlayer == 'x') ? 'o' : 'x';
  board?.classList.toggle('turn-x');
  board?.classList.toggle('turn-o');

  // ako je kraj igre, i kompjuter prvi sledeci igra dont 
  if (vsCPU && currentPlayer === aiPlayer ) {
    // setTimeout(computerPlaysMove, 1000);

    computerPlaysMove();
  }

}

function isGameOver(update = true) {
  // 000-000-000
  let currentBoard = gameBoard.join('-').replace(/,/g, '');

  //row|  column |     \     |   /   
  if(/111|1...1...1|1..-.1.-..1|1-.1.-1/.test(currentBoard)) {
    if (update) { 
      scoreX.innerHTML = ++score.playerX; 
      return { result: 'x won', indexes: getWinningIndexes(1) };
    }
    
    return { result: 'x won', indexes: getWinningIndexes(1) };
  }

  if(/222|2...2...2|2..-.2.-..2|2-.2.-2/.test(currentBoard)) {
    if (update) {
      scoreO.innerHTML = ++score.playerO;
      return { result: 'o won', indexes: getWinningIndexes(2) };
    }
    
    return { result: 'o won'};
  }

  if(/0/.test(currentBoard)) return { result: 'in progress', indexes: null };

  if (update) scoreTie.innerHTML = ++score.ties;
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
  whoTakesHeading?.classList.add(takesRound);
  let takesMessage = (takesRound == 'x' && x == 'cpu' || takesRound == 'o' && o == 'cpu') ? 'Oh no, you lost..' :
                     (takesRound == 'x' && x == 'you' || takesRound == 'o' && o == 'you') ? 'Yes, you win!' :
                     ((takesRound == 'x') ? x : o) + ' wins';
                     
  whoTakesMessage.innerHTML = takesMessage;

  // console.log(playerOneMark, opponent, x, o); o cpu CPU YOU

  boardFields.forEach((field, i) => {
    if (i == indexes[0] || i == indexes[1] || i == indexes[2]) {
      setTimeout(() => {
        field.classList.add('win');
        if (i == indexes[2]) setTimeout(showModal, 600);
      }, 200 * i);
    }
  });

  function showModal() {
    winnerModal?.classList.add('displayed'), 700;
  }
}

function itsATie() {
  setTimeout(() => tieModal?.classList.add('displayed'), 700);
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

  if (vsCPU && aiPlayer == currentPlayer) setTimeout(() => computerPlaysMove(true), 100);
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

// Computer's turn logic

function emptyFields(board) {
  let emptySpots = [];
  
  board.forEach((row, i) => row.forEach((cell, j) => {
    if (cell == 0) emptySpots.push([i,j]);
  }));

  return emptySpots;
}

function minimax(board, player) {
  let availSpots = emptyFields(board); // [[column, row], [column, row]]

  // if ai wins, return 10
  // if hu wins, return -10
  // if tie, return 0
  if (isGameOver(false).result.includes(aiPlayer + ' won')) {
    return {score: 10};
  } else if (isGameOver(false).result.includes(huPlayer + ' won')) {
    return {score: -10};
  } else if (availSpots.length === 0) return {score: 0};

  const moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    // move.index = gameBoard[availSpots[i][0]][availSpots[i][1]];
    move.index = availSpots[i];

    // changing the board to try out a move
    board[availSpots[i][0]][availSpots[i][1]] = (player == 'x') ? 1 : 2;

    if (player == aiPlayer) {
      let result = minimax(board, huPlayer);
      move.score = result.score;
    } else {
      let result = minimax(board, aiPlayer);
      move.score = result.score;
    }

    // resseting the board to what it was
    board[availSpots[i][0]][availSpots[i][1]] = 0;
    moves.push(move);
  }

  // if it is the computer's turn loop over the moves and choose the move with the highest score
  var bestMove;
  if(player === aiPlayer) {
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++) {
      if(moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    // else loop over the moves and choose the move with the lowest score
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++) {
      if(moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  // return the chosen move (object) from the moves array
  return moves[bestMove];
}

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

oSelected?.addEventListener('click', toggleSelectedPlayer);
xSelected?.addEventListener('click', toggleSelectedPlayer);

boardFields.forEach(field => field.addEventListener('click', playMove));

quitButtons.forEach(quitBtn => quitBtn.addEventListener('click', quit));
nextRoundBtns.forEach(nexRoundBtn => nexRoundBtn.addEventListener('click', nextRound));

startGameBtns.forEach(button => button.addEventListener('click', initializeGame));
logoToMenuBtn?.addEventListener('click', quit);
restartPromptButton?.addEventListener('click', showRestartModal);
restartButton?.addEventListener('click', restartGame)