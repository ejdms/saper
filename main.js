import Saper from './saper'
import Scores from './Scores'
import Player from './player'
import './style.scss'
import difficultyLevels from './collections/difficultyLevels'

export class Main {
	constructor() {
		this.player = new Player(document.querySelector('#player'))
		this.scores = new Scores(document.querySelector('#scores'))
		this.scores.renderScores()
		this.difficulty = difficultyLevels[0]
		this.saper = new Saper({
			root: document.querySelector('#game'),
			onGameWin: this.onGameWin,
			onGameLose: this.onGameLose,
			onCellClick: this.onCellClick,
			difficulty: this.difficulty,
		})
		this.saper.init()
	}

	onCellClick = ({ mine, wrong }) => {
		if (!mine && !wrong) {
			this.player.addExperience(this.difficulty.experiencePerOpen)
		}
	}

	onGameLose = () => {
		this.scores.addLose()
	}

	onGameWin = () => {
		this.scores.addWin()
	}
}

new Main()
