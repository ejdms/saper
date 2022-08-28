export default class Game {
	constructor({
		root,
		view,
		width,
		height,
		mines,
		wrongs,
		onLose,
		onWin,
		onCellClick,
		topLeftCellIsAlwaysEmpty = true,
		topLeftCellSiblingsAreNeverMine = true,
	}) {
		this.root = root
		this.view = view
		this.width = width
		this.height = height
		this.mines = mines
		this.wrongs = wrongs
		this.topLeftCellIsAlwaysEmpty = topLeftCellIsAlwaysEmpty
		this.topLeftCellSiblingsAreNeverMine = topLeftCellSiblingsAreNeverMine
		this.gamefield = []
		this.onLose = onLose
		this.onWin = onWin
		this.onCellClickFromProps = onCellClick
	}

	isCellEmpty(cell) {
		return !cell.mine && !cell.nearbyMines && !cell.nearbyWrongs
	}

	recursiveOpenEmptySiblings(cell) {
		const cellsToOpen = []
		const cellsAlreadyTested = []

		let currentItertion = 0

		const check = (cell) => {
			currentItertion++
			if (currentItertion > 1000) {
				return
			}

			cellsAlreadyTested.push(cell)

			if (!this.isCellEmpty(cell)) {
				return
			}

			const siblings = this.getAllCellsSiblings(cell)
			siblings.forEach((sibling) => {
				if (
					cellsAlreadyTested.find(
						(cell) => cell.x === sibling.x && cell.y === sibling.y
					)
				)
					return
				cellsToOpen.push(sibling)
			})

			const untestedEmptyCells = cellsToOpen.filter((cellToOpen) => {
				const isAlreadyTested = !!cellsAlreadyTested.find(
					(cellTested) =>
						cellTested.x === cellToOpen.x && cellTested.y === cellToOpen.y
				)
				return this.isCellEmpty(cellToOpen) && !isAlreadyTested
			})

			if (untestedEmptyCells.length) {
				untestedEmptyCells.forEach(check)
			}
		}

		check(cell)

		cellsToOpen.forEach((cell) => {
			cell.open = true
		})
		this.view.renderGamefield(this.gamefield)
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
		if (typeof this.onCellClickFromProps === 'function') {
			this.onCellClickFromProps(cell)
		}
		if (cell.mine && typeof this.onLose === 'function') {
			this.onLose()
		}
		this.view.renderGamefield(this.gamefield, cell.mine)
		if (!cell.mine) {
			this.checkForWin()
		}
		if (this.isCellEmpty(cell)) {
			this.recursiveOpenEmptySiblings(cell)
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

		// WRONGS

		const willBeWrongs = []

		for (let i = 0; i < this.wrongs; i++) {
			if (allCells.length === 0) throw new Error('too many wrongs!!!')
			const randomIndex = Math.floor(Math.random() * allCells.length)
			willBeWrongs.push({ ...allCells[randomIndex] })
			allCells.splice(randomIndex, 1)
		}

		willBeWrongs.forEach(({ x, y }) => {
			this.gamefield[y][x].wrong = true
		})

		// MINES

		const willBeMines = []

		if (this.topLeftCellSiblingsAreNeverMine) {
			// cells forbidden to be mines
			const forbiddenCells = this.getAllCellsSiblings(this.gamefield[0][0])
			allCells = allCells.filter(
				(cell) =>
					!forbiddenCells.some((forbiddenCell) => {
						return cell.x === forbiddenCell.x && cell.y === forbiddenCell.y
					})
			)
		}

		for (let i = 0; i < this.mines; i++) {
			if (allCells.length === 0) throw new Error('too many mines!!!')
			const randomIndex = Math.floor(Math.random() * allCells.length)
			willBeMines.push({ ...allCells[randomIndex] })
			allCells.splice(randomIndex, 1)
		}

		willBeMines.forEach(({ x, y }) => {
			this.gamefield[y][x].mine = true
		})
	}

	getAllCellsSiblings = (cell) => {
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
				const shiny = this.topLeftCellIsAlwaysEmpty && w === 0 && h === 0
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
					shiny,
				}
			}
		}
		this.randomizeMinesAndWrongs()
		this.fillTheOthers()
	}

	init() {
		this.initGamefield(this.width, this.height)
		this.view.renderGamefield(this.gamefield)
	}
}
