"use strict";
var cm = global.__main__.require('./openorange').classmanager

var Description = {
    name: 'MasterWindow',
    inherits: 'Window',
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var MasterWindow = cm.createClass(Description, __filename )
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
MasterWindow.init = function init() {
    MasterWindow.super("init", this);
    return this
}

MasterWindow.getTitle = function getTitle() {
    var title = this.getOriginalTitle();
    if (this.getRecord() && this.getRecord().Code != null) title += " " + this.getRecord().Code;
    return title;
}

MasterWindow.fieldModified = function fieldModified(record, field, row, rowfield) {
    MasterWindow.super("fieldModified", this, record, field, row, rowfield)
    if (field.name == 'Code') this.notifyTitleChanged();
}

module.exports = MasterWindow