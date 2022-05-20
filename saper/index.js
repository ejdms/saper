import Game from './Game'

const resetButton = document.querySelector('#resetButton')

export default class Saper {
	constructor(root, onGameWin, onGameLose) {
		this.root = root
		this.onGameWinFromProps = onGameWin
		this.onGameLoseFromProps = onGameLose
		resetButton.addEventListener('click', this.resetGame)
		this.game = null
	}

	init = () => {
		this.game = new Game(
			document.querySelector('#game'),
			5,
			3,
			1,
			1,
			this.onGameLose,
			this.onGameWin,
			true
		)
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
