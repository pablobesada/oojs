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
        newdesc.actions = parentdesc.actions
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
        this.json = [];
        this.curjson = this.json;
        this.jsonstack = []
        this.__id__ = Embedded_Report.ids++;
        this.__listeners__ = []
        this.__isrunning__ = false;
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
        if (showSpecWindow == undefined || showSpecWindow == null) showSpecWindow = true;
        let self = this
        Embedded_Report.emit('open', {report: self, view: self.view, showSpecWindow: showSpecWindow})
        //Embedded_Report.notifyClassListeners({type: "report", action: "open", data: this})
        if (!showSpecWindow) {
            await self.run()
            self.render();
        }
    }

    close() {
        this.emit("close", {report: this})
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
        if (!this.__isrunning__) {
            if (this.getParamsWindow()) this.getParamsWindow().close();
            this.clear()
            await this.execute();
            this.render();

        }
    }

    async execute() {
        this.__isrunning__ = true;
        await this.run()
        this.__isrunning__ = false;
    }

    async run() {
    }

    setView(reportview) {
        this.view = reportview
    }

    clear() {
        this.__html__ = [];
        this.json = []
        this.curjson = this.json
        this.jsonstack = []
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
        let self = this;
        //return this.__html__.join("\n")
        let html = [];

        function processNode(o) {
            if (o.length) {
                _.each(o, processNode)
            } else {
                switch (o.type) {
                    case 'table':
                        html.push('<table>');
                        processNode(o.content);
                        html.push('</table>');
                        break;
                    case 'row':
                        html.push(`<tr ${o.class? 'class="'+o.class+'"': ''}>`);
                        processNode(o.content);
                        html.push('</tr>');
                        break;
                    case 'cell':
                        let onclick = '';
                        if ('Window' in o.options && 'FieldName' in o.options) {
                            onclick = 'onclick="oo.ui.reportmanager.findReport(' + self.getId() + ').__std_zoomin__(\'' + o.options['Window'] + '\',\'' + o.options['FieldName'] + '\',\'' + o.content + '\')"';
                        } else if ('CallMethod' in o.options) {
                            var param = 'Parameter' in o.options ? "'" + o.options['Parameter'] + "'" : '';
                            onclick = 'onclick="oo.ui.reportmanager.findReport(' + self.getId() + ').__call_method_zoomin__(\'' + o.options['CallMethod'] + '\',' + param + ',\'' + o.content + '\')"';
                        }
                        html.push(`<td ${onclick}>`);
                        html.push(o.content)
                        html.push('</td>');
                        break
                }
            }
        }
        processNode(this.json);
        return html.join('\n')
    }

    startTable() {
        this.__html__.push("<table>")
        let table = {type: 'table', content: []}
        this.jsonstack.push(this.curjson)
        this.curjson.push(table)
        this.curjson = table.content
    }

    endTable() {
        this.__html__.push("</table>")
        this.curjson = this.jsonstack.pop()
    }

    startRow() {
        this.__html__.push("<tr>")
        let row = {type: 'row', content: []}
        this.jsonstack.push(this.curjson)
        this.curjson.push(row)
        this.curjson = row.content
    }

    endRow() {
        this.__html__.push("</tr>")
        this.curjson = this.jsonstack.pop()
    }

    startHeaderRow() {
        this.__html__.push("<tr style='font-weight: bold'>")
        let row = {type: 'row', content: [], class: 'oo-report-header-row'}
        this.jsonstack.push(this.curjson)
        this.curjson.push(row)
        this.curjson = row.content
    }

    endHeaderRow() {
        this.__html__.push("</tr>")
        this.curjson = this.jsonstack.pop()
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
        this.curjson.push({type: 'cell', content: v, options: options})
    }

    async __std_zoomin__(w, fn, v) {
        let wnd = cm.getClass(w).new();
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
        if (!this.__isrunning__) this[method](params, value);
    }
}

//Embedded_Report.__description__ = Description
Embedded_Report.ids = 1;
Embedded_Report.__reports__ = [];


module
    .exports = Embedded_Report.initClass(Description)