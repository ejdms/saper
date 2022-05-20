import levels from '../collections/levels'

export default class Player {
	constructor() {
		const { experience = 0 } =
			(localStorage.getItem('player') &&
				JSON.parse(localStorage.getItem('player'))) ||
			{}
		this.experience = experience
		this.level = 0
		this.calculateLevel(experience)
	}

	calculateLevel(experience) {
		let currentLevel = 0
		levels.forEach((level) => {
			if (level.experienceNeeded <= experience) {
				currentLevel = level.number
			}
		})
		this.level = currentLevel
	}

	addExperience(amount) {
		this.experience += amount
		this.calculateLevel(this.experience)
		localStorage.setItem(
			'player',
			JSON.stringify({ experience: this.experience })
		)
	}
}
