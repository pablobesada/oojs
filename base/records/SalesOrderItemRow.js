"use strict";
var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: "SalesOrderItemRow",
    inherits: "Row",
    fields: {
        ArtCode:  {type: "string", length: 30},
        Name:  {type: "string", length: 30},
    }
}

var SalesOrderItemRow = cm.createClass(Description, __filename )

SalesOrderItemRow.init = function init() {
    SalesOrderItemRow.__super__.init.call(this);
    return this
}

SalesOrderItemRow.pasteArtCode = function pasteArtCode(salesorder) {
    var self = this;
    console.log("en pasteArtCode");
    return cm.getClass("Item").bring(self.ArtCode)
        .then(function (item) {
            return Promise.delay(1000)
            .then(function () {
                self.Name = item.Name
            });
        })
}

module.exports = SalesOrderItemRow