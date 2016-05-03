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
        form.append(self.createComponent(component, 'oomaster'))
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

WindowContainer.createComponent = function createComponent(json, cls) {
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
    return this[editor](json, cls, null, true);
}

WindowContainer.createMatrixComponent = function createMatrixComponent(jcol, cls, field) {
    var editor;
    if ('editor' in jcol) {
        editor = jcol.editor;
    } else {
        switch (field.type) {
            case 'string': editor = 'string'; break;
            case 'integer': editor = 'integer'; break;
        }
    }
    return this[editor](jcol, cls, field, false);
}








WindowContainer.save = function save() {
    this.window.save()
}

WindowContainer.string = function string(json, cls, field, addLabel) {
    var self = this;
    var value = field != null ? field.getValue(): '';
    if (value == null) value = '';
    var label = '';
    if (addLabel) label = '<label for="'+json.field+'">'+(json.label? json.label: json.field)+'</label>';
    var html = '<div class="input-field col s4"><input value="'+value+'" type="text" name="'+json.field+'" class="editor '+ cls + ' validate">'+label+'</div>'
    var res = $(html);
    res.find("input").focus(self.beforeEdit);
    res.find("input").change(self.afterEdit);
    return res;
}

WindowContainer.integer = function integer(json, cls, field, addLabel) {
    var self = this;
    var value = field != null? field.getValue(): '';
    if (value == null) value = '';
    var label = '';
    if (addLabel) label = '<label for="'+json.field+'">'+(json.label? json.label: json.field)+'</label>';
    var html = '<div class="input-field col s4"><input value="'+value+'" type="number" name="'+json.field+'" class="editor '+ cls + ' validate">'+label+'</div>'
    var res = $(html);
    res.find("input").focus(self.beforeEdit);
    res.find("input").change(self.afterEdit);
    return res;
}

WindowContainer.beforeEdit = function beforeEdit(event) {
    var readonly = !Boolean(this.window.beforeEdit(event.target.name))
    $(event.target).attr("readonly", readonly);
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
    $('.editor.oomaster[name=' + field.name + ']').val(value)
}

WindowContainer.setEditorReadOnly = function setEditorReadOnly(field, readonly) {
    $('.editor.oomaster[name=' + field.name + ']').attr('readonly', readonly)
}

WindowContainer.matrix = function matrix(json) {
    var self = this;
    var table = $('<table name="'+ json.field +'" class="bordered striped"></table>')
    var thead = $("<thead></thead>")
    var colHeaderRow = $("<tr></tr>")
    thead.append(colHeaderRow);
    _(json.columns).forEach(function (col) {
        var label = col.label? col.label: col.field;
        var colHeader = $("<th>" + col.field + "</ht>")
        colHeaderRow.append(colHeader)
    })
    table.append(thead)
    table.append('<tbody></tbody>')
    return table;
}

WindowContainer.addMatrixRow = function addMatrixRow(json, row, tbodyElement) {
    var self = this;
    var tbody = tbodyElement;
    if (!tbody) tbody = $('table[name=' +json.field + '] tbody');
    var tr = $('<tr rownr="'+row.rowNr+'"></tr>');
    _(json.columns).forEach(function (jcol) {
        var td = $('<td></td>')
        var component = self.createMatrixComponent(jcol, 'oodetail', row.fields(jcol.field))
        td.append(component)
        tr.append(td)
    })
    tbody.append(tr);
    return tr;
}

WindowContainer.bindToRecord = function bindToRecord(record) {
    var self = this;
    var description = self.window.getDescription()
    _(description.form).forEach(function (json) {
        if (!('columns' in json)) {
            var field = record.fields(json.field);
            self.setEditorValue(field)
            self.setEditorReadOnly(field, !record.fieldIsEditable(json.field))
        } else {
            var tbody = $('table[name=' +json.field + '] tbody');
            tbody.html('');
            _(record[json.field]).forEach(function (row) {
                self.addMatrixRow(json, row, tbody)

            })
        }
    })
    Materialize.updateTextFields();
}

module.exports = WindowContainer