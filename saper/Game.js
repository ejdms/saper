import View from './View'

export default class Game {
	constructor(
		root,
		width,
		height,
		mines,
		wrongs,
		onLose,
		onWin,
		topLeftCellIsAlwaysEmpty = true
	) {
		this.root = root
		this.width = width
		this.height = height
		this.mines = mines
		this.wrongs = wrongs
		this.topLeftCellIsAlwaysEmpty = topLeftCellIsAlwaysEmpty
		this.view = null
		this.gamefield = []
		this.onLose = onLose
		this.onWin = onWin
	}

	checkForWin() {
		const isWin = !this.gamefield.some((row) =>
			row.some((cell) => {
				return (
					!cell.open &&
					!cell.mine &&
					!cell.wrong &&
					!cell.flagMine &&
					!cell.flagWrong
				)
			})
		)
		if (isWin && typeof this.onWin === 'function') {
			this.onWin()
			this.view.renderGamefield(this.gamefield, true)
		}
	}

	onCellClick(x, y) {
		const cell = this.gamefield[y][x]
		if (cell.open || cell.flagMine || cell.flagWrong) return

		cell.open = true
		if (cell.mine && typeof this.onLose === 'function') {
			this.onLose()
		}
		this.view.renderGamefield(this.gamefield, cell.mine)
		if (!cell.mine) {
			this.checkForWin()
		}
	}

	onCellRightClick(x, y) {
		const cell = this.gamefield[y][x]
		if (cell.open) return

		if (cell.flagWrong) {
			cell.flagMine = true
			cell.flagWrong = false
		} else if (cell.flagMine) {
			cell.flagMine = false
		} else {
			cell.flagWrong = true
		}

		this.view.renderGamefield(this.gamefield)
		this.checkForWin()
	}

	randomizeMinesAndWrongs() {
		let allCells = this.gamefield.flat()
		if (this.topLeftCellIsAlwaysEmpty) {
			allCells = allCells.slice(1, allCells.length - 1)
		}
		const willBeMines = []
		const willBeWrongs = []

		for (let i = 0; i < this.mines; i++) {
			if (allCells.length === 0) throw new Error('too many mines!!!')
			const randomIndex = Math.floor(Math.random() * allCells.length)
			willBeMines.push({ ...allCells[randomIndex] })
			allCells.splice(randomIndex, 1)
		}

		for (let i = 0; i < this.wrongs; i++) {
			if (allCells.length === 0) throw new Error('too many wrongs!!!')
			const randomIndex = Math.floor(Math.random() * allCells.length)
			willBeWrongs.push({ ...allCells[randomIndex] })
			allCells.splice(randomIndex, 1)
		}

		willBeMines.forEach(({ x, y }) => {
			this.gamefield[y][x].mine = true
		})

		willBeWrongs.forEach(({ x, y }) => {
			this.gamefield[y][x].wrong = true
		})
	}

	getAllCellsSiblings(cell) {
		const { x, y } = cell
		const maxY = this.gamefield.length - 1
		const maxX = this.gamefield[0].length - 1

		const siblings = []

		for (let n = 0; n < 8; n++) {
			let siblingCoords = null

			switch (n) {
				case 0:
					// top left
					if (y > 0 && x > 0) {
						siblingCoords = [y - 1, x - 1]
					}
					break
				case 1:
					// top center
					if (y > 0) {
						siblingCoords = [y - 1, x]
					}
					break
				case 2:
					// top right
					if (y > 0 && x < maxX) {
						siblingCoords = [y - 1, x + 1]
					}
					break
				case 3:
					// center right
					if (x < maxX) {
						siblingCoords = [y, x + 1]
					}
					break
				case 4:
					// bottom right
					if (y < maxY && x < maxX) {
						siblingCoords = [y + 1, x + 1]
					}
					break
				case 5:
					// bottom center
					if (y < maxY) {
						siblingCoords = [y + 1, x]
					}
					break
				case 6:
					// bottom left
					if (y < maxY && x > 0) {
						siblingCoords = [y + 1, x - 1]
					}
					break
				case 7:
					// center left
					if (x > 0) {
						siblingCoords = [y, x - 1]
					}
					break
			}

			if (siblingCoords) {
				const [y, x] = siblingCoords
				siblings.push(this.gamefield[y][x])
			}
		}

		return siblings
	}

	fillTheOthers() {
		this.gamefield = this.gamefield.map((row, y) =>
			row.map((cell, x) => {
				if (cell.mine) {
					return cell
				}

				let nearbyMines = 0
				let nearbyWrongs = 0

				const allSiblings = this.getAllCellsSiblings(cell)

				allSiblings.forEach((sibling) => {
					if (sibling.mine) {
						nearbyMines++
					}
					if (sibling.wrong) {
						nearbyWrongs++
					}
				})

				return {
					...cell,
					nearbyMines,
					nearbyWrongs,
				}
			})
		)
	}

	initGamefield(width, height) {
		for (let h = 0; h < height; h++) {
			this.gamefield[h] = []
			for (let w = 0; w < width; w++) {
				this.gamefield[h][w] = {
					x: w,
					y: h,
					open: false,
					mine: false,
					wrong: false,
					nearbyMines: 0,
					nearbyWrongs: 0,
					flagMine: false,
					flagWrong: false,
					onClick: () => this.onCellClick(w, h),
					onRightClick: () => this.onCellRightClick(w, h),
				}
			}
		}
		this.randomizeMinesAndWrongs()
		this.fillTheOthers()
	}

	init() {
		this.view = new View(this.root)
		this.initGamefield(this.width, this.height)
		this.view.renderGamefield(this.gamefield)
	}
}
