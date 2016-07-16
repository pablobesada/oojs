"use strict"
var oo = require('openorange')
var cm = oo.classmanager

var Description = {
    name: 'Embedded_Report',
    inherits: null,
    filename: __filename,
    actions: [
        {label: 'Run', method: 'runAndRender', icon: 'play_arrow', group: 'basic', shortcut: 'shift+enter'},
        {label: 'Toggle Window', method: 'toggleParamsWindow', icon: 'settings', group: 'basic'},
    ],
}

/*var Embedded_Report =  Object.create({
 '__super__': null,
 '__description__': Description,
 '__filename__': __filename,
 })*/

class Embedded_Report extends oo.UIEntity {

    static initClass(descriptor) {
        super.initClass(descriptor)
        //var childclass = Object.create(this)
        let parentdesc = this.__description__;
        let newdesc = {}
        newdesc.name = descriptor.name;
        newdesc.title = descriptor.title;
        newdesc.window = descriptor.window ? descriptor.window : null;
        newdesc.filename = descriptor.filename;
        newdesc.params = descriptor.params;
        newdesc.actions = parentdesc.actions ? parentdesc.actions.slice() : []
        if (descriptor.actions) {
            for (let i = 0; i < descriptor.actions.length; i++) newdesc.actions.push(descriptor.actions[i])
        }
        this.__description__ = newdesc;
        //childclass.__super__ = this;
        //this.__recordClass__ = null;
        return this;
    }


    static findReport(id) {
        if (id in Embedded_Report.__reports__) return Embedded_Report.__reports__[id]
        return null;
    }

    constructor() {
        super()
        this.view = null;
        this.__html__ = [];
        this.__id__ = Embedded_Report.ids++;
        this.__listeners__ = []
        let desc = {}
        desc.inherits = 'Embedded_Record';
        desc.name = '<dynamic record>'
        desc.filename = '<null>'
        //console.log(this.__class__.getDescription())
        desc.fields = this.__class__.getDescription().params;
        this.__record__ = cm.getClass("Record").createFromDescription(desc)
        desc = {}
        desc.inherits = 'ReportWindow';
        desc.name = '<dynamic window>'
        desc.filename = '<null>'
        desc.__recordClass__ = this.__record__.__class__
        desc.form = []
        for (let i = 0; i < this.getRecord().fieldNames().length; i++) {
            desc.form.push({field: this.getRecord().fieldNames()[i]})
        }
        this.__paramswindow__ = cm.getClass("Window").createFromDescription(desc)
        this.__paramswindow__.setRecord(this.__record__)
        this.__paramswindow__.setReport(this)
        Embedded_Report.__reports__[this.__id__] = this;
        //console.log(Embedded_Report.__reports__);
        return this;
    }

    getId() {
        return this.__id__;
    }

    async open(showSpecWindow) {
        if (showSpecWindow == undefined) showSpecWindow = true;
        let self = this
        Embedded_Report.emit('open', {report: self, view: self.view, showSpecWindow: showSpecWindow})
        //Embedded_Report.notifyClassListeners({type: "report", action: "open", data: this})
        if (!showSpecWindow) {
            await self.run()
            self.render();
        }
    }


    getRecord() {
        return this.__record__
    }

    getParamsWindow() {
        return this.__paramswindow__
    }

    async callAction(actiondef) {
        if (this[actiondef.method]) return this[actiondef.method]();
    }


    toggleParamsWindow() {
        if (this.getParamsWindow()) {
            if (!this.getParamsWindow().isOpen()) {
                this.getParamsWindow().setRecord(this.getRecord())
                this.getParamsWindow().open();
            } else {
                this.getParamsWindow().close();
            }
        }
    }

    async runAndRender() {
        console.log("en run and render")
        if (this.getParamsWindow()) this.getParamsWindow().close();
        this.clear()
        await this.run();
        this.render();
    }

    async run() {
        console.log("running run de Embedded_report")
    }

    setView(reportview) {
        this.view = reportview
    }

    clear() {
        this.__html__ = [];
    }

    render() {
        this.emit('render', {report: this})
        //this.notifyListeners({type: "report", action: "render", data: this})
        //this.container.render();
    }

    setFocus() {
        this.emit('focus', {report: this})
        //this.notifyListeners({type: "report", action: "setFocus", data: this})
        //oo.ui.reportmanager.setFocus(this)
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

    addListener(listener) {
        this.__listeners__.push(listener)
    }

    notifyListeners(event) {
        _(this.__listeners__).forEach(function (listener) {
            listener.update(event);
        })
    }

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
        ) {
            wnd.setRecord(rec)
            wnd.open();
            wnd.setFocus();
        }
    }

    async __call_method_zoomin__(method, params, value) {
        this[method](params, value);
    }
}

//Embedded_Report.__description__ = Description
Embedded_Report
    .ids = 1;
Embedded_Report
    .__reports__ = [];


module
    .exports = Embedded_Report.initClass(Description)