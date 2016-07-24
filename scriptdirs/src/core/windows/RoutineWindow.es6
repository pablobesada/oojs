"use strict";
var cm = require('openorange').classmanager

var Description = {
    name: 'RoutineWindow',
    inherits: 'Embedded_Window',
    filename: __filename,
    actions: [
        //{label: 'Run', method: 'runAndRender', icon: 'play_arrow', group: 'basic'},
    ],
}

//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
var Parent = cm.SuperClass(Description)
//console.log("parentclass of core::item: " + ParentClass.new().__description__.name)
class RoutineWindow extends Parent {
    constructor() {
        super()
        this.routine = null;
    }

    setRoutine(routine) {
        this.routine = routine
    }

}
module.exports = RoutineWindow.initClass(Description)