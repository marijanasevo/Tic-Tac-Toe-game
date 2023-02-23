import '../assets/logo.svg';
import '../assets/icon-x-dark.svg';
import '../assets/icon-o-dark.svg';
import '../assets/icon-x-silver.svg';
import '../assets/icon-restart.svg';
import '../assets/icon-x-outline.svg';
import '../assets/icon-o-outline.svg';
import '../assets/icon-x.svg';
import '../assets/icon-o.svg';
import '../styles/styles.scss';


let xSelected = document.querySelector('.player-selection__x-selected');
let oSelected = document.querySelector('.player-selection__o-selected');
let slider = document.querySelector('.player-selection__choice__slider');

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
