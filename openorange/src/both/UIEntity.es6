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
    actions: []
}




class UIEntity extends BaseEntity {
    constructor() {
        super()
        this.actionsVisibility = {}
    }

    async callAction(actiondef) {
        if (this[actiondef.method]) return this[actiondef.method]();
    }

    isActionRelevant(actiondef) {
        console.log(actiondef, this.actionsVisibility)
        let res = null;
        if (actiondef.method in this.actionsVisibility) {
            res = this.actionsVisibility[actiondef.method]
        } else {
            res = true;
        }
        console.log("res ", res)
        return res;
    }

    setActionVisibility(method, visible) {
        console.log(method, visible)
        this.actionsVisibility[method] = visible;
        this.emit("action visibility", {method: 'testAction', visibility: false})
    }

}


if (typeof window == 'undefined') {
    module.exports = UIEntity.initClass(Descriptor)
} else {
    window.oo.UIEntity = UIEntity.initClass(Descriptor)
}