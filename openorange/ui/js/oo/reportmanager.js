"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    var ReportContainer = function () {
        _createClass(ReportContainer, null, [{
            key: "findReport",
            value: function findReport(id) {
                return require('openorange').classmanager.getClass('Embedded_Report').findReport(id);
            }
        }]);

        function ReportContainer(report) {
            _classCallCheck(this, ReportContainer);

            this.report = report;
            //this.windowjson = JSON.parse(JSON.stringify(this.report.getDescription().window));   //deep clone of the object because I need to add some metadata to it
            this.report.addListener(this);
            return this;
        }

        _createClass(ReportContainer, [{
            key: "setFocus",
            value: function setFocus(report) {
                $('ul.tabs').tabs('select_tab', this.tab_id);
            }
        }, {
            key: "appendToWorkspace",
            value: function appendToWorkspace() {
                var self = this;
                //console.log(containerElement)
                var html = '<div class="container"></div>';

                var w = $(html);

                this.tab_id = "tab_reportwindow_" + (ReportContainer.reports.length + 1);
                console.log("ADDING REPORT:", this.tab_id);
                ReportContainer.reports.push({ report: this.report, element: w, tab_id: this.tab_id, container: self });
                this.__element__ = w;
                var tab = $('<li class="tab col s3"><a href="#' + this.tab_id + '">' + this.report.getTitle() + '</a></li>');
                $('ul.tabs.workspace').append(tab);

                w.attr('id', this.tab_id);

                $('#workspace').append(w);
                $('ul.tabs').tabs();
            }
        }, {
            key: "render",
            value: function render() {
                var self = this;
                self.__element__.html(this.report.getHTML());
            }
        }, {
            key: "update",
            value: function update(event) {
                var self = this;
                switch (event.type) {
                    case "report":
                        switch (event.action) {
                            case 'setFocus':
                                self.setFocus();
                                break;
                            case 'render':
                                self.render();
                                break;
                        }
                        break;
                }
            }
        }]);

        return ReportContainer;
    }();

    ReportContainer.reports = [];

    $(document).ready(function () {
        console.log("en docready reportmanager");
        cm.getClass("Embedded_Report").addClassListener({
            update: function update(event) {
                if (event.type == 'report' && event.action == 'open') {
                    var wm = new ReportContainer(event.data);
                    wm.appendToWorkspace();
                }
            }
        });
    });

    window.oo.ui.reportmanager = ReportContainer;
    //$.extend(true, window.oo.ui, {reportmanager: ReportContainer})
    //window.ReportManager = ReportContainer; //para hacer global la variable ReportContainer
})(jQuery);
//# sourceMappingURL=reportmanager.js.map
