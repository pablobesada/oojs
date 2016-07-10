"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'MasterWindow',
    inherits: 'Window',
    filename: __filename,
}


var Parent = cm.SuperClass(Description)

class MasterWindow extends Parent {
    constructor() {
        super();
    }

    getTitle() {
        var title = this.getOriginalTitle();
        if (this.getRecord() && this.getRecord().Code != null) title += " " + this.getRecord().Code;
        return title;
    }

    fieldModified(event) {
        super.fieldModified(event)
        if (event.field.name == 'Code') this.notifyTitleChanged();
    }
}
module.exports = MasterWindow.initClass(Description)