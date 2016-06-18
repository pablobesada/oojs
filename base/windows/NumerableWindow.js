"use strict";

var cm = require('openorange').classmanager;

var Description = {
    name: 'NumerableWindow',
    inherits: 'Window'
};

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var NumerableWindow = cm.createClass(Description, __filename);
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
NumerableWindow.init = function init() {
    NumerableWindow.__super__.init.call(this);
    return this;
};

NumerableWindow.getTitle = function getTitle() {
    var title = this.getOriginalTitle();
    if (this.getRecord() && this.getRecord().SerNr != null) title += " " + this.getRecord().SerNr;
    return title;
};

NumerableWindow.fieldModified = function fieldModified(record, field, row, rowfield, oldvalue) {
    NumerableWindow.super("fieldModified", this, record, field, row, rowfield, oldvalue);
    if (field.name == 'SerNr') this.notifyTitleChanged();
};

NumerableWindow['changed SerNr'] = function () {
    console.log("en numerablewindow: changed SerNr");
};

NumerableWindow['focus SerNr2'] = function () {
    return false;
};

module.exports = NumerableWindow;

//# sourceMappingURL=NumerableWindow.js.map