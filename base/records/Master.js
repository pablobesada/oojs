
//console.log("en Master.js 4: current filename: " + __filename)

var cm = require.main.require('./openorange').classmanager;
//console.log("en Master.js 5: current filename: " + __filename)

var Description = {
    name: 'Master',
    inherits: 'Record',
    fields: {
        Code: {type: "string", length: 30},
        Name: {type: "string", length: 100},
    }
}

//console.log("en Master.js 6: current filename: " + __filename)
//console.log("en Master.js: ParentClass: "+ ParentClass.inspect())
var Master = cm.createClass(Description, __filename)
//console.log("en Master.js 2: current filename: " + __filename)
//console.log("en Master.js 3: Master: "+ Master.inspect())
Master.init = function init() {
    //console.log("in Master.init, parentclass: " + ParentClass.inspect())
    Master.__super__.init.call(this);
    return this
}

Master.inspect = function inspect() {
    return "<" + this.__description__.name + " " + this.Code + ">";
}
module.exports = Master