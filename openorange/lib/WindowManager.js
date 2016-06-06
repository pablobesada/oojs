"use strict"
var _ = require("underscore");

var WindowContainer = Object.create(null)
WindowContainer.windows = []
WindowContainer.element_ids = 1;
WindowContainer.datePickerOptions = {
    closeOnSelect: true,
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year
    formatSubmit: "yyyy-mm-dd",
    format: "dd-mm-yyyy",
    onSet: function (arg) {
        if ('select' in arg) { //prevent closing on selecting month/year
            this.close();
        }
    }
};
WindowContainer.init = function (wnd) {
    this.window = wnd;
    this.windowjson = JSON.parse(JSON.stringify(this.window.getDescription().form))  //deep clone of the object because I need to add some metadata to it
    this.window.__container_data__ = {}
    this.last_tab_id = 0;
    this.last_tab_id = 0;
    this.matrix_idx = 0;
    this.matrix_json_map = {}
    this.virtual_rows = {}
    this.save = this.save.bind(this)
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
    /*
    var html = '';
    html += '<div id="modal4" class="modal modal-fixed-footer green white-text">';
    html += '  <div class="modal-content">'
    html += '    <p>Lorem ipsum dolor sit amet, consectetur adipiscing el</p>';
    html += '  </div>';
    html += '  <div class="modal-footer green lighten-4">'
    html += '    <a href="#" class="waves-effect waves-red btn-flat modal-action modal-close">Disagree</a>'
    html += '    <a href="#" class="waves-effect waves-green btn-flat modal-action modal-close">Agree</a>'
    html += '  </div>'
    html += '</div>'
    var pastewindow = $(html)
    w.append(pastewindow);
    */
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
    //$('.modal-trigger').leanModal();
    windowElement.find('.datepicker').pickadate(WindowContainer.datePickerOptions);
    //$('input.editor[timeeditor=true]').mask('00:00:00');
    if (this.window.getRecord() != null) this.bindRecordToWindow(this.window.getRecord());
    this.window.addListener(this);
}

WindowContainer.createToolBar = function createToolBar() {
    var self = this;
    var html = '<div class="row">';
    html += '<a class="btn waves-effect waves-light"><i class="mdi">done</i></a>'
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
    var rclass = this.window.getRecordClass()
    var field = rclass.__description__.fields[json.field]
    if (!field) throw new Error("Field " + json.field + " not found in record")
    if ('editor' in json) {
        editor = json.editor;
    } else {
        switch (field.type) {
            case 'string':
                editor = 'string';
                break;
            case 'integer':
                editor = 'integer';
                break;
            case 'boolean':
                editor = 'checkbox';
                break;
            case 'date':
                editor = 'date';
                break;
            case 'time':
                editor = 'time';
                break;
            case 'detail':
                editor = 'matrix';
                grid_cols = 12;
                headerInput = false;
                break;
        }
    }
    var component = $('<div class="input-field col s' + grid_cols + '"></div>');
    if (field.linkto) {
        var pastewindow_icon = $('<i class="mdi-action-account-circle prefix"></i>')
        var params = {self: self, field: field, json: json};
        pastewindow_icon.click(self.openPasteWindow.bind(params))
        component.append(pastewindow_icon);
        //component.append('<a class="modal-trigger waves-effect waves-light btn" href="#modal4">Modal</a>');
    }
    var editorElement = self[editor](json, "oomaster")
    var editors = editorElement;
    component.append(editorElement);
    if (headerInput) {
        switch (editor) {
            case 'checkbox':
                editors = editorElement.find("input");
                editors.click(self.beforeEdit.bind(self));  //en el checkbox, el beforeEdit llama al afterEdit (esto es porque no siempre recibe eventos de focus -a veces se llama una sola vez y luego nunca mas-
                break;
            case 'radiobutton':
                editors = editorElement.find("input");
                editors.click(self.beforeEdit.bind(self));
                editors.change(self.afterEdit.bind(self));
                break;
            case 'combobox':
                component.append('<label>' + (json.label ? json.label : json.field) + '</label>');
                editors.change(self.beforeEdit.bind(self)); //en el combobox, el beforeEdit llama al afterEdit (esto es porque no recibe eventos ni de click ni de focus
                break;
            case 'date':
                component.append('<label>' + (json.label ? json.label : json.field) + '</label>');
                //editors.focus(self.beforeEdit.bind(self));
                editors.change(self.beforeEdit.bind(self));
                break;
            default:
                component.append('<label>' + (json.label ? json.label : json.field) + '</label>');
                editors.focus(self.beforeEdit.bind(self));
                editors.change(self.afterEdit.bind(self));
                break;
        }
    }
    json.__element__ = editors;
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
                break
            case 'date':
                editor = 'date'
                break;
            case 'boolean':
                editor = 'checkbox';
                break;
        }
    }
    var editorElement = self[editor](json, cls, rowfield)
    var editors = editorElement;
    var bind_params = {self: self, json: json, detailname: detailname, rowfield: rowfield};
    switch (editor) {
        case 'checkbox':
            editors = editorElement.find("input");
            editors.click(self.beforeEditRow.bind(bind_params));
            break;
        case 'combobox':
            editors.change(self.beforeEditRow.bind(bind_params));
            break;
        case 'date':
            editors.change(self.beforeEditRow.bind(bind_params));
            break;
        default:
            editors.focus(self.beforeEditRow.bind(bind_params));
            editors.change(self.afterEditRow.bind(bind_params));
            break;
    }
    json.__element__ = editors;
    return editorElement;
}


