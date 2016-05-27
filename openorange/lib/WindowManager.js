"use strict"
var _ = require("underscore");

var WindowContainer = Object.create(null)
WindowContainer.windows = []
WindowContainer.init = function (wnd) {
    this.window = wnd;
    this.windowjson = JSON.parse(JSON.stringify(this.window.getDescription().form))  //deep clone of the object because I need to add some metadata to it
    this.window.__container_data__ = {}
    this.last_tab_id = 0;
    this.matrix_idx = 0;
    this.matrix_json_map = {}
    this.virtual_rows = {}
    this.save = this.save.bind(this)
    //this.afterEdit = this.afterEdit.bind(this)
    //this.beforeEdit = this.beforeEdit.bind(this)
    return this;
}

WindowContainer.render = function render() {
    var self = this;
    //console.log(containerElement)
    var html = '<div class="container"></div>';
    var w = $(html)
    w.append(self.createToolBar())
    this.tab_id = "tab_" + WindowContainer.windows.length + 1;
    WindowContainer.windows.push({window: this.window, element: w, id: this.tab_id})
    w.append(self.createComponent(this.windowjson))
    //console.log(this.windowjson)
    this.__element__ = w;
    this.displayWindow(w)

}

WindowContainer.displayWindow = function displayWindow(windowElement) {
    var tab = $('<li class="tab col s3"><a href="#' + this.tab_id + '">' + this.window.getTitle() + '</a></li>');
    $('ul.tabs.workspace').append(tab)
    windowElement.attr('id', this.tab_id);
    $('#workspace').append(windowElement);
    $('ul.tabs').tabs();
    if (this.window.getRecord() != null) this.bindRecordToWindow(this.window.getRecord());
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
    $("a[href='#" + this.tab_id + "']").html(title)
}

WindowContainer.createComponent = function createComponent(json) {
    var self = this;
    if ('columns' in json) return self.createEmptyMatrix(json)
    if ('field' in json) return self.createFieldComponent(json)
    if ('type' in json && json.type == 'tabs') return self.createTabsComponent(json)
    if ('content' in json) return self.createComponent(json.content)
    if (json instanceof Array) {
        var container = $('<div class="container"></div>')
        _(json).forEach(function (jcomponent) {
            container.append(self.createComponent(jcomponent))
        })
        json.__element__ = container;
        return container;
    }
}


WindowContainer.createTabsComponent = function createTabsComponent(json) {
    var self = this;
    var component = $('<div class="row"></div>');
    var tabsHeaderContainer = $('<div class="col s12"></div>')
    var tabsHeader = $('<ul class="tabs"></ul>')
    tabsHeaderContainer.append(tabsHeader);
    component.append(tabsHeaderContainer);
    _(json.pages).forEach(function (jpage) {
        var label = jpage.label;
        self.last_tab_id += 1;
        var tab_id = self.tab_id + "_" + self.last_tab_id;
        var headerButton = $('<li class="tab col s3"><a href="#' + tab_id + '">' + label + '</a></li>');
        tabsHeader.append(headerButton);
        var page = self.createComponent(jpage, {id: tab_id});
        page.attr('id', tab_id)
        component.append(page);
    })
    json.__element__ = component;
    return component;
}


WindowContainer.createFieldComponent = function createFieldComponent(json) {
    var self = this;
    var editor;
    var grid_cols = 4;
    var headerInput = true;
    if ('editor' in json) {
        editor = json.editor;
    } else {
        var rclass = this.window.getRecordClass()
        var field = rclass.__description__.fields[json.field]
        if (!field) throw new Error("Field " + json.field + " not found in record")
        switch (field.type) {
            case 'string':
                editor = 'string';
                break;
            case 'integer':
                editor = 'integer';
                break;
            case 'detail':
                editor = 'matrix';
                grid_cols = 12;
                headerInput = false;
                break;
        }
    }
    var component = $('<div class="input-field col s' + grid_cols + '"></div>');
    var editorElement = self[editor](json, "oomaster")
    component.append(editorElement);
    if (headerInput) {
        component.append('<label for="' + json.field + '">' + (json.label ? json.label : json.field) + '</label>');
        editorElement.focus(self.beforeEdit.bind(self));
        editorElement.change(self.afterEdit.bind(self));
    }
    json.__element__ = editorElement;
    return component;
}

