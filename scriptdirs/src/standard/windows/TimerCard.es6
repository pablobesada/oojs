"use strict"

var cm = require('openorange').classmanager


let Description = {
    filename: __filename,
    name: "TimerCard",
    inherits: 'Card',
    params: {salesorder: cm.getClass("SalesOrder")},
    template: `
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">{{elapsed}}</span>
              <p>Time since last refersh</p>
            </div>
            <div class="card-action">
              <input changemethod="newValue"></input>
              <a clickmethod="reset">reset counter</a>
              <a clickmethod="stop">stop counter</a>
            </div>
          </div>`
}

let Parent = cm.SuperClass(Description)
class TimerCard extends Parent {

    constructor() {
        super()
        this.setParam('elapsed', 0)
    }

    async getTemplateVariables() {
        return {}
    }

    play() {
        super.play.call(this)
        if (this.isPlaying()) {
            this.again()
        }
    }

    again() {
        if (this.isPlaying()) {
            this.setParam('elapsed', this.params.elapsed + 1)
            setTimeout(this.again.bind(this), 3000)
        }
    }

    reset(event) {
        this.setParam('elapsed', 0)
        if (!this.isPlaying()) this.play()
    }

    newValue(event) {
        this.setParam('elapsed', parseInt(event.target.value))
    }

}


module.exports = TimerCard.initClass(Description)
