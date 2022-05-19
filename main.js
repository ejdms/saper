import Game from './Game'
import Scores from './Scores'
import './style.scss'

const resetButton = document.querySelector('#resetButton')
resetButton.addEventListener('click', resetGame)

function resetGame() {
  resetButton.classList.add('hidden')
  game.init()
}

function onGameLose() {
  scores.addLose()
  resetButton.classList.remove('hidden')
}

function onGameWin() {
  scores.addWin()
  resetButton.classList.remove('hidden')
}

const scores = new Scores(document.querySelector('#scores'))
scores.renderScores()

const game = new Game(
  document.querySelector('#game'),
  5,
  3,
  2,
  4,
  onGameLose,
  onGameWin,
  true
)
game.init()
