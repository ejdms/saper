export default class Scores {
	constructor(root) {
		this.root = root
		this.wins = localStorage.getItem('wins') || 0
		this.loses = localStorage.getItem('loses') || 0
	}

	addWin() {
		this.wins = Number(this.wins) + 1
		localStorage.setItem('wins', Number(this.wins))
		this.renderScores()
	}

	addLose = () => {
		this.loses = Number(this.loses) + 1
		localStorage.setItem('loses', Number(this.loses))
		this.renderScores()
	}

	hideScores() {
		this.root.innerHTML = ''
	}

	renderScores() {
		const html = `
      <div class="wins">Wins: ${this.wins}</div>
      <div class="loses">Loses: ${this.loses}</div>
    `
		this.root.innerHTML = html
	}
}
