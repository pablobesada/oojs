
//console.log("en Master.js 4: current filename: " + __filename)

var cm = global.__main__.require('./openorange').classmanager
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
module.exports = Master