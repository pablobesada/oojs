"use strict";
(function ($) {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    class ReportContainer extends oo.ui.BaseContainer {

        static findReport(id) {
            return require('openorange').classmanager.getClass('Embedded_Report').findReport(id);
        }


        constructor(report, view) {
            super(report)
            this.report = report;
            this.view = view;
            //this.windowjson = JSON.parse(JSON.stringify(this.report.getDescription().window));   //deep clone of the object because I need to add some metadata to it
            this.report.onAny(this.update.bind(this));
            return this
        }

        appendToWorkspace(showSpecWindow) {
            var self = this;
            let paramsWindowId = oo.ui.genId('REPORTWINDOW')
            let paramsWindow = $(`<div id="${paramsWindowId}"></div>`)
            let contentElement = $('<div name="content"></div>')
            var w = this.__element__;
            w.append(paramsWindow)
            w.append(contentElement)
            oo.ui.containers.push({entity: this.report, element: w, tab_id: this.tab_id, container: self});
            this.__content_element__ = contentElement;
            var tab = $('<li class="tab col"><a href="#' + this.tab_id + '">' + this.report.getTitle() + '</a></li>');
            $('ul.tabs.workspace').append(tab);
            w.attr('id', this.tab_id);
            $('#workspace').append(w);
            $('ul.tabs.workspace').tabs();
            if (showSpecWindow) {
                self.report.getParamsWindow().__ui_container_view_id__ = paramsWindowId;
                self.report.getParamsWindow().open()
            }
            self.renderActionBar();
        };

        attachToWindowReportView() {
            var self = this;
            let contentElement = $('<div name="content"></div>')
            var w = this.__element__
            w.append(contentElement)
            this.__content_element__ = contentElement;
            let container = window.oo.ui.windowmanager.getWindowReportView(this.view.window, this.view.viewname)
            container.append(w)
        };

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
            }
        };

    }
    ReportContainer.id_generator = 1;
    ReportContainer.reports = [];

    $(document).ready(function () {
        cm.getClass("Embedded_Report").onAny(function (event) {
            console.log(event)
            if (event._meta.name == 'open') {
                let wm = new ReportContainer(event.report, event.view)
                if (event.view) {
                    wm.attachToWindowReportView(event.view)
                } else {
                    wm.appendToWorkspace(event.showSpecWindow)
                }
            }
        });
    })

    window.oo.ui.reportmanager = ReportContainer;
    //$.extend(true, window.oo.ui, {reportmanager: ReportContainer})
    //window.ReportManager = ReportContainer; //para hacer global la variable ReportContainer
})(jQuery);