WindowContainer.save = function save() {
    this.window.save()
}

WindowContainer.string = function string(json, cls, field) {
    var self = this;
    var value = field != null ? field.getValue() : '';
    if (field != null && field.type == 'date' && value != null) value = value.format("YYYY-MM-DD")
    if (value == null) value = '';
    var html = '<input value="' + value + '" type="text" name="' + json.field + '" class="editor ' + cls + ' validate">';
    var res = $(html);
    return res;
}

WindowContainer.time = function time(json, cls, field) {
    var res = this.string(json, cls, field)
    res.attr('timeeditor', true);
    //res.attr('data-mask', '00:00:00')
    res.mask('09:00:00')
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

WindowContainer.date = function date(json, cls, field) {
    var self = this;
    var value = field != null ? field.getSQLValue() : '';
    if (value == null) value = '';
    var html = '<input data-value="' + value + '" type="date" name="' + json.field + '" class="editor datepicker ' + cls + ' validate" datepicker="true">';
    var res = $(html);
    return res;
}

WindowContainer.checkbox = function checkbox(json, cls, field) {
    var self = this;
    var value = field != null ? field.getValue() : '';
    if (value == null) value = '';
    var checked = value == ''? '': 'checked ="checked"'
    var element_id = "CHECKBOX_" + WindowContainer.element_ids++;
    var html = '<p><input '+checked+' type="checkbox" name="' + json.field + '" class="editor ' + cls + ' validate" id="'+element_id+'">'
    var label ='';
    if (field == null) { //esto significa que me llamaron desde el header y no desde un matrix
        label = (json.label ? json.label : json.field)
    }
    html += '<label for="'+element_id+'">' + label + '</label></p>';
    var res = $(html);
    return res;
}

WindowContainer.combobox = function combobox(json, cls, field) {
    var self = this;
    var value = field != null ? field.getValue() : '';
    if (value == null) value = '';
    var html = '<select value="' + value + '" type="text" name="' + json.field + '" class="editor ' + cls + ' validate">';
    var selected = (value == '' || value == null)? 'SELECTED' : '';
    html += '<option value="" '+selected+'></option>'
    for (var i=0;i<json.options.length;i++) {
        var option = json.options[i];
        var selected = (value == (''+option.value))? 'SELECTED' : '';  // (''+option.value) es porque sino '' == 0 -> TRUE
        html += '<option value="'+option.value+'" '+selected+'>'+option.label+'</option>'
    }
    html += '</select>'
    var res = $(html);
    return res;
}

WindowContainer.radiobutton = function radiobutton(json, cls, field) {
    var self = this;
    var value = field != null ? field.getValue() : '';
    if (value == null) value = '';
    var html = '';
    for (var i=0;i<json.options.length;i++) {
        var option = json.options[i];
        var element_id = "RADIO_" + WindowContainer.element_ids++;
        html += '<p><input value="' + option.value + '" type="radio" name="' + json.field + '" class="editor ' + cls + ' validate" id="'+element_id+'">';
        html += '<label for="'+element_id+'">' +option.label+ '</label></p>';
    }
    var res = $(html)//.find("input");
    return res;
}

WindowContainer.beforeEdit = function beforeEdit(event) {
    var self = this;
    if (self.window.getRecord() == null) return;
    var target = $(event.currentTarget);
    if ('__block_event__' in event.currentTarget && event.currentTarget.__block_event__) return;
    var readonly = !Boolean(self.window.beforeEdit(event.currentTarget.name))
    if (event.currentTarget.nodeName == 'INPUT' && $(event.currentTarget).attr('type') == 'radio') {
        if (readonly) {
            target.parent().parent().find("input[value=" + self.window.getRecord()[event.currentTarget.name] + "]")[0].checked = true;
        }
    } else if (event.currentTarget.nodeName == 'INPUT' && $(event.currentTarget).attr('type') == 'checkbox') {
        if (readonly) {
            target[0].checked = Boolean(self.window.getRecord()[event.currentTarget.name]);
        } else {
            self.afterEdit(event);
        }
    }
    else if (event.currentTarget.nodeName == 'SELECT') {
        if (readonly) {
            target.val(self.window.getRecord()[event.currentTarget.name]);
            target.material_select();
        } else {
            self.afterEdit(event)
        }
    } else if (event.currentTarget.nodeName == 'INPUT' && target.attr('datepicker') == 'true') {
        if (readonly) {
            target.pickadate('picker').close();
            var d = null;
            var value = self.window.getRecord()[event.currentTarget.name];
            if (value != null && value != '') {
                d = moment(value, "YYYY-MM-DD").toDate()
            }
            event.currentTarget.__block_event__ = true;
            target.pickadate('picker').set('select', d)
            event.currentTarget.__block_event__ = false;
        } else {
            self.afterEdit(event)
        }
    } else {
        target.attr("readonly", readonly);
    }
}

WindowContainer.beforeEditRow = function beforeEditRow(event) {
    console.log("en before edit row")
    if ('__block_event__' in event.currentTarget && event.currentTarget.__block_event__) return;
    var params = this;
    var self = params.self;
    var target = $(event.currentTarget);
    target.css('border-bottom', 'none');
    target.css('box-shadow', 'none');
    var readonly = null;
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
            self.virtual_rows[params.detailname] = self.window.getRecord()[params.detailname].newRow();
            var json = _(self.matrix_json_map[params.detailname]).find(function (json) {
                return json.__element__.find("tbody").attr("matrix_idx") == tbody.attr("matrix_idx")
            })
            self.insertMatrixRow(self.window.getRecord(), json, self.virtual_rows[params.detailname], tbody)
        } else {
            readonly = true;
        }
    }
    if (readonly == null) readonly = !Boolean(self.window.beforeEditRow(this.detailname, this.rowfield.name, rownr))
    if (event.currentTarget.nodeName == 'INPUT' && $(event.currentTarget).attr('type') == 'checkbox') {
        if (readonly) {
            target[0].checked = Boolean(self.window.getRecord()[this.detailname][rownr][this.rowfield.name]);
        } else {
            self.afterEditRow.call(params, event);
        }
    } else if (event.currentTarget.nodeName == 'SELECT') {
        if (readonly) {
            target.val(self.window.getRecord()[this.detailname][rownr][this.rowfield.name]);
            target.material_select();
        } else {
            self.afterEditRow.call(params, event);
        }
    } if (event.currentTarget.nodeName == 'INPUT' && target.attr('datepicker') == 'true') {
        if (readonly) {
            target.pickadate('picker').close();
            var d = null;
            var value = self.window.getRecord()[this.detailname][rownr][this.rowfield.name];
            if (value != null && value != '') {
                d = moment(value, "YYYY-MM-DD").toDate()
            }
            event.currentTarget.__block_event__ = true;
            target.pickadate('picker').set('select', d)
            event.currentTarget.__block_event__ = false;
        } else {
            self.afterEditRow.call(params,event)
        }
    } else {
        target.attr("readonly", readonly);
    }
}

