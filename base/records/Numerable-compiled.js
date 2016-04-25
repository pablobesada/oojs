var cm = global.__main__.require('./openorange').classmanager;

var Description = {
    name: 'Numerable',
    inherits: 'Record',
    fields: {
        SerNr: { type: "integer" }
    }
};

var Numerable = cm.createClass(Description, __filename);

Numerable.init = function init() {
    Numerable.__super__.init.call(this);
    return this;
};

module.exports = Numerable;

//# sourceMappingURL=Numerable-compiled.js.map