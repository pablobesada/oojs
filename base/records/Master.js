
//console.log("en Master.js 4: current filename: " + __filename)

var cm = require('openorange').classmanager
//console.log("en Master.js 5: current filename: " + __filename)

var Description = {
    name: 'Master',
    inherits: 'Record',
    fields: {
        Code: {type: "string", length: 30},
        Name: {type: "string", length: 100},
    }
}

var Master = cm.createClass(Description, __filename)
Master.init = function init() {
    Master.__super__.init.call(this);
    return this
}

Master.inspect = function inspect() {
    return "<" + this.__description__.name + " " + this.Code + ">";
}

Master.bring = async function bring(Code) {
    var rec = this.new();
    rec.Code = Code;
    var res = await rec.load();
    if (res) return rec;
    return null;
}

module.exports = Master
//# sourceURL=filenameXXX.js