WindowContainer.afterEdit = function afterEdit(event) {
    var self = this;
    console.log("afteredit")
    var value = event.currentTarget.value;
    if (event.currentTarget.nodeName == 'INPUT' && $(event.currentTarget).attr('type') == 'checkbox') {
        var ftype = self.window.getRecord().fields(event.currentTarget.name).type;
        if (ftype == 'boolean') {
            value = event.currentTarget.checked;
        } else {
            value = event.currentTarget.checked ? 1 : 0;
        }
    } else if (event.currentTarget. nodeName == 'INPUT' && $(event.currentTarget).attr('datepicker') == 'true') {
        value = $(event.currentTarget).pickadate('picker').get('select', 'yyyy-mm-dd');
    }
    //console.log("afteredit", self, value)
    self.window.afterEdit(event.currentTarget.name, value)
}

WindowContainer.afterEditRow = function afterEditRow(event) {
    console.log("en after edit row")
    var params = this;
    var self = params.self;
    var target = $(event.currentTarget)
    target.css('border-bottom', 'none');
    target.css('box-shadow', 'none');
    var rownr = target.closest("tr").attr("rownr");
    var value = target.val();
    if (event.currentTarget.nodeName == 'INPUT' && target.attr('type') == 'checkbox') {
        var ftype = self.window.getRecord().details(params.detailname).getRowClass().__description__.fields[params.rowfield.name].type;
        if (ftype == 'boolean') {
            value = event.currentTarget.checked;
        } else {
            value = event.currentTarget.checked ? 1 : 0;
        }
    } else if (event.currentTarget. nodeName == 'INPUT' && target.attr('datepicker') == 'true') {
        value = target.pickadate('picker').get('select', 'yyyy-mm-dd');
    }
    self.window.afterEditRow(params.detailname, params.rowfield.name, rownr, value);
}


