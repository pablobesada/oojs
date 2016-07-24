"use strict"
var oo = require('openorange')
var cm = oo.classmanager

var Description = {
    name: 'Embedded_Routine',
    inherits: null,
    filename: __filename,
    actions: [
        {label: 'Run', method: 'execute', icon: 'play_arrow', group: 'basic', shortcut: 'shift+enter'},
        {label: 'Toggle Window', method: 'toggleParamsWindow', icon: 'settings', group: 'basic'},
    ],
}

/*var Embedded_Report =  Object.create({
 '__super__': null,
 '__description__': Description,
 '__filename__': __filename,
 })*/

class Embedded_Routine extends oo.UIEntity {

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



    constructor() {
        super()
        this.__isrunning__ = false;
        let desc = {}
        desc.inherits = 'Embedded_Record';
        desc.name = '<dynamic record>'
        desc.filename = '<null>'
        //console.log(this.__class__.getDescription())
        desc.fields = this.__class__.getDescription().params;
        this.__record__ = cm.getClass("Record").createFromDescription(desc)
        desc = {}
        desc.inherits = 'RoutineWindow';
        desc.name = '<dynamic window>'
        desc.filename = '<null>'
        desc.__recordClass__ = this.__record__.__class__
        desc.form = []
        for (let i = 0; i < this.getRecord().fieldNames().length; i++) {
            desc.form.push({field: this.getRecord().fieldNames()[i]})
        }
        this.__paramswindow__ = cm.getClass("Window").createFromDescription(desc)
        this.__paramswindow__.setRecord(this.__record__)
        this.__paramswindow__.setRoutine(this)
        //console.log(Embedded_Report.__reports__);
        return this;
    }

    async open() {
        let self = this
        Embedded_Routine.emit('open', {routine: self})
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

    async execute() {
        if (!this.__isrunning__) {
            this.__isrunning__ = true;
            if (this.getParamsWindow()) this.getParamsWindow().close();
            await this.run();
            this.__isrunning__ = false;
        }
    }

    async run() {
    }



    setFocus() {
        this.emit('focus', {routine: this})
        //this.notifyListeners({type: "report", action: "setFocus", data: this})
        //oo.ui.reportmanager.setFocus(this)
    }

    getTitle() {
        return this.__class__.__description__.title;
    }
}

//Embedded_Report.__description__ = Description


module.exports = Embedded_Routine.initClass(Description)