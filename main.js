import Saper from './saper'
import Scores from './Scores'
import './style.scss'

const scores = new Scores(document.querySelector('#scores'))
scores.renderScores()

function onGameLose() {
	scores.addLose()
}

function onGameWin() {
	scores.addWin()
}

const saper = new Saper(document.querySelector('#game'), onGameWin, onGameLose)
saper.init()
