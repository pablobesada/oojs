"use strict";
var _ = require("underscore");
var oo = require("./openorange").classmanager;
var cm = oo.classmanager;

var ReportContainer = Object.create(null);
ReportContainer.reports = [];
ReportContainer.init = function (report) {
    this.report = report;
    this.windowjson = JSON.parse(JSON.stringify(this.report.getDescription().window));   //deep clone of the object because I need to add some metadata to it
    return this
}

ReportContainer.render = function render() {
    var self = this;
    //console.log(containerElement)
    var html = '<div class="container"></div>';

    var w = $(html)

    //w.append('<p>HOLA MUNDO</p>');
    //w.append(self.createToolBar());
    //w.append('<table class="recordlist"><thead></thead><tbody></tbody></table>')
    //self.fillTable(w)
    this.tab_id = "tab_reportwindow_" + ReportContainer.reports.length + 1;
    ReportContainer.reports.push({report: this.report, element: w, id: this.tab_id, container: self});
    //w.append(self.createComponent(this.windowjson));
    //w.append(self.createPasteWindow());
    //console.log(this.windowjson)
    this.__element__ = w;
    this.displayReport(w)

};

ReportContainer.displayReport = function displayReport(windowElement) {

    var self = this
    var tab = $('<li class="tab col s3"><a href="#' + this.tab_id + '">' + this.report.getTitle() + '</a></li>');


    $('ul.tabs.workspace').append(tab);

    windowElement.attr('id', this.tab_id);

    $('#workspace').append(windowElement);

    $('ul.tabs').tabs();
    windowElement.html(this.report.getHTML())

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


window.ReportManager = ReportContainer; //para hacer global la variable ReportContainer