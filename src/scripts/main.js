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

// initialize new game
function initializeGame() {
  let vsCPU = this.classList.value.includes('cpu');
  (vsCPU) ? new TicTacToeVSCPU() : new StandardTicTacToe();
}

class StandardTicTacToe {

  constructor(opponent = 'human') {
    this.defineEventListeners();
    
    this.currentPlayer = this.goesFirst = 'x'; // x plays first initial game
    this.playerOneMark = this.getPlayerOneMark(); // player one <- x || o
    this.opponent = opponent; // <- human || cpu

    this.gameBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];

    this.score = {
      playerX: 0,
      playerO: 0,
      ties: 0
    };

    // this.updateCounterLabels(xLabel, oLabel);
    this.updateCounterLabels();
    this.showBoard();
  }

  showBoard() {
    menuScreen?.classList.remove('displayed');
    this.board?.classList.add('displayed');
  }

  assignPlayerLabels(opponent, playerOneMark) {
    // if (vsHuman) label <- p1 || p2 else label <- cpu || you
    this.xLabel = (opponent == 'cpu'   && playerOneMark == 'x') ? 'you' : 
                  (opponent == 'cpu'   && playerOneMark == 'o') ? 'cpu' :
                  (opponent == 'human' && playerOneMark == 'x') ? 'p1'  : 'p2';

    this.oLabel = (opponent == 'cpu'   && playerOneMark == 'x') ? 'cpu' : 
                  (opponent == 'cpu'   && playerOneMark == 'o') ? 'you' :
                  (opponent == 'human' && playerOneMark == 'x') ? 'p2'  : 'p1';
  }

  updateCounterLabels() {    
    this.assignPlayerLabels(this.opponent, this.playerOneMark);

    this.labelScoreX.innerHTML = `X (${this.xLabel})`;
    this.labelScoreO.innerHTML = `O (${this.oLabel})`;
  }

  updateCounterScore(counter) {
    if (counter == 'x') this.scoreX.innerHTML = ++this.score.playerX; 
    if (counter == 'o') this.scoreO.innerHTML = ++this.score.playerO; 
    if (counter == 'tie') this.scoreTie.innerHTML = ++this.score.ties; 
  }

  playMove(el) {
    // if element is already occupied return
    if (el.classList.contains('occupied')) return;
  
    // otherwise exstract it's row and col data
    const row = el.dataset.row;
    const column = el.dataset.col; 
    
    // mark that field in board array with x: 1 || o: 2
    this.gameBoard[row][column] = (this.currentPlayer == 'x') ? 1 : 2;
  
    // add .occupied and .x || .o classes
    el.classList.add('occupied', this.currentPlayer);

    this.finishTurn();
  }

  finishTurn() {
    // check if isGameOver
    let gameState = this.isGameOver(true);
  
    // if there is a win or tie, process it
    if (gameState.result.includes('won')) this.celebrateWin(gameState);
    if (gameState.result.includes('tie')) this.showModal('tie');
  
    this.switchPlayers();
  }

  switchPlayers() {
    // don't switch if the game is over
    if (this.isGameOver().result != 'in progress') return;
  
    // switch
    this.currentPlayer = (this.currentPlayer == 'x') ? 'o' : 'x';
    this.board?.classList.toggle('turn-x');
    this.board?.classList.toggle('turn-o');
  }

  isGameOver(updateBoard = false) {
    let currentBoard = this.gameBoard.join('-').replace(/,/g, ''); 
    // 000-000-000

    const checkWin = (regex, player, result) => {
      if (regex.test(currentBoard)) {
        // if board should be updated
        if (updateBoard) {
          this.updateCounterScore(player);
          return {result, indexes: this.getWinningIndexes(player == 'x' ? 1 : 2)}
        }
        return { result };
      }
    };
    
    const xWon = checkWin(/111|1...1...1|1..-.1.-..1|1-.1.-1/, 'x', 'x won');
    if (xWon) return xWon;

    const oWon = checkWin(/222|2...2...2|2..-.2.-..2|2-.2.-2/, 'o', 'o won');
    if (oWon) return oWon;
  
    if(/0/.test(currentBoard)) return { result: 'in progress', indexes: null };
  
    if (updateBoard) this.updateCounterScore('tie');
    return { result: 'tie', indexes: null };
  }
  
  getWinningIndexes(player) {
    const checkWin = (cells) => {
      if (cells.every((cell) => cell === player)) {
        return true;
      }
    };
  
    // check rows
    for (let i = 0; i < 3; i++) {
      if (checkWin(this.gameBoard[i])) {
        return [i * 3, i * 3 + 1, i * 3 + 2];
      }
    }
  
    // check columns
    for (let i = 0; i < 3; i++) {
      const column = [this.gameBoard[0][i], this.gameBoard[1][i], this.gameBoard[2][i]];
      if (checkWin(column)) {
        return [i, i + 3, i + 6];
      }
    }
  
    // check diagonal \
    const diagonal1 = [this.gameBoard[0][0], this.gameBoard[1][1], this.gameBoard[2][2]];
    if (checkWin(diagonal1)) {
      return [0, 4, 8];
    }
  
    // check diagonal /
    const diagonal2 = [this.gameBoard[0][2], this.gameBoard[1][1], this.gameBoard[2][0]];
    if (checkWin(diagonal2)) {
      return [2, 4, 6];
    }
  }
  
  celebrateWin({result, indexes}) {
    this.enableUserMove(false);

    // get winner
    let winner = (result.includes('x')) ? 'x' : 'o';
    this.whoTakesHeading?.classList.add(winner);

    // Set winning modal content
    let takesMessage = (winner == 'x' && this.xLabel == 'cpu' || 
                        winner == 'o' && this.oLabel == 'cpu') ? 'Oh no, you lost..' :

                       (winner == 'x' && this.xLabel == 'you' || 
                        winner == 'o' && this.oLabel == 'you') ? 'Yes, you win!' :
                       // P1 || P2 wins
                       ((winner == 'x') ? this.xLabel : this.oLabel) + ' wins';
                       
    this.whoTakesMessage.innerHTML = takesMessage;
  
    // go through each winning index, color it and show the modal
    this.boardFields.forEach((field, i) => {
      if (i == indexes[0] || i == indexes[1] || i == indexes[2]) {

        setTimeout(() => {
          field.classList.add('win');

          if (i == indexes[2]) this.showModal('win');
        }, 200 * i);

      }
    });
  }

  showModal(modal) {
    if (modal == 'win') setTimeout(() => this.winnerModal?.classList.add('displayed'), 700);
    if (modal == 'tie') setTimeout(() => this.tieModal?.classList.add('displayed'), 700);
    if (modal == 'restart') this.restartModal?.classList.add('displayed');
  }
  
  nextRound() {
    this.gameBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];

    this.whoTakesHeading?.classList.remove('o', 'x');
    this.modals.forEach(modal => modal.classList.remove('displayed'));
    this.boardFields.forEach(field => field.classList.remove('occupied', 'x', 'o', 'win'));
    this.enableUserMove()

    if (this.currentPlayer ==  this.goesFirst) {
      this.switchPlayers();
      this.goesFirst = this.currentPlayer;
    }
  
  }

  cancelRestartModal() {
    this.restartModal?.classList.remove('displayed');
  }
  
  restartGame() {
    this.gameBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
  
    this.boardFields.forEach(field => field.classList.remove('occupied', 'x', 'o', 'win'));
    this.restartModal.classList.remove('displayed');
    if (this.currentPlayer != this.goesFirst) this.switchPlayers();
  }
  
  quit() {
    location.reload();
  }

  defineEventListeners() {
    // Board
    this.board = document.querySelector('.board');
    this.boardFields = document.querySelectorAll('.board__field');

    // Board counters
    this.labelScoreX = document.querySelector('.board__score-x .label');
    this.labelScoreO = document.querySelector('.board__score-o .label');
    this.scoreX = document.querySelector('.board__score-x .value');
    this.scoreTie = document.querySelector('.board__score-tie .value');
    this.scoreO = document.querySelector('.board__score-o .value');
    
    // Modals
    this.modals = document.querySelectorAll('.modal');
    // Winner modal
    this.winnerModal = document.querySelector('.modal__winner');
    this.whoTakesHeading = document.querySelector('.wins-round');
    this.whoTakesMessage = document.querySelector('.won-lost-tie');
    // Tie and restart
    this.tieModal = document.querySelector('.modal__tie');
    this.restartModal = document.querySelector('.modal__restart');
    
    // Buttons
    this.quitButtons = document.querySelectorAll('.quit-button');
    this.nextRoundBtns = document.querySelectorAll('.next-button');
    this.logoButton = document.querySelector('.board__logo');
    this.restartPromptButton = document.querySelector('.board__restart');
    this.restartButton = document.querySelector('.restart-button');
    this.cancelRestartBtn = document.querySelector('.cancel-restart-button');

    // Event listeners
    this.boardFields.forEach(field => field.onclick = (e) => this.playMove(e.target));

    this.logoButton?.addEventListener('click', this.quit);
    this.quitButtons.forEach(quitBtn => quitBtn.addEventListener('click', this.quit));

    this.nextRoundBtns.forEach(nexRoundBtn => nexRoundBtn.addEventListener('click', this.nextRound.bind(this)));

    this.restartPromptButton?.addEventListener('click', () => this.showModal.call(this, 'restart'));
    this.restartButton?.addEventListener('click', this.restartGame.bind(this));
    this.cancelRestartBtn?.addEventListener('click', this.cancelRestartModal.bind(this));
  }

  enableUserMove(enable = true) {
    if (enable) {
      this.board?.classList.remove('prevent-user-move');
    } else {
      this.board?.classList.add('prevent-user-move');
    }
  }

  getPlayerOneMark() {
    return slider.classList.contains('x-selected') ? 'x' : 'o';
  }
}

