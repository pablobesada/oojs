"use strict"; 
var cm = require('openorange').classmanager

var Description = {
    name: 'NumerableWindow',
    inherits: 'Window',
    filename:  __filename,
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Parent = cm.SuperClass(Description)
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
class NumerableWindow extends Parent {
    constructor() {
        super()
    }

    getTitle() {
        var title = this.getOriginalTitle();
        if (this.getRecord() && this.getRecord().SerNr != null) title += " " + this.getRecord().SerNr;
        return title;
    }

    fieldModified(event) {
        super.fieldModified(event)
        if (event.field.name == 'SerNr') this.notifyTitleChanged();
    }


    'changed SerNr'() {
        console.log("en numerablewindow: changed SerNr")
    }

    'focus SerNr2'() {
        return false;
    }
}

module.exports = NumerableWindow.initClass(Description)