"use strict"
var _ = require("underscore");

var WindowContainer = Object.create(null)
WindowContainer.windows = []
WindowContainer.init = function (wnd) {
    this.window = wnd;
    this.window.__container_data__ = {}
    this.save = this.save.bind(this)
    this.afterEdit = this.afterEdit.bind(this)
    this.beforeEdit = this.beforeEdit.bind(this)
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
    if (this.window.getRecord() != null) this.bindToRecord(this.window.getRecord());
    this.window.__container_data__.tab_id = tab_id
    WindowContainer.windows.push({window: window, element: windowElement, id: tab_id})
    this.window.addListener(this);
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

WindowContainer.setWindowTitle = function setWindowTitle(title) {
    $("a[href='#" + this.window.__container_data__.tab_id + "']").html(title)
}
WindowContainer.createComponent = function createComponent(json) {
    var editor;
    if ('editor' in json) {
        editor = json.editor;
    } else {
        var rclass = this.window.getRecordClass()
        var field = rclass.__description__.fields[json.field]
        switch (field.type) {
            case 'string': editor = 'string'; break;
            case 'integer': editor = 'integer'; break;
            case 'detail': editor = 'matrix'; break;
        }
    }
    return this[editor](json);
}






WindowContainer.save = function save() {
    this.window.save()
}

WindowContainer.string = function string(json) {
    var self = this;
    var html = '<div class="input-field col s4"><input value="" type="text" name="'+json.field+'" class="editor header validate"><label for="'+json.field+'">'+(json.label? json.label: json.field)+'</label></div>'
    var res = $(html);
    res.find("input").focus(self.beforeEdit);
    res.find("input").change(self.afterEdit);
    return res;
}

WindowContainer.integer = function integer(json) {
    var self = this;
    var label = json.label? json.label: json.field;
    var html = '<div class="input-field col s4"><input value="" type="number" name="'+json.field+'" class="editor header validate"><label for="'+json.field+'">'+label+'</label></div>'
    var res = $(html);
    res.find("input").change(self.afterEdit);
    return res;
}

WindowContainer.matrix = function matrix(json) {
    var self = this;
    var table = $('<table name="'+ json.name +'"></table>')
    var thead = $("<thead></thead>")
    var colHeaderRow = $("<tr></tr>")
    thead.append(colHeaderRow);
    _(json.columns).forEach(function (col) {
        var label = col.label? col.label: col.field;
        var colHeader = $("<th>" + col.field + "</ht>")
        colHeaderRow.append(colHeader)
    })
    table.append(thead)
    return table;
}

WindowContainer.beforeEdit = function beforeEdit(event) {
    //console.log("beforeEdit: " + event.target.name)
    $(event.target).attr("readonly", !Boolean(this.window.beforeEdit(event.currentTarget.name)))
}

WindowContainer.afterEdit = function afterEdit(event) {
    this.window.afterEdit(event.currentTarget.name, event.currentTarget.value)
}


WindowContainer.update = function update(event) {
    switch (event.type) {
        case "record":
            if (event.action == 'replaced') this.bindToRecord(event.data);
            break;
        case "field":
            if (event.action == 'modified') {
                var field = event.data
                if (field.type != "detail") {
                    this.setEditorValue(field);
                    Materialize.updateTextFields();
                }
            }
            break;
        case "title":
            if (event.action == "modified") {
                this.setWindowTitle(event.data)
            }
            break;
    }
}

WindowContainer.setEditorValue = function setEditorValue(field) {
    var value = field.getValue();
    $('.editor.header[name=' + field.name + ']').val(value)

}

WindowContainer.bindToRecord = function bindToRecord(record) {
    var self = this;
    var description = self.window.getDescription()
    _(description.form).forEach(function (component) {
        if (!('columns' in component)) {
            self.setEditorValue(record.fields(component.field))
        }
    })
    Materialize.updateTextFields();
}

module.exports = WindowContainer