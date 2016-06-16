"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'CustomerListReport',
    inherits: 'Report',
    title: 'Customer List Report'
}

var CustomerListReport = cm.createClass(Description, __filename )

CustomerListReport.run = function run() {
    var self = this;
    var order = null
    if ('order' in self) order = self.order;
    var query = cm.getClass("Customer").select().limit(10);
    if (self.order != null) query.order(self.order);
    return query.fetch()
        .then(function (results) {
            self.startTable()
            self.startHeaderRow()
            self.addValue("Codigo",{CallMethod: 'ZoomInTest', Parameter: "LALALAHH"})
            self.addValue("Nombre",{CallMethod: 'ZoomInTest', Parameter: "LALALAHH"})
            self.endHeaderRow()
            //self.row(['Segundo Codigo', 'Segundo Nombre'])
            for (var i=0;i<results.length;i++) {
                var rec = results[i];
                self.startRow()
                self.addValue(rec.Code, {Window: "CustomerWindow", FieldName: "Code"})
                self.addValue(rec.Name)
                self.endRow()
            }
            self.endTable()
        })

}


CustomerListReport.ZoomInTest = function ZoomInTest(param, value) {
    var self = this;
    console.log(param, value)
    if (value == 'Codigo') self.order = 'Code';
    if (value == 'Nombre') self.order = 'Name'
    self.clear();
    self.run().then(function () {
            self.render();
        }
    )

}

module.exports = CustomerListReport