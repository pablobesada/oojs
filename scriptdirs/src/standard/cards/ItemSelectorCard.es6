"use strict"

var cm = require('openorange').classmanager


let Description = {
    filename: __filename,
    name: "ItemSelectorCard",
    inherits: 'Card',
    params: {container: 'ItemsContainer'},
    template: `
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">EEE</span>
            </div>
            <div class="card-action">
            <input name="test_input"/>
              <a href="#" clickmethod="addItem">Add Item</a>
              <a href="#">This is a link</a>
            </div>
          </div>`
}

let Parent = cm.SuperClass(Description)
class ItemSelectorCard extends Parent {

    async getTemplateVariables() {
        return {}
    }

    async addItem(event) {
        let container = await this.params.container;
        console.log($(event.target))
        console.log($(event.target).closest('.card'))
        console.log($(event.target).closest('.card').find('input[name=test_input]'))
        container.addItem($(event.target).closest('.card').find('input[name=test_input]').val())
    }
}


module.exports = ItemSelectorCard.initClass(Description)
