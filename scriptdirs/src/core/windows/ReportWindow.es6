"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'ReportWindow',
    inherits: 'Embedded_Window',
    filename: __filename,
    actions: [
        {label: 'Run', method: 'runAndRender', icon: 'play_arrow', group: 'basic'},
    ],
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Parent = cm.SuperClass(Description)
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
class ReportWindow extends Parent {
    constructor() {
        super()
        this.report = null;
    }

    setReport(report) {
        this.report = report
    }

    async runAndRender() {
        console.log("en run and render")
        this.report.clear()
        await this.report.run();
        this.report.render();
        this.close();
    }
}
module.exports = ReportWindow.initClass(Description)