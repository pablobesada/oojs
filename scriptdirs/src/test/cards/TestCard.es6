"use strict"

var cm = require('openorange').classmanager


let Description = {
    filename: __filename,
    name: "TestCard",
    inherits: 'Card',
    params: {testrecord: "SalesOrder"},
    template: `
          <div class="card green darken-1">
            <div class="card-content white-text">
              <span class="card-title">Test Card: {{id}}</span>
              <p>Card de prueba</p>
            </div>
            <div class="card-action">
            <input name="test_input"/>
              <a href="#">This is a link</a>
              <a href="#">This is a link</a>
            </div>
          </div>`
}

let Parent = cm.SuperClass(Description)
class TestCard extends Parent {
    async getTemplateVariables() {
        return {id: (await this.dataprovider.getData('__record__')).internalId}
    }

}


module.exports = TestCard.initClass(Description)
