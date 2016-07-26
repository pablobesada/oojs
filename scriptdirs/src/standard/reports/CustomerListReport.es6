"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'CustomerListReport',
    inherits: 'Report',
    title: 'Customer List Report',
    filename: __filename,
}

//let CustomerListReport = cm.createClass(Description, __filename)
let Parent = cm.SuperClass(Description)

function wait(t) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve()
        }, t)
    });
}

class CustomerListReport extends Parent {
    async run() {
        await super.run()
        await (wait(2000))
        var self = this;
        var order = null
        if ('order' in self) order = self.order;
        var query = cm.getClass("Customer").select().limit(10);
        if (self.order != null) query.order(self.order);
        let results = await query.fetch()
        self.startTable()
        self.startHeaderRow()
        self.addValue("Codigo", {CallMethod: 'ZoomInTest', Parameter: "LALALAHH"})
        self.addValue("Nombre", {CallMethod: 'ZoomInTest', Parameter: "LALALAHH"})
        self.endHeaderRow()
        //self.row(['Segundo Codigo', 'Segundo Nombre'])
        for (var i = 0; i < results.length; i++) {
            var rec = results[i];
            self.startRow()
            self.addValue(rec.Code, {Window: "CustomerWindow", FieldName: "Code"})
            self.addValue(rec.Name)
            self.endRow()
        }
        self.endTable()
        //await (wait(2000))
    }

    async ZoomInTest(param, value) {
        var self = this;
        cm.getClass("Customer").bring("C00009")
        console.log(param, value)
        if (value == 'Codigo') self.order = 'Code';
        if (value == 'Nombre') self.order = 'Name'
        self.clear();
        await self.execute();
        self.render();
    }
}


module.exports = CustomerListReport.initClass(Description)