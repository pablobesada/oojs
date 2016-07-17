"use strict"

var cm = require('openorange').classmanager


let Description = {
    filename: __filename,
    name: "NoMatchingCard",
    inherits: 'Card',
    params: {noop: "NonExistentClass"},
    template: `
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">Card Title: {{SerNr}}</span>
              <p>Facturas: 18, Entregas 15</p>
            </div>
            <div class="card-action">
            <input name="test_input"/>
              <a href="#">This is a link</a>
              <a href="#">This is a link</a>
            </div>
          </div>`
}

let Parent = cm.SuperClass(Description)
class NoMatchingCard extends Parent {

}


module.exports = NoMatchingCard.initClass(Description)
