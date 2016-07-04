"use strict";
(function ($) {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    var ReportContainer = Object.create(null);

    $(document).ready( function () {
        cm.getClass("Embedded_Report").addClassListener(ReportContainer);
    })

    ReportContainer.reports = [];
    ReportContainer.init = function (report) {
        this.report = report;
        //this.windowjson = JSON.parse(JSON.stringify(this.report.getDescription().window));   //deep clone of the object because I need to add some metadata to it
        this.report.addListener(this);
        return this
    }

    ReportContainer.setFocus = function setFocus(report) {
        console.log("LENGTH:", ReportContainer.reports.length)
        for (var i = 0; i < ReportContainer.reports.length; i++) {
            var w = ReportContainer.reports[i];
            console.log(i, w.report, report)
            if (w.report === report) {
                console.log("report found: " + w.tab_id)
                $('ul.tabs').tabs('select_tab', w.tab_id);
            }
        }
    }

    ReportContainer.appendToWorkspace = function render() {
        var self = this;
        //console.log(containerElement)
        var html = '<div class="container"></div>';

        var w = $(html)

        this.tab_id = "tab_reportwindow_" + (ReportContainer.reports.length + 1);
        console.log("ADING REPORT:", this.tab_id)
        ReportContainer.reports.push({report: this.report, element: w, tab_id: this.tab_id, container: self});
        this.__element__ = w;
        var tab = $('<li class="tab col s3"><a href="#' + this.tab_id + '">' + this.report.getTitle() + '</a></li>');
        $('ul.tabs.workspace').append(tab);

        w.attr('id', this.tab_id);

        $('#workspace').append(w);

        $('ul.tabs').tabs();
    };

    ReportContainer.render = function render() {
        var self = this
        self.__element__.html(this.report.getHTML())
    };

    ReportContainer.findReport = function findReport(id) {
        return require('openorange').classmanager.getClass('Embedded_Report').findReport(id);
    }

    ReportContainer.update = function update(event) {
        var self = this;
        switch (event.type) {
            case "report":
                switch (event.action) {
                    case 'open': //Class Event
                        let container = Object.create(ReportContainer).init(event.data)
                        container.appendToWorkspace()
                        break;
                    case 'setFocus':
                        self.setFocus(event.data)
                        break;
                    case 'render':
                        self.render()
                        break;
                }
                break
        }
    };

    window.oo.ui.reportmanager = ReportContainer;
    //$.extend(true, window.oo.ui, {reportmanager: ReportContainer})
    //window.ReportManager = ReportContainer; //para hacer global la variable ReportContainer
})(jQuery);


