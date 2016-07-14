"use strict";
(function ($) {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    class ReportContainer {

        static findReportContainerForTabId(tab_id) {
            console.log("TRCFTI", tab_id)
            for (let i=0;i<ReportContainer.reports.length;i++) {
                if (ReportContainer.reports[i].tab_id == tab_id) {
                    return ReportContainer.reports[i].container;
                }
            }
            return null
        }

        static findReport(id) {
            return require('openorange').classmanager.getClass('Embedded_Report').findReport(id);
        }

        static genUniqueId() {
            return "oo_report_" + this.id_generator++;
        }

        constructor(report, view) {
            this.report = report;
            this.view = view;
            //this.windowjson = JSON.parse(JSON.stringify(this.report.getDescription().window));   //deep clone of the object because I need to add some metadata to it
            this.report.onAny(this.update.bind(this));
            return this
        }

        setFocus(report) {
            $('ul.tabs.workspace').tabs('select_tab', this.tab_id);
        }

        appendToWorkspace(showSpecWindow) {
            var self = this;
            var html = '<div class="container"></div>';
            let paramsWindowId = ReportContainer.genUniqueId();
            let paramsWindow = $(`<div id="${paramsWindowId}"></div>`)
            let contentElement = $('<div name="content"></div>')
            var w = $(html)
            w.append(self.createToolBar());
            w.append(paramsWindow)
            w.append(contentElement)
            this.tab_id = "tab_report_" + (ReportContainer.reports.length + 1);
            ReportContainer.reports.push({report: this.report, element: w, tab_id: this.tab_id, container: self});
            this.__element__ = w;
            this.__params_window_element__ = paramsWindow;
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
        };

        attachToWindowReportView() {
            var self = this;
            var html = '<div class="container"></div>';
            let contentElement = $('<div name="content"></div>')
            var w = $(html)
            w.append(contentElement)
            this.__element__ = w;
            this.__content_element__ = contentElement;
            let container = window.oo.ui.windowmanager.getWindowReportView(this.view.window, this.view.viewname)
            container.append(w)
        };

        createToolBar() {
            var self = this;
            var html = '<div class="row">';
            for (let i = 0; i < self.report.__class__.getDescription().actions.length; i++) {
                let actiondef = self.report.__class__.getDescription().actions[i]
                let label = 'icon' in actiondef? `<i class="mdi">${actiondef.icon}</i>` : actiondef.label;
                html += `<a class="btn waves-effect waves-light" action="${actiondef.method}">${label}</a>`;
            }

            html += '</div>';
            var res = $(html);
            for (let i = 0; i < self.report.__class__.getDescription().actions.length; i++) {
                let actiondef = self.report.__class__.getDescription().actions[i];
                let params = {self: self, actiondef: actiondef}
                res.find(`a[action=${actiondef.method}]`).click(self.actionClicked.bind(params));
            }
            return res;
        };

        render() {
            var self = this
            self.__content_element__.html(this.report.getHTML())
        };

        update(event) {
            var self = this;
            switch (event._meta.name) {
                case 'focus':
                    self.setFocus()
                    break;
                case 'render':
                    self.render()
                    break;
            }
        };

        async actionClicked(event) {
            let params = this;
            let self = params.self;
            let actiondef = params.actiondef;
            self.report.callAction(actiondef);
        }

        async processKeyPress(event) {
            let actions = this.report.__class__.getDescription().actions;
            for (let i=0;i<actions.length;i++) {
                let actiondef = actions[i]
                if (actiondef.shortcut) {
                    let keys = actiondef.shortcut.toLowerCase().split("+");
                    let shift = false, enter = false, ctrl = false, alt = false, letter = null;
                    for (let j=0;j<keys.length;j++) {
                        let key = keys[j]
                        switch(key) {
                            case "shift":
                                shift = true;
                                break;
                            case "ctrl":
                                ctrl = true;
                                break;
                            case "alt":
                                alt = true;
                                break;
                            case "enter":
                                letter = 'enter';
                                break;
                            default:
                                letter = key;
                                break;
                        }
                    }
                    if (shift != event.shiftKey || ctrl != event.ctrlKey || alt != event.altKey) return;
                    if (letter != event.key.toLowerCase()) return;
                    this.report.callAction(actiondef)
                }
            }
            return false;
        }

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


