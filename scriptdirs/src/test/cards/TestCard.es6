"use strict"

var cm = require('openorange').classmanager


let Description = {
    filename: __filename,
    name: "TestCard",
    inherits: 'Card',
    params: {testrecord: "SalesOrder", customer: 'Customer'},
    template: `
          <div class="card green darken-1">
            <div class="card-content white-text">
              <span class="card-title">Test Card: {{=testrecord.internalId}}</span>
              <p>Card de Prueba</p>
              <p>{{=customer.Name}}</p>
              <p>{{=_.now()}}</p>
            </div>
            <div class="card-action">
            <input name="test_input"/>
              <a clickmethod="doSomething">Do something</a>
              <a href="#">This is a link</a>
            </div>
          </div>`
}

let Parent = cm.SuperClass(Description)
class TestCard extends Parent {
    doSomething(event) {
        console.log("dosomething: ", this.params.customer)
        this.params.customer.Name = 'nombre cambio con exito'
    }
}


module.exports = TestCard.initClass(Description)
