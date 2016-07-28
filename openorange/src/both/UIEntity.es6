"use strict";

let BaseEntity = null
if (typeof window == 'undefined') {
    BaseEntity = require('./BaseEntity')
} else {
    let oo = require('openorange')
    BaseEntity = oo.BaseEntity;
}

let Descriptor = {
    name: "UIEntity",
    filename: "uientity.js",
    actions: [{label: 'Close', method: 'close', icon: 'close', group: 'invisible', shortcut: 'alt+w'},],
}

class UIEntity extends BaseEntity {
    static initClass(descriptor) {
        super.initClass(descriptor)
        let parentdesc = this.__description__;
        let newdesc = {};
        newdesc.actions = parentdesc.actions ? parentdesc.actions.slice() : []
        if (descriptor.actions) {
            for (let i = 0; i < descriptor.actions.length; i++) newdesc.actions.push(descriptor.actions[i])
        }
        this.__description__ = newdesc
        return this;
    }

    constructor() {
        super()
        this.actionsVisibility = {}
        this.actionsStatus = {}
        this.setActionVisible('close', false, false)
    }

    async callAction(actiondef) {
        if (this[actiondef.method]) return this[actiondef.method]();
    }

    isActionVisible(actiondef) {
        let res = null;
        if (actiondef.method in this.actionsVisibility) {
            res = this.actionsVisibility[actiondef.method]
        } else {
            res = true;
        }
        return res;
    }

    isActionEnabled(actiondef) {
        let res = null;
        if (actiondef.method in this.actionsStatus) {
            res = this.actionsStatus[actiondef.method]
        } else {
            res = true;
        }
        return res;
    }

    setActionVisible(method, visible, emitEvent) {
        this.actionsVisibility[method] = visible;
        if (emitEvent == undefined) emitEvent = true;
        if (emitEvent) this.emit("action status", {method: method, visibility: false})
    }

    setActionEnabled(method, enabled, emitEvent) {
        this.actionsStatus[method] = enabled;
        if (emitEvent == undefined) emitEvent = true;
        if (emitEvent) this.emit("action status", {method: method, enabled: enabled})
    }

    getVisibleActions() {
        let res = [];
        let allactions = this.__class__.getDescription().actions
        for (let i=0;i<allactions.length; i++) {
            let actiondef = allactions[i]
            if (this.isActionEnabled(actiondef) && this.isActionVisible(actiondef)) res.push(actiondef)
        }
        return res;
    }

    getEnabledActions() {
        let res = [];
        let allactions = this.__class__.getDescription().actions
        for (let i=0;i<allactions.length; i++) {
            let actiondef = allactions[i]
            if (this.isActionEnabled(actiondef)) res.push(actiondef)
        }
        return res;
    }

}


if (typeof window == 'undefined') {
    module.exports = UIEntity.initClass(Descriptor)
} else {
    window.oo.UIEntity = UIEntity.initClass(Descriptor)
}