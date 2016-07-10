"use strict";
(function ($) {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    class ReportContainer {

        static findReport(id) {
            return require('openorange').classmanager.getClass('Embedded_Report').findReport(id);
        }

        constructor(report) {
            this.report = report;
            //this.windowjson = JSON.parse(JSON.stringify(this.report.getDescription().window));   //deep clone of the object because I need to add some metadata to it
            this.report.addListener(this);
            return this
        }

        setFocus(report) {
            $('ul.tabs').tabs('select_tab', this.tab_id);
        }

        appendToWorkspace() {
            var self = this;
            //console.log(containerElement)
            var html = '<div class="container"></div>';

            var w = $(html)

            this.tab_id = "tab_reportwindow_" + (ReportContainer.reports.length + 1);
            console.log("ADDING REPORT:", this.tab_id)
            ReportContainer.reports.push({report: this.report, element: w, tab_id: this.tab_id, container: self});
            this.__element__ = w;
            var tab = $('<li class="tab col s3"><a href="#' + this.tab_id + '">' + this.report.getTitle() + '</a></li>');
            $('ul.tabs.workspace').append(tab);

            w.attr('id', this.tab_id);

            $('#workspace').append(w);
            $('ul.tabs').tabs();
        };

        render() {
            var self = this
            self.__element__.html(this.report.getHTML())
        };

        update(event) {
            var self = this;
            switch (event.type) {
                case "report":
                    switch (event.action) {
                        case 'setFocus':
                            self.setFocus()
                            break;
                        case 'render':
                            self.render()
                            break;
                    }
                    break
            }
        };
    }
    ReportContainer.reports = [];

    $(document).ready(function () {
        cm.getClass("Embedded_Report").addClassListener({
            update: function (event) {
                if (event.type == 'report' && event.action == 'open') {
                    let wm = new ReportContainer(event.data)
                    wm.appendToWorkspace()
                }
            }
        });
    })

    window.oo.ui.reportmanager = ReportContainer;
    //$.extend(true, window.oo.ui, {reportmanager: ReportContainer})
    //window.ReportManager = ReportContainer; //para hacer global la variable ReportContainer
})(jQuery);


