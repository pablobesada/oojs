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
    w.append('<p>HOLA MUNDO</p>');
    //w.append(self.createToolBar());
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
    //$('.modal-trigger').leanModal();
    //windowElement.find('.datepicker').pickadate(WindowContainer.datePickerOptions);
    //$('input.editor[timeeditor=true]').mask('00:00:00');
    //if (this.listwindow.getRecord() != null) this.bindRecordToWindow(this.window.getRecord());
    //this.window.addListener(this);
};

window.ListWindowManager = ListWindowContainer; //para hacer global la variable WindowManager