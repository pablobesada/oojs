"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: "SalesOrderItemRow",
    inherits: "Row",
    fields: {
        ArtCode:  {type: "string", length: 30},
        Name:  {type: "string", length: 30},
        OriginType: {type: "boolean"},
        DeliveryDateRow: {type: "date"},
        DeliveryTimeRow: {type: "time"},
    }
}

var SalesOrderItemRow = cm.createClass(Description, __filename )

SalesOrderItemRow.init = function init() {
    SalesOrderItemRow.__super__.init.call(this);
    return this
}

SalesOrderItemRow.pasteArtCode = async function pasteArtCode(salesorder) {
    var self = this;
    console.log("en pasteArtCode: " + self.ArtCode);
    var item = await cm.getClass("Item").bring(self.ArtCode);
    console.log("bringed: " + item.Name)
    self.Name = item.Name
}

module.exports = SalesOrderItemRow