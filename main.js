import Game from './Game'
import './style.scss'

const game = new Game(document.querySelector('#app'), 5, 3, 2, 2)
game.init()
