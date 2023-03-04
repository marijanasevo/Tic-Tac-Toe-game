import StandardTicTacToe from './standard-tictactoe-logic';

export default class VsCPUTicTacToe extends StandardTicTacToe {

  constructor(playerOneMark) {
    super('cpu', playerOneMark);

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
    this.thinkingAnimation(false);
    if (this.isGameOver().result != 'in progress') return;
    super.switchPlayers();
    this.enableUserMove();

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