class TicTacToeVSCPU extends StandardTicTacToe {

  constructor() {
    super('cpu');

    this.cpuPlayer = (this.playerOneMark == 'x') ? 'o' : 'x';
    this.huPlayer = (this.cpuPlayer == 'x') ? 'o' : 'x'; 

    // if CPU goes first
    if (this.playerOneMark == 'o') {
      this.enableUserMove(false);
      this.thinkingAnimation();
      setTimeout(() => this.computerPlaysMove.call(this, true), 1000)
    }
  }

  thinkingAnimation(enabled = true) {
    if (enabled) this.board?.classList.add('thinking');
    else this.board?.classList.remove('thinking');
  }

  computerPlaysMove(playsFirst = false) {
    // don't play if gameover
    if (!this.isGameOver().result.includes('in progress')) return;
  
    let field;
    
    // if (cpu goes first) choose the first field
    // hardcoding because he always chooses the same in this case
    // to prevent going through the recursive algorithm
    if (playsFirst) {
      field = document.querySelector(`[data-row="0"][data-col="0"]`);
    } else {
      // otherwise fire the minimax
      const {index: [row, col]} = this.minimax(this.gameBoard, this.cpuPlayer);
      field = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }
    
    this.playMove.call(this, field);
  }

  switchPlayers() {
    super.switchPlayers();
    this.enableUserMove();
    this.thinkingAnimation(false);

    // cpu plays automatically
    if (this.currentPlayer === this.cpuPlayer ) {
      setTimeout(this.computerPlaysMove.bind(this), 700);
      // adding cpu-turn class to remove the hover effect
      this.enableUserMove(false);
      this.thinkingAnimation();
    }
  }

