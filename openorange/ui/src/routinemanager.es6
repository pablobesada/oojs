"use strict";
(function ($) {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    class RoutineContainer extends oo.ui.BaseContainer {

        static getType() {
            return 'routinecontainer'
        }

        constructor(routine, view) {
            super(routine)
            this.routine = routine;
            this.routine.onAny(this.update.bind(this));
            return this
        }

        open(showSpecWindow) {
            this.showSpecWindow = showSpecWindow;
            super.open.call(this);
        }

        populateUIElement() {
            var self = this;
            let paramsWindowId = oo.ui.genId('ROUTINEWINDOW')
            let paramsWindow = $(`<div id="${paramsWindowId}"></div>`)
            let contentElement = $('<div name="content"></div>')
            var w = this.__element__;
            w.append(paramsWindow)
            w.append(contentElement)
            this.__content_element__ = contentElement;
            self.routine.getParamsWindow().__ui_container_view_id__ = paramsWindowId;
            self.routine.getParamsWindow().open()
        };

        getTitle() {
            return this.routine.getTitle();
        }

        update(event) {
            var self = this;
            switch (event._meta.name) {
                case 'focus':
                    self.focus()
                    break;
                case 'render':
                    self.render()
                    break;
            }
        };

    }

    $(document).ready(function () {
        cm.getClass("Embedded_Routine").onAny(function (event) {
            if (event._meta.name == 'open') {
                let wm = new RoutineContainer(event.routine)
                wm.open()
            }
        });
    })

    window.oo.ui.routinemanager = RoutineContainer;
    //$.extend(true, window.oo.ui, {reportmanager: ReportContainer})
    //window.ReportManager = ReportContainer; //para hacer global la variable ReportContainer
})(jQuery);
