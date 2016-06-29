"use strict"
var oo = require('openorange')
var cm = oo.classmanager

var Description = {
    name: 'Embedded_Report',
    inherits: null,
    filename: __filename,
}

/*var Embedded_Report =  Object.create({
 '__super__': null,
 '__description__': Description,
 '__filename__': __filename,
 })*/

class Embedded_Report {

    static createChildClass(descriptor, filename) {
        //console.log("en createChildClass: ", this)
        //var childclass = Object.create(this)
        let childclass = class extends this {};
        childclass.__description__ = {}
        childclass.__description__.name = descriptor.name;
        childclass.__description__.title = descriptor.title;
        childclass.__description__.window = descriptor.window ? descriptor.window : null;
        childclass.__filename__ = filename;
        childclass.__super__ = this;
        this.__recordClass__ = null;
        return childclass;
    }

    static prepareParentClass(descriptor, filename) {
        //console.log("en createChildClass: " + this)
        //var childclass = Object.create(this)
        let childclass = class extends this {};
        childclass.__description__ = {}
        childclass.__description__.name = descriptor.name;
        childclass.__description__.title = descriptor.title;
        childclass.__description__.window = descriptor.window ? descriptor.window : null;
        childclass.__filename__ = filename;
        childclass.__super__ = this;
        this.__recordClass__ = null;
        return childclass;
    }

    static initClass(descriptor) {
        //var childclass = Object.create(this)
        this.__description__ = {}
        this.__description__.name = descriptor.name;
        this.__description__.title = descriptor.title;
        this.__description__.window = descriptor.window ? descriptor.window : null;
        this.__description__.filename = descriptor.filename;
        //childclass.__super__ = this;
        //this.__recordClass__ = null;
        return this;
    }


    static new() {
        let res = new this();
        res.__class__ = this;
        return res;
    }

    static findReport(id) {
        if (id in Embedded_Report.__reports__) return Embedded_Report.__reports__[id]
        return null;
    }

    constructor() {
        this.__html__ = [];
        this.__id__ = Embedded_Report.ids++;
        this.__class__ = this.constructor
        Embedded_Report.__reports__[this.__id__] = this;
        //console.log(Embedded_Report.__reports__);
        return this;
    }

    getId() {
        return this.__id__;
    }

    async open() {
        var self = this
        self.container = Object.create(oo.ui.reportmanager).init(self)
        self.container.appendToWorkspace()
        await self.run()
        self.render();
    }

    async run() {
        console.log("running run de Embedded_report")
    }

    clear() {
        this.__html__ = [];
    }

    render() {
        this.container.render();
    }

    setFocus() {
        oo.ui.reportamanager.setFocus(this)
    }

    /*
     Embedded_Report.super = function callSuper(methodname, self) {
     if (methodname in this.__super__) {
     return this.__super__[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
     } else {
     return Promise.resolve()
     }
     }
     */

    static getDescription() {
        return this.__description__
    }

    inspect() {
        return "<" + this.__class__.__description__.name + ", from " + this.__class__.__filename__ + ">"
    }

    getTitle() {
        return this.__class__.__description__.title;
    }

    getHTML() {
        return this.__html__.join("\n")
    }

    startTable() {
        this.__html__.push("<table>")
    }

    endTable() {
        this.__html__.push("</table>")
    }

    startRow() {
        this.__html__.push("<tr>")
    }

    endRow() {
        this.__html__.push("</tr>")
    }

    startHeaderRow() {
        this.__html__.push("<tr style='font-weight: bold'>")
    }

    endHeaderRow() {
        this.__html__.push("</tr>")
    }

    header(cols) {
        this.startHeaderRow();
        for (var i = 0; i < cols.length; i++) {
            this.addValue(cols[i])
        }
        this.endHeaderRow();
    }

    row(values) {
        this.startRow();
        for (var i = 0; i < values.length; i++) {
            this.addValue(values[i])
        }
        this.endRow();
    }

    addValue(v, options) {
        var value = v;
        var options = options != null ? options : {};
        var onclick = ''
        if ('Window' in options && 'FieldName' in options) {
            onclick = 'onclick="oo.ui.reportmanager.findReport(' + this.getId() + ').__std_zoomin__(\'' + options['Window'] + '\',\'' + options['FieldName'] + '\',\'' + value + '\')"';
        } else if ('CallMethod' in options) {
            var param = 'Parameter' in options ? "'" + options['Parameter'] + "'" : '';
            onclick = 'onclick="oo.ui.reportmanager.findReport(' + this.getId() + ').__call_method_zoomin__(\'' + options['CallMethod'] + '\',' + param + ',\'' + value + '\')"';
        }
        this.__html__.push("<td " + onclick + ">" + value + "</td>")
    }

    async __std_zoomin__(w, fn, v) {
        var wnd = cm.getClass(w).new()
        var rec = cm.getClass(wnd.__class__.getDescription().recordClass).new()
        rec[fn] = v
        if (await rec.load()
    )
        {
            wnd.setRecord(rec)
            wnd.open();
            wnd.setFocus();
        }
    }

    async __call_method_zoomin__(method, params, value) {
        this[method](params, value);
    }
}

Embedded_Report.__super__ = null
Embedded_Report.__description__ = Description
Embedded_Report.ids = 1;
Embedded_Report.__reports__ = [];


module.exports = Embedded_Report