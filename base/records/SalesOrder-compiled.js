var cm = global.__main__.require('./openorange').classmanager;

var Description = {
    name: 'SalesOrder',
    inherits: 'SalesTransaction',
    fields: {
        SalesGroup: { type: "string", length: 30 },
        Items: { type: "detail", class: "SalesOrderItemRow" }
    }
};

var SalesOrder = cm.createClass(Description, __filename);

SalesOrder.init = function init() {
    SalesOrder.__super__.init.call(this);
    return this;
};

module.exports = SalesOrder;

//# sourceMappingURL=SalesOrder-compiled.js.map