import Game from './Game'

export default class Saper {
	constructor({
		root,
		view,
		onGameWin,
		onGameLose,
		onCellClick,
		difficulty,
		onDifficultyChange,
		toggleButtons,
	}) {
		this.root = root
		this.view = view
		this.toggleButtons = toggleButtons
		this.onGameWinFromProps = onGameWin
		this.onGameLoseFromProps = onGameLose
		this.onCellClickFromProps = onCellClick
		resetButton.addEventListener('click', this.resetGame)
		changeDifficultyButton.addEventListener(
			'click',
			this.changeDifficultyAndResetGame
		)
		this.game = null
		this.difficulty = difficulty
		this.onDifficultyChange = onDifficultyChange
	}

	init = () => {
		const { width, height, mines, wrongs } = this.difficulty
		this.game = new Game({
			root: this.root,
			view: this.view,
			width,
			height,
			mines,
			wrongs,
			onLose: this.onGameLose,
			onWin: this.onGameWin,
			onCellClick: this.onCellClick,
			topLeftCellIsAlwaysEmpty: true,
			topLeftCellSiblingsAreNeverMine: true,
		})
		this.game.init()
	}

	onCellClick = (cell) => {
		if (typeof this.onCellClickFromProps === 'function') {
			this.onCellClickFromProps(cell)
		}
	}

	onGameWin = () => {
		this.toggleButtons(true)
		if (typeof this.onGameWinFromProps === 'function') {
			this.onGameWinFromProps()
		}
	}

	onGameLose = () => {
		this.toggleButtons(true)
		if (typeof this.onGameLoseFromProps === 'function') {
			this.onGameLoseFromProps()
		}
	}

	resetGame = () => {
		this.toggleButtons(false)
		this.game.init()
	}

	changeDifficultyAndResetGame = async () => {
		const difficulty = await this.view.renderDifficultyLevelSelectAndGetChoice()
		this.onDifficultyChange(difficulty)
	}
}
