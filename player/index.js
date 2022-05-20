import Player from './Player'
import View from './View'

export default class PlayerIndex {
	constructor(root) {
		this.root = root
		this.player = new Player()
		this.view = new View(this.root, this.player)
	}

	addExperience(amount) {
		this.player.addExperience(amount)
		this.view.renderPlayer()
	}
}
