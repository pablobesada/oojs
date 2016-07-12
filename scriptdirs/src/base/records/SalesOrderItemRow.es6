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
    },
    filename: __filename

}

var Parent = cm.SuperClass(Description)

class SalesOrderItemRow extends Parent {
    constructor() {
        super()

    }

    async pasteArtCode(salesorder) {
        var self = this;
        console.log("en pasteArtCode: " + self.ArtCode);
        var item = await cm.getClass("Item").bring(self.ArtCode);
        if (item) self.Name = item.Name

    }
}

module.exports = SalesOrderItemRow.initClass(Description)