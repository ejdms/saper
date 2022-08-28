import Saper from './saper'
import Scores from './Scores'
import Player from './player'
import './style.scss'
import View from './saper/View'

const resetButton = document.querySelector('#resetButton')
const changeDifficultyButton = document.querySelector('#changeDifficultyButton')
const allButtons = [resetButton, changeDifficultyButton]

export class Main {
	constructor() {
		this.asyncConstructor()
	}

	asyncConstructor = async () => {
		this.root = document.querySelector('#game')
		this.player = new Player(document.querySelector('#player'))
		this.scores = new Scores(document.querySelector('#scores'))
		this.view = new View({
			root: this.root,
			player: this.player,
			scores: this.scores,
			toggleButtons: this.toggleButtons,
		})
		this.difficulty = await this.view.renderDifficultyLevelSelectAndGetChoice()
		this.scores.renderScores()
		this.resetSaper()
	}

	resetSaper = () => {
		this.saper = new Saper({
			root: this.root,
			view: this.view,
			onGameWin: this.onGameWin,
			onGameLose: this.onGameLose,
			onCellClick: this.onCellClick,
			toggleButtons: this.toggleButtons,
			difficulty: this.difficulty,
			onDifficultyChange: this.onDifficultyChange,
		})
		this.saper.init()
	}

	onDifficultyChange = (difficulty) => {
		this.difficulty = difficulty
		this.resetSaper()
	}

	toggleButtons(display) {
		if (display) {
			allButtons.forEach((btn) => btn.classList.remove('hidden'))
		}
		if (!display) {
			allButtons.forEach((btn) => btn.classList.add('hidden'))
		}
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
		this.player.addExperience(this.difficulty.experiencePerWin)
		this.scores.addWin()
	}
}

new Main()