WindowContainer.update = function update(event) {
    var self = this;
    console.log(event)
    switch (event.type) {
        case "record":
            if (event.action == 'replaced') self.bindRecordToWindow(event.data);
            break;
        case "field":
            //console.log(event)
            if (event.action == 'modified') {
                var field = event.data.field
                if (field.type != "detail") {
                    self.setEditorValue(field);
                    Materialize.updateTextFields();
                } else {
                    //console.log("row: " + event.data.rowfield.name)
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
                        console.log("insert in " + tbody.attr("matrix_idx"), event.data.row.rowNr, tbody.children("tr").length)
                        self.insertMatrixRow(event.data.record, matrixjson, event.data.row, tbody);
                        //console.log("insert in " + tbody.attr("matrix_idx"), event.data.row.rowNr, tbody.children("tr").length)
                    })

                }
            } else if (event.action == 'detail cleared') {
                var detail = event.data.detail;
                if (detail.name in this.matrix_json_map) {
                    _(this.matrix_json_map[detail.name]).forEach(function (matrixjson) {
                        var tbody = matrixjson.__element__.find("tbody");
                        tbody.find("tr").not('[rowNr=null]').remove();
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
    var elements = this.__element__.find('.editor.oomaster[name=' + field.name + ']')
    for (var i=0;i<elements.length;i++) {
        var element =elements[i];
        var e = $(element);
        if (element.nodeName == 'SELECT') {
            e.val(value)
            e.material_select();
        } else if (element.nodeName == 'INPUT' && e.attr('type') == 'radio') {
            element.checked = (value == e.val());
        } else if (element.nodeName == 'INPUT' && e.attr('type') == 'checkbox') {
            element.checked = (value != null && value != '' && value != 0 && value != false);
        } else if (element.nodeName == 'INPUT' && e.attr('datepicker') == 'true') {
            var d = null;
            if (value != null && value != '') {
                d = moment(value, "YYYY-MM-DD").toDate()
            }
            element.__block_event__ = true;
            e.pickadate('picker').set('select', d)
            element.__block_event__ = false;
        } else {
            if (field.type == 'date' && value != null) {
                e.val(value.format("YYYY-MM-DD"))
            } else {
                e.val(value)
            }
        }
    }
}

WindowContainer.setRowEditorValue = function setRowEditorValue(detail, rowNr, rowfield) {
    var value = rowfield.getValue();
    var elements = this.__element__.find('table[name='+detail.name+'] tr[rownr='+rowNr+'] .editor.oodetail[name=' + rowfield.name + ']');
    for (var i=0;i<elements.length;i++) {
        var element =elements[i];
        var e = $(element);
        if (elements[i].nodeName == 'SELECT') {
            e.val(value)
            $(elements[i]).material_select();
        } else if (element.nodeName == 'INPUT' && e.attr('type') == 'checkbox') {
            element.checked = (value != null && value != '' && value != 0 && value != false);
        } else if (element.nodeName == 'INPUT' && e.attr('datepicker') == 'true') {
            var d = null;
            if (value != null && value != '') {
                //d = moment(value, "YYYY-MM-DD").toDate()
                d = value.toDate()
            }
            //console.log(rowfield)
            //console.log("a", d,value.constructor)
            element.__block_event__ = true;
            e.pickadate('picker').set('select', d)
            element.__block_event__ = false;
        } else {
            if (rowfield.type == 'date' && value != null) {
                e.val(value.format("YYYY-MM-DD"))
            } else {
                e.val(value)
            }
        }

    }
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
    if (row.__window_container_avoid_insert__ == tbodyElement.attr("matrix_idx")) {
        //self.insertMatrixRow(record, json, self.virtual_rows[json.field], tbody)
        console.log("exiting")
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
    console.log(row.rowNr, rows_count, hasVirtualRow)
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
    tr.find("select").material_select();
    console.log("A", tbody.children("tr").length)
    tr.find("input[datepicker=true]").pickadate(WindowContainer.datePickerOptions);
    console.log("B", tbody.children("tr").length)
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
    self.__element__.find("select").material_select()
}


WindowContainer.openPasteWindow = function openPasteWindow(event) {
    var params = this;
    var self = params.self
    var html = '';
    html += '<div id="modal4" class="modal modal-fixed-footer green white-text" style="z-index: 1003; display: none; opacity: 0; transform: scaleX(0.7); top: 317.636px;">';
    html += '  <div class="modal-content">'
    html += '    <p>Lorem ipsum dolor sit amet, consectetur adipiscing el</p>';
    html += '  </div>';
    html += '  <div class="modal-footer green lighten-4">'
    html += '    <a href="#" class="waves-effect waves-red btn-flat modal-action modal-close">Disagree</a>'
    html += '    <a href="#" class="waves-effect waves-green btn-flat modal-action modal-close">Agree</a>'
    html += '  </div>'
    html += '</div>'
    var pastewindow = $(html)
    $(self.__element__).append(pastewindow);
    $('#modal4').openModal();
    console.log(params);
}

window.WindowManager = WindowContainer; //para hacer global la variable WindowManager

//module.exports = WindowContainer