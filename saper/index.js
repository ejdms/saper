import Game from './Game'

const resetButton = document.querySelector('#resetButton')

export default class Saper {
	constructor({ root, onGameWin, onGameLose, onCellClick, difficulty }) {
		this.root = root
		this.onGameWinFromProps = onGameWin
		this.onGameLoseFromProps = onGameLose
		this.onCellClickFromProps = onCellClick
		resetButton.addEventListener('click', this.resetGame)
		this.game = null
		this.difficulty = difficulty
	}

	init = () => {
		const { width, height, mines, wrongs } = this.difficulty
		this.game = new Game({
			root: document.querySelector('#game'),
			width,
			height,
			mines,
			wrongs,
			onLose: this.onGameLose,
			onWin: this.onGameWin,
			onCellClick: this.onCellClick,
			topLeftCellIsAlwaysEmpty: true,
		})
		this.game.init()
	}

	toggleButton(display) {
		if (display && resetButton.classList.contains('hidden')) {
			resetButton.classList.remove('hidden')
		}
		if (!display && !resetButton.classList.contains('hidden')) {
			resetButton.classList.add('hidden')
		}
	}

	onCellClick = (cell) => {
		if (typeof this.onCellClickFromProps === 'function') {
			this.onCellClickFromProps(cell)
		}
	}

	onGameWin = () => {
		this.toggleButton(true)
		if (typeof this.onGameWinFromProps === 'function') {
			this.onGameWinFromProps()
		}
	}

	onGameLose = () => {
		this.toggleButton(true)
		if (typeof this.onGameLoseFromProps === 'function') {
			this.onGameLoseFromProps()
		}
	}

	resetGame = () => {
		this.toggleButton(false)
		this.game.init()
	}
}
