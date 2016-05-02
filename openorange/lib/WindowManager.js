"use strict"
var _ = require("underscore");

var WindowContainer = Object.create(null)
WindowContainer.windows = []
WindowContainer.init = function (wnd) {
    this.window = wnd;
    this.save = this.save.bind(this)
    this.afterEdit = this.afterEdit.bind(this)
    return this;
}

WindowContainer.render = function render() {
    var self = this;
    //console.log(containerElement)
    var html = '<div class="container"></div>';
    var w = $(html)
    w.append(self.createToolBar())
    var description = self.window.getDescription()
    var form = $('<div class="row"></div>')
    _(description.form).forEach(function (component) {
        form.append(self.createComponent(component))
    })
    w.append(form)
    this.displayWindow(w)

}

WindowContainer.displayWindow = function displayWindow(windowElement) {
    var tab_id = "tab_" + WindowContainer.windows.length+1;
    var tab = $('<li class="tab col s3"><a href="#'+tab_id+'">'+this.window.getTitle()+'</a></li>');
    $('ul.tabs').append(tab)
    windowElement.attr('id', tab_id);
    $('#workspace').append(windowElement);
    $('ul.tabs').tabs();
    Materialize.updateTextFields();
    WindowContainer.windows.push({window: window, element: windowElement, id: tab_id})
}

WindowContainer.createToolBar = function createToolBar() {
    var self = this;
    var html = '<div class="row">';
    html += '<a class="btn waves-effect waves-light"><i class="material-icons">done</i></a>'
    html += '</div>'
    var res = $(html);
    //res.find("a").click(function (event) {self.save(event)});
    res.find("a").click(self.save);
    return res;

}

WindowContainer.createComponent = function createComponent(json) {
    return this[json.type](json);
}






WindowContainer.save = function save() {
    console.log(this.definition)
    //alert("saving: ")
}

WindowContainer.input = function input(json) {
    var self = this;
    console.log(self.window.getRecord())
    var value = self.window.getRecord()!=null? self.window.getRecord()[json.field] : '';
    var html = '<div class="input-field col s4"><input value="'+value+'" type="text" name="'+json.field+'" class="validate"><label for="'+json.field+'">'+(json.label? json.label: json.field)+'</label></div>'
    var res = $(html);
    res.find("input").change(self.afterEdit);
    return res;
}

WindowContainer.afterEdit = function afterEdit(event) {
    this.window.afterEdit(event.currentTarget.name, event.currentTarget.value)
}

module.exports = WindowContainer