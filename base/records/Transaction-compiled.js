var cm = require('openorange').classmanager;

var Description = {
    name: 'Transaction',
    inherits: 'Numerable',
    fields: {}
};

var Transaction = cm.createClass(Description, __filename);

Transaction.init = function init() {
    Transaction.__super__.init.call(this);
    return this;
};

module.exports = Transaction;

//# sourceMappingURL=Transaction-compiled.js.map