WindowContainer.createMatrixComponent = function createMatrixComponent(json, cls, detailname, rownr, rowfield) {
    var self = this;
    var editor;
    if ('editor' in json) {
        editor = json.editor;
    } else {
        switch (rowfield.type) {
            case 'string':
                editor = 'string';
                break;
            case 'integer':
                editor = 'integer';
                break;
        }
    }
    var editorElement = self[editor](json, cls, rowfield)
    var bind_params = {self: self, json: json, detailname: detailname, rowfield: rowfield};
    editorElement.focus(self.beforeEditRow.bind(bind_params));
    editorElement.change(self.afterEditRow.bind(bind_params));
    json.__element__ = editorElement;
    return editorElement;
}


WindowContainer.save = function save() {
    this.window.save()
}

WindowContainer.string = function string(json, cls, field) {
    var self = this;
    var value = field != null ? field.getValue() : '';
    if (value == null) value = '';
    var html = '<input value="' + value + '" type="text" name="' + json.field + '" class="editor ' + cls + ' validate">';
    var res = $(html);
    return res;
}

WindowContainer.integer = function integer(json, cls, field) {
    var self = this;
    var value = field != null ? field.getValue() : '';
    if (value == null) value = '';
    var html = '<input value="' + value + '" type="number" name="' + json.field + '" class="editor ' + cls + ' validate">'
    var res = $(html);
    return res;
}

WindowContainer.beforeEdit = function beforeEdit(event) {
    var self = this;
    var readonly = !Boolean(self.window.beforeEdit(event.currentTarget.name))
    $(event.currentTarget).attr("readonly", readonly);
}

WindowContainer.beforeEditRow = function beforeEditRow(event) {
    var params = this;
    var self = params.self;
    var target = $(event.currentTarget);
    target.css('border-bottom', 'none');
    target.css('box-shadow', 'none');
    var rownr = target.closest("tr").attr("rownr");
    if (rownr == 'null') { //virtual_row
        //si la fila anterior esta toda vacia, entonces no agrego otra nueva fila
        var tr = target.closest("tr");
        var tr_index = tr.index();
        if (tr_index == 0 || !self.window.getRecord()[params.detailname][tr_index - 1].isEmpty()) {
            var newrow = self.window.getRecord()[params.detailname].newRow()

            var addedRow = self.virtual_rows[params.detailname];
            var tbody = target.closest("tbody")
            addedRow.__window_container_avoid_insert__ = tbody.attr('matrix_idx');
            //self.virtual_rows[params.detailname] = self.window.getRecord()[params.detailname].newRow();
            self.window.getRecord()[params.detailname].push(self.virtual_rows[params.detailname]);
            delete addedRow.__window_container_avoid_insert__;
            tr.attr('rownr', addedRow.rowNr); //esto va antes del push para que durante el push toda este tr del table se complete con los valores que pudiera tener o que se seteen en el defaults del row (todo eso se corre adentro del push)
            _(addedRow.fieldNames()).forEach(function (fn) {
                var value = addedRow[fn]
                if (value != null) {
                    self.update({
                        type: 'field', action: 'modified', data: {
                            record: self.window.getRecord(),
                            field: self.window.getRecord().details(params.detailname),
                            row: addedRow,
                            rowfield: addedRow.fields(fn),
                            oldvalue: value
                        }
                    });
                }
            })
            /*hasta aca llegue antes de irme de viaje.
             Si me paro en cualquier campo de la ultima fila, el virtual row se convierte con row del record.
             Ahora falta agregar un nuevo virtual row al table para poder seguir agregando filas
             */
            self.virtual_rows[params.detailname] = self.window.getRecord()[params.detailname].newRow();
            //console.log($(self.matrix_json_map[params.detailname][0].__element__))
            console.log(self.matrix_json_map)
            var json = _(self.matrix_json_map[params.detailname]).find(function (json) {
                return json.__element__.find("tbody").attr("matrix_idx") == tbody.attr("matrix_idx")
            })
            self.insertMatrixRow(self.window.getRecord(), json, self.virtual_rows[params.detailname], tbody)
            /*
             rownr = self.window.getRecord()[params.detailname].length-1;
             var tr = target.closest("tr");
             var colidx = tr.children().index(target.closest("td"))
             console.log(tr.closest("tbody").children().last().prev().children()[colidx]);
             console.log(tr.closest("tbody").children().length, colidx)
             $(tr.closest("tbody").children().last().prev().children()[colidx]).focus();
             //params.json.__element__.closest("tr").prev().find("")
             */
        } else {
            target.attr("readonly", true);
            return;
        }
    }
    var readonly = !Boolean(self.window.beforeEditRow(this.detailname, this.rowfield.name, rownr))
    target.attr("readonly", readonly);
}

