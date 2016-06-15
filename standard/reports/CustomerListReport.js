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
    return cm.getClass("Customer").select().limit(10).fetch()
        .then(function (results) {
            self.startTable()
            self.startHeaderRow()
            self.addValue("Codigo")
            self.addValue("Nombre")
            self.endHeaderRow()
            self.row(['Segundo Codigo', 'Segundo Nombre'])
            for (var i=0;i<results.length;i++) {
                var rec = results[i];
                self.startRow()
                self.addValue(rec.Code, {Window: "CustomerWindow", FieldName: "Code"})
                self.addValue(rec.Name, {CallMethod: 'ZoomInTest', Parameter: "LALALAHH"})
                self.endRow()
            }
            self.endTable()
        })

}


CustomerListReport.ZoomInTest = function ZoomInTest(param, value) {
    console.log(param, value)
}

module.exports = CustomerListReport