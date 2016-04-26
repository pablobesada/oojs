var cm = global.__main__.require('./openorange').classmanager;

var Description = {
    name: "SalesOrderItemRow",
    inherits: "Row",
    fields: {
        ArtCode: { type: "string", length: 30 },
        Name: { type: "string", length: 30 }
    }
};

var SalesOrderItemRow = cm.createClass(Description, __filename);
SalesOrderItemRow.init = function init() {
    SalesOrderItemRow.__super__.init.call(this);
    return this;
};

module.exports = SalesOrderItemRow;

//# sourceMappingURL=SalesOrderItemRow-compiled.js.map