WindowContainer.afterEdit = function afterEdit(event) {
    var self = this;
    self.window.afterEdit(event.currentTarget.name, event.currentTarget.value)
}

WindowContainer.afterEditRow = function afterEditRow(event) {
    var self = this.self;
    var target = $(event.currentTarget)
    target.css('border-bottom', 'none');
    target.css('box-shadow', 'none');
    var rownr = target.closest("tr").attr("rownr");
    var value = target.val();
    self.window.afterEditRow(this.detailname, this.rowfield.name, rownr, value);
}


WindowContainer.update = function update(event) {
    var self = this;
    switch (event.type) {
        case "record":
            if (event.action == 'replaced') self.bindRecordToWindow(event.data);
            break;
        case "field":
            console.log(event)
            if (event.action == 'modified') {
                var field = event.data.field
                if (field.type != "detail") {
                    self.setEditorValue(field);
                    Materialize.updateTextFields();
                } else {
                    console.log("row: " + event.data.rowfield.name)
                    var rowNr = event.data.row.rowNr;
                    if (event.data.rowfield.name == 'rowNr') rowNr = event.data.oldvalue; //si lo que cambio fue el rowNr del row entonces uso el valor anterior a la modificacion para identificar el la fila a modificar
                    self.setRowEditorValue(event.data.field, rowNr, event.data.rowfield);
                    Materialize.updateTextFields();
                }
            } else if (event.action == 'row inserted') {
                var detail = event.data.detail;
                if (detail.name in this.matrix_json_map) {
                    _(this.matrix_json_map[detail.name]).forEach(function (matrixjson) {
                        var tbody = matrixjson.__element__.find("tbody");
                        self.insertMatrixRow(event.data.record, matrixjson, event.data.row, tbody);
                    })

                }
            }
            break;
        case "title":
            if (event.action == "modified") {
                self.setWindowTitle(event.data)
            }
            break;
    }
}

WindowContainer.setEditorValue = function setEditorValue(field) {
    var value = field.getValue();
    this.__element__.find('.editor.oomaster[name=' + field.name + ']').val(value)
}

WindowContainer.setRowEditorValue = function setRowEditorValue(detail, rowNr, rowfield) {
    var value = rowfield.getValue();
    var e = this.__element__.find('table[name='+detail.name+'] tr[rownr='+rowNr+'] .editor.oodetail[name=' + rowfield.name + ']');
    console.log(e, e.val())
    e.val(value)
}

WindowContainer.setEditorReadOnly = function setEditorReadOnly(field, readonly) {
    this.__element__.find('.editor.oomaster[name=' + field.name + ']').attr('readonly', readonly)
}

