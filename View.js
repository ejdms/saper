const SIZE_OF_CELL = 50

export default class View {
  constructor(root) {
    this.root = root
  }

  renderCell({
    open,
    mine,
    wrong,
    nearbyMines,
    nearbyWrongs,
    flagMine,
    flagWrong,
  }) {
    // add classes
    let html = `<div style="width: ${SIZE_OF_CELL}px; height: ${SIZE_OF_CELL}px" class="cell`
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
    html += '">'
    // add content
    if (!mine && !wrong) {
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

  renderGamefield(gamefield) {
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

      const html = `
        <div class="gamefield" style="${templateStyle}">
          ${this.renderCells(gamefield)}
        </div>
      `
      this.root.innerHTML = html
    } else {
      console.log('some cell is undefiend!!!!')
    }
  }
}
