"use strict";
(function ($) {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    class ReportContainer extends oo.ui.BaseContainer {

        static getType() {
            return 'reportcontainer'
        }

        static findReport(id) {
            return require('openorange').classmanager.getClass('Embedded_Report').findReport(id);
        }


        constructor(report, parentView) {
            super(report, parentView)
            this.report = report;
            if (parentView) {
                this.shouldShowActions = false;
                this.shouldShowTitle = false;
            }
            //this.view = parentview;
            //this.windowjson = JSON.parse(JSON.stringify(this.report.getDescription().window));   //deep clone of the object because I need to add some metadata to it
            this.report.onAny(this.update.bind(this));
            return this
        }

        open(showSpecWindow) {
            this.showSpecWindow = showSpecWindow;
            super.open.call(this)
        }

        populateUIElement() {
            var self = this;
            let paramsWindowId = oo.ui.genId('REPORTWINDOW')
            let paramsWindow = $(`<div id="${paramsWindowId}"></div>`)
            let contentElement = $('<div name="content" class="oo-report-content"></div>')
            var w = this.__element__;
            w.append(paramsWindow)
            w.append(contentElement)
            oo.ui.containers.push({entity: this.report, element: w, tab_id: this.tab_id, container: self});
            this.__content_element__ = contentElement;
            if (this.showSpecWindow) {
                self.report.getParamsWindow().__ui_container_view_id__ = paramsWindowId;
                self.report.getParamsWindow().open()
            }
            /*if (w.siblings().length > 0) {
              w.siblings().each(function() {
                $(this).css('display', 'none');
              });
            }*/
        };

        getTitle() {
            return this.report.getTitle();
        }

        /*attachToWindowReportView() {
            var self = this;
            let contentElement = $('<div name="content"></div>')
            var w = this.__element__
            w.append(contentElement)
            this.__content_element__ = contentElement;
            let container = window.oo.ui.windowmanager.getWindowReportView(this.view.window, this.view.viewname)
            if (container) container.append(w)
        };*/

        render() {
            var self = this
            self.__content_element__.html(this.report.getHTML())
        };

        update(event) {
            var self = this;
            switch (event._meta.name) {
                case 'focus':
                    self.focus()
                    break;
                case 'render':
                    self.render()
                    break;
                case 'close':
                    self.close()
                    break;
            }
        };

    }
    ReportContainer.id_generator = 1;
    ReportContainer.reports = [];

    $(document).ready(function () {
        cm.getClass("Embedded_Report").onAny(function (event) {
            if (event._meta.name == 'open') {
                let parentView = null
                if (event.view) {
                    console.log("WWW", event.view)
                    parentView = oo.ui.windowmanager.getWindowReportView(event.view.window, event.view.viewname)
                    console.log("PP", parentView)
                }
                console.log("PARENT VIEW", parentView)
                let wm = new ReportContainer(event.report, parentView)
                //if (event.view) {
                //    wm.attachToWindowReportView(event.view)
                //} else {
                    wm.open(event.showSpecWindow)
                //}
            }
        });
    })

    window.oo.ui.reportmanager = ReportContainer;
    //$.extend(true, window.oo.ui, {reportmanager: ReportContainer})
    //window.ReportManager = ReportContainer; //para hacer global la variable ReportContainer
})(jQuery);
