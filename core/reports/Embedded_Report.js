"use strict"
var cm = require('openorange').classmanager

var Description = {
    name: 'Embedded_Report',
    inherits: null,
}

var Embedded_Report =  Object.create({
    '__super__': null,
    '__description__': Description,
    '__filename__': __filename,
})


Embedded_Report.createChildClass = function createChildClass(descriptor, filename) {
    var childclass = Object.create(this)
    childclass.__description__ = {}
    childclass.__description__.name = descriptor.name;
    childclass.__description__.title = descriptor.title;
    childclass.__description__.window = descriptor.window? descriptor.window : null;
    childclass.__filename__ = filename;
    childclass.__super__ = this;
    this.__recordClass__ = null;
    return childclass;
}


Embedded_Report.new = function () {
    var res = Object.create(this);
    res.__class__ = this;
    return res.init();
}
Embedded_Report.ids = 1;
Embedded_Report.__reports__ = []

Embedded_Report.findReport = function findReport(id) {
    if (id in Embedded_Report.__reports__) return Embedded_Report.__reports__[id]
    return null;
}
Embedded_Report.init = function init() {
    this.__html__ = [];
    this.__id__ = Embedded_Report.ids++;
    Embedded_Report.__reports__[this.__id__] = this;
    console.log(Embedded_Report.__reports__);
    return this;
}

Embedded_Report.getId = function getId() {
    return this.__id__;
}

Embedded_Report.open = function () {
    var self = this
    self.container = Object.create(window.ReportManager).init(self)
    self.container.appendToWorkspace()
    self.run()
        .then(function () {
            self.render();
        })
}

Embedded_Report.clear = function clear() {
    this.__html__ = [];
}

Embedded_Report.render = function render() {
    this.container.render();
}

Embedded_Report.setFocus = function setFocus() {
    window.ReportManager.setFocus(this)
}
Embedded_Report.super = function callSuper(methodname, self) {
    if (methodname in this.__super__) {
        return this.__super__[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
    } else {
        return Promise.resolve()
    }
}

Embedded_Report.getDescription = function getDescription() {
    return this.__description__
}

Embedded_Report.inspect = function inspect() {
    return "<" + this.__description__.name + ", from " + this.__filename__+ ">"
}

Embedded_Report.getTitle = function getTitle() {
    return this.__description__.title;
}

Embedded_Report.getHTML = function getHTML() {
    return this.__html__.join("\n")
}

Embedded_Report.startTable = function startTable() {
    this.__html__.push("<table>")
}
Embedded_Report.endTable = function endTable() {
    this.__html__.push("</table>")
}
Embedded_Report.startRow = function startRow() {
    this.__html__.push("<tr>")
}
Embedded_Report.endRow = function endRow() {
    this.__html__.push("</tr>")
}

Embedded_Report.startHeaderRow = function startHeaderRow() {
    this.__html__.push("<tr style='font-weight: bold'>")
}

Embedded_Report.endHeaderRow = function endHeaderRow() {
    this.__html__.push("</tr>")
}

Embedded_Report.header = function header(cols) {
    this.startHeaderRow();
    for (var i=0;i<cols.length;i++) {
        this.addValue(cols[i])
    }
    this.endHeaderRow();
}

Embedded_Report.row = function row(values) {
    this.startRow();
    for (var i=0;i<values.length;i++) {
        this.addValue(values[i])
    }
    this.endRow();
}

Embedded_Report.addValue = function addValue(v, options) {
    var value = v;
    var options = options != null? options : {};
    var onclick=''
    if ('Window' in options && 'FieldName' in options) {
        onclick='onclick="cm.getClass(\'Embedded_Report\').findReport('+this.getId()+').__std_zoomin__(\''+options['Window']+'\',\''+options['FieldName']+'\',\''+value+'\')"';
    } else  if ('CallMethod' in options) {
        var param = 'Parameter' in options? "'" + options['Parameter'] + "'" : '';
        onclick='onclick="cm.getClass(\'Embedded_Report\').findReport('+this.getId()+').__call_method_zoomin__(\''+options['CallMethod'] + '\','+param+',\''+value+'\')"';
    }
    this.__html__.push("<td "+onclick+">" + value + "</td>")
}

Embedded_Report.__std_zoomin__ = function __std_zoomin__(w, fn, v) {
    var wnd = cm.getClass(w).new()
    var rec = cm.getClass(wnd.getDescription().recordClass).new()
    rec[fn] = v
    rec.load()
        .then(function () {
            wnd.setRecord(rec)
            wnd.open();
            wnd.setFocus();
        })
        .catch(function (err) {
            console.log("ERRR", err)
        })
}

Embedded_Report.__call_method_zoomin__ = function __call_method_zoomin__(method, params, value) {
    this[method](params, value);
}

module.exports = Embedded_Report