"use strict";
var _ = require("underscore");
var oo = require("./openorange").classmanager;
var cm = oo.classmanager;

var ListWindowContainer = Object.create(null);
ListWindowContainer.listwindows = [];
ListWindowContainer.init = function (wnd) {
    this.listwindow = wnd;
    this.windowjson = JSON.parse(JSON.stringify(this.listwindow.getDescription().columns));   //deep clone of the object because I need to add some metadata to it
    return this
}

ListWindowContainer.render = function render() {
    var self = this;
    //console.log(containerElement)
    var html = '<div class="container"></div>';
    var w = $(html)

    //w.append('<p>HOLA MUNDO</p>');
    w.append(self.createToolBar());
    w.append('<table class="recordlist"><thead></thead><tbody></tbody></table>')
    self.fillTable(w)
    this.tab_id = "tab_listwindow_" + ListWindowContainer.listwindows.length + 1;
    ListWindowContainer.listwindows.push({listwindow: this.listwindow, element: w, id: this.tab_id});
    //w.append(self.createComponent(this.windowjson));
    //w.append(self.createPasteWindow());
    //console.log(this.windowjson)
    this.__element__ = w;
    this.displayWindow(w)
};

ListWindowContainer.displayWindow = function displayWindow(windowElement) {
    var tab = $('<li class="tab col s3"><a href="#' + this.tab_id + '">' + this.listwindow.getTitle() + '</a></li>');
    $('ul.tabs.workspace').append(tab);
    windowElement.attr('id', this.tab_id);
    $('#workspace').append(windowElement);
    $('ul.tabs').tabs();
};

ListWindowContainer.createToolBar = function createToolBar() {
    var self = this;
    var html = '<div class="row">';
    html += '<a class="btn waves-effect waves-light"><i class="mdi">+</i></a>';
    html += '</div>';
    var res = $(html);
    //res.find("a").click(function (event) {self.save(event)});
    res.find("a").click(self.action_new.bind(self));
    return res;
};

ListWindowContainer.action_new = function action_new() {
    var self = this;
    var record = cm.getClass(self.listwindow.getDescription().recordClass).new()
    var window = cm.getClass(self.listwindow.getDescription().windowClass).new();
    window.setRecord(record);
    window.open();
    window.setFocus();
}

ListWindowContainer.fillTable = function fillTable(windowElement) {
    var self = this;
    var recordClass = cm.getClass(self.listwindow.__description__.recordClass);
    var columns = self.listwindow.__description__.columns;
    //var res = recordClass.select().fetch()
    var res = recordClass.select()
        .then(function(records) {
            var thead = windowElement.find(".recordlist>thead");
            thead.find("tr").remove()
            var tbody = windowElement.find(".recordlist>tbody");
            tbody.find("tr").remove()
            var tr = $("<tr></tr>");
            for (var i=0;i<columns.length;i++) {
                tr.append($('<th>'+columns[i].field+'</th>'));
            }
            thead.append(tr);
            for (var j=0;j<records.length;j++) {
                var rec = records[j];
                var tr = $("<tr></tr>");
                for (var i=0;i<columns.length;i++) {
                    var fn = columns[i].field;
                    var value = rec[fn];
                    if (value == null) value = '';
                    tr.append($('<td>'+value+'</td>'));
                }
                var listparams = {self: self, record: rec};
                tr.click(self.recordSelectedInListWindow.bind(listparams));
                tbody.append(tr)
            }
        });
}

ListWindowContainer.recordSelectedInListWindow = function recordSelectedInListWindow() {
    var self = this.self
    var record = this.record;
    record.load()
        .then(function () {
            var window = cm.getClass(self.listwindow.getDescription().windowClass).new();
            window.setRecord(record);
            window.open();
            window.setFocus();
        })
}

window.ListWindowManager = ListWindowContainer; //para hacer global la variable WindowManager