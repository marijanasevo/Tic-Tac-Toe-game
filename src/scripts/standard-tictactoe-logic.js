export default class StandardTicTacToe {

  constructor(opponent = 'human', playerOneMark) {
    this.defineEventListeners();
    
    this.currentPlayer = this.goesFirst = 'x'; // x plays first initial game
    this.playerOneMark = playerOneMark; // player one <- x || o
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
    this.menuScreen?.classList.remove('displayed');
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
    this.menuScreen = document.querySelector('.menu');
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

  enableUserMove(enabled = true) {
    if (enabled) {
      this.board?.classList.remove('prevent-user-move');
    } else {
      this.board?.classList.add('prevent-user-move');
    }
  }
}