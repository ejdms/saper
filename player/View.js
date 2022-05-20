import levels from '../collections/levels'

export default class View {
	constructor(root, player) {
		this.root = root
		this.player = player
		this.renderPlayer()
	}

	renderPlayer() {
		const nextLevel = levels.find(
			(level) => level.number === this.player.level + 1
		)

		const experienceNeeded = nextLevel
			? nextLevel.experienceNeeded - this.player.experience
			: 'MAX LEVEL'

		const html = `
      <div>Experience: ${this.player.experience}</div>
      <div>Level: ${this.player.level}</div>
      <div>Experience needed: ${experienceNeeded}</div>
    `
		this.root.innerHTML = html
	}
}
