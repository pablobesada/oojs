"use strict";
var cm = global.__main__.require('./openorange').classmanager

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

module.exports = CustomerListReport