  nextRound() {
    super.nextRound();
    
    if (this.cpuPlayer == this.currentPlayer) {
      setTimeout(this.computerPlaysMove.bind(this, true), 700);
    }
  }

  emptyFields(board) {
    let emptySpots = [];
    
    board.forEach((row, i) => row.forEach((cell, j) => {
      if (cell == 0) emptySpots.push([i,j]);
    }));
  
    return emptySpots; // [[column, row], [column, row]]
  }
  
  minimax(board, player) {
    let availSpots = this.emptyFields(board);
  
    if (this.isGameOver().result.includes(this.cpuPlayer + ' won')) {
      return {score: 10};
    } else if (this.isGameOver().result.includes(this.huPlayer + ' won')) {
      return {score: -10};
    } else if (availSpots.length === 0) return {score: 0};
  
    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      let move = {};
      move.index = availSpots[i];
  
      // changing the board to try out a move
      board[availSpots[i][0]][availSpots[i][1]] = (player == 'x') ? 1 : 2;
  
      if (player == this.cpuPlayer) {
        let result = this.minimax(board, this.huPlayer);
        move.score = result.score;
      } else {
        let result = this.minimax(board, this.cpuPlayer);
        move.score = result.score;
      }
  
      // resseting the board to what it was
      board[availSpots[i][0]][availSpots[i][1]] = 0;
      moves.push(move);
    }
  
    // if it is the computer's turn loop over the moves and choose the move with the highest score
    var bestMove;
    if(player === this.cpuPlayer) {
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

  defineEventListeners() {
    super.defineEventListeners();

    this.boardFields.forEach(field => field.onclick = (e) => {
      if (this.currentPlayer != this.cpuPlayer) this.playMove(e.target);
    });
  }
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

startGameBtns.forEach(button => button.addEventListener('click', initializeGame));