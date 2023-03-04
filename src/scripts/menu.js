import VsCPUTicTacToe from './vs-cpu-tictactoe-logic';
import StandardTicTacToe from './standard-tictactoe-logic';

export default class InitializeGame {
  constructor() {
    this.defineEventListeners();
  }

  initializeGame(el) {
    const vsCPU = el.classList.value.includes('cpu');
    const playerOneMark = this.slider.classList.contains('x-selected') ? 'x' : 'o';
    (vsCPU) ? new VsCPUTicTacToe(playerOneMark) : new StandardTicTacToe(playerOneMark);
  }

  // Toggling menu choice button
  toggleSelectedPlayer(el) {
    if (el == this.xSelected) {
      this.slider?.classList.remove('o-selected');
      this.slider?.classList.add('x-selected');
    } else {
      this.slider?.classList.add('o-selected');
      this.slider?.classList.remove('x-selected');
    }
  }

  defineEventListeners() {
    // Menu
    this.menuScreen = document.querySelector('.menu');
    
    // Choice buttons & slider
    this.xSelected = document.querySelector('.player-selection__x-selected');
    this.oSelected = document.querySelector('.player-selection__o-selected');
    this.slider = document.querySelector('.player-selection__choice__slider');
    
    // Start game buttons
    this.startGameBtns = document.querySelectorAll('.start-game__button');

    // Event listeners
    this.oSelected?.addEventListener('click', (e) => this.toggleSelectedPlayer.call(this, e.target));
    this.xSelected?.addEventListener('click', (e) => this.toggleSelectedPlayer.call(this, e.target));
    
    this.startGameBtns.forEach(button => button.addEventListener('click', (e) => this.initializeGame.call(this, e.target)));
  }
}