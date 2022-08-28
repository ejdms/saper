import difficultyLevels from '../collections/difficultyLevels'

const SIZE_OF_CELL = 50

export default class View {
	constructor({ root, scores, player, toggleButtons }) {
		this.root = root
		this.scores = scores
		this.player = player
		this.toggleButtons = toggleButtons
	}

	addEventListeners(gamefield) {
		const cells = Array.from(this.root.querySelectorAll('.cell'))
		cells.forEach((cell) => {
			const { x, y } = cell.dataset
			cell.addEventListener('click', () => gamefield[y][x].onClick())
			cell.addEventListener('contextmenu', (e) => {
				e.preventDefault()
				gamefield[y][x].onRightClick()
			})
		})
	}

	renderCell({
		x,
		y,
		open,
		mine,
		wrong,
		nearbyMines,
		nearbyWrongs,
		flagMine,
		flagWrong,
		shiny,
	}) {
		// add classes
		let html = `<div
      style="width: ${SIZE_OF_CELL}px; height: ${SIZE_OF_CELL}px"
      data-x="${x}"
      data-y="${y}"
      class="cell`
		if (mine) {
			html += ' mine'
		}
		if (wrong) {
			html += ' wrong'
		}
		if (open) {
			html += ' open'
		}
		if (flagMine) {
			html += ' flag-mine'
		}
		if (flagWrong) {
			html += ' flag-wrong'
		}
		if (shiny) {
			html += ' shiny'
		}
		html += '">'
		// add content
		if (!mine) {
			if (nearbyMines) {
				html += `<span class="mines">${nearbyMines}</span>`
			}
			if (nearbyWrongs) {
				html += `<span class="wrongs">${nearbyWrongs}</span>`
			}
		}
		html += '</div>'

		return html
	}

	renderCells(gamefield) {
		let html = ''
		gamefield.forEach((row) => {
			row.forEach((cell) => {
				html += this.renderCell(cell)
			})
		})
		return html
	}

	renderGamefield(gamefield, gameStop) {
		if (typeof gamefield?.[0]?.[0] !== 'undefined') {
			const numberOfColumns = gamefield[0].length
			const numberOfRows = gamefield.length

			let templateStyle = 'grid-template-columns: '
			for (let i = 0; i < numberOfColumns; i++) {
				templateStyle += ' 1fr '
			}
			templateStyle += '; grid-template-rows: '
			for (let i = 0; i < numberOfRows; i++) {
				templateStyle += ' 1fr '
			}
			templateStyle += `; width: ${SIZE_OF_CELL * numberOfColumns}px`

			const className = `gamefield${gameStop ? ' game-stop' : ''}`
			const html = `
        <div class="${className}" style="${templateStyle}">
          ${this.renderCells(gamefield)}
        </div>
      `
			this.root.innerHTML = html
			if (!gameStop) {
				this.addEventListeners(gamefield)
			}
		} else {
			console.log('some cell is undefiend!!!!')
		}
	}

	hideAdditionalInfos = () => {
		this.toggleButtons(false)
		this.scores.hideScores()
		this.player.view.hidePlayer()
	}

	showAdditionalInfos = () => {
		this.scores.renderScores()
		this.player.view.renderPlayer()
	}

	async renderDifficultyLevelSelectAndGetChoice() {
		this.hideAdditionalInfos()

		return new Promise((resolve) => {
			const html = `
      <div class="difficulty-select">
        <h3>Choose difficulty:</h3>
        ${difficultyLevels
					.map(
						(diffLevel) =>
							`<button class="button" data-difficulty="${diffLevel.id}">
                ${diffLevel.name}
              </button>`
					)
					.join('')}
      </div>
      `
			this.root.innerHTML = html
			const allDifficulties = this.root.querySelectorAll('[data-difficulty]')
			allDifficulties.forEach((difficulty) => {
				difficulty.addEventListener('click', (e) => {
					const difficultyId = e.target.dataset.difficulty
					const difficulty = difficultyLevels.find(
						(diff) => diff.id === difficultyId
					)
					this.showAdditionalInfos()
					resolve(difficulty)
				})
			})
		})
	}
}