WindowContainer.createEmptyMatrix = function createEmptyMatrix(json) {
    var self = this;
    var table = $('<table name="' + json.field + '" class="bordered oodetail striped"></table>')
    var thead = $("<thead></thead>")
    var colHeaderRow = $("<tr></tr>")
    thead.append(colHeaderRow);
    _(json.columns).forEach(function (col) {
        var label = col.label ? col.label : col.field;
        var colHeader = $("<th>" + col.field + "</ht>")
        colHeaderRow.append(colHeader)
    })
    table.append(thead)
    var tbody = $('<tbody></tbody>');
    self.matrix_idx += 1;
    tbody.attr('matrix_idx', self.matrix_idx)
    table.append(tbody)
    json.__element__ = table;
    if (!(json.field in this.matrix_json_map)) this.matrix_json_map[json.field] = [];
    this.matrix_json_map[json.field].push(json)
    return table;
}

WindowContainer.insertMatrixRow = function insertMatrixRow(record, json, row, tbodyElement, position) {
    console.log(tbodyElement.attr("matrix_idx"))
    if (row.__window_container_avoid_insert__ == tbodyElement.attr("matrix_idx")) {
        //self.insertMatrixRow(record, json, self.virtual_rows[json.field], tbody)
        return;
    }
    var self = this;
    var tbody = tbodyElement;
    var tr = $('<tr rownr="' + row.rowNr + '"></tr>');

    _(json.columns).forEach(function (jcol) {
        var td = $('<td></td>')
        var component = self.createMatrixComponent(jcol, 'oodetail', json.field, row.rowNr, row.fields(jcol.field))
        var readonly = !record.fieldIsEditable(json.field, jcol.field, row.rowNr)
        if (readonly) component.attr('readonly', readonly);
        component.css('border-bottom', 'none');
        component.css('box-shadow', 'none');
        td.append(component)
        tr.append(td)
    })

    var trs = tbody.children("tr");
    var hasVirtualRow = (trs.length > 0 && trs.last().attr('rownr') == 'null');
    var rows_count = trs.length;
    if (hasVirtualRow) rows_count -= 1;
    if (row.rowNr >= rows_count || row.rowNr == null) { //row.rowNr == null -> virtual_row
        if (hasVirtualRow) {
            trs.last().before(tr);
        } else {
            tbody.append(tr);
        }
    } else {
        var next_tr = null;
        for (var i = rows_count - 1; i >= row.rowNr; i--) {
            next_tr = tbody.children('tr[rownr=' + i + ']');
            next_tr.attr('rownr', i + 1)
        }
        next_tr.before(tr)
    }
    return tr;
}

WindowContainer.bindRecordToComponent = function bindRecordToComponent(record, jcomponent) {
    var self = this;
    if (jcomponent instanceof Array) {
        _(jcomponent).forEach(function (json) {
            if ('columns' in json) {
                var tbody = json.__element__.find("tbody");
                tbody.html('');
                _(record[json.field]).forEach(function (row) {
                    self.insertMatrixRow(record, json, row, tbody)
                })
                self.insertMatrixRow(record, json, self.virtual_rows[json.field], tbody)
            } else if ('field' in json) {
                var field = record.fields(json.field);
                self.setEditorValue(field)
                self.setEditorReadOnly(field, !record.fieldIsEditable(json.field))
            } else {
                var jcontent = null;
                if (json.pages instanceof Array) jcontent = json.pages;
                else if (json.content instanceof Array) jcontent = json.content;
                self.bindRecordToComponent(record, jcontent);
            }
        })
    }
}

WindowContainer.bindRecordToWindow = function bindRecordToWindow(record) {
    var self = this;
    _(record.detailNames()).forEach(function (dn) {
        var vt = record[dn].newRow();
        //vt.rowNr =
        self.virtual_rows[dn] = vt;
    })
    self.bindRecordToComponent(record, self.windowjson)
    self.setWindowTitle(this.window.getTitle())
    Materialize.updateTextFields();
}

window.WindowManager = WindowContainer; //para hacer global la variable WindowManager

//module.exports = WindowContainer