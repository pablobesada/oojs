"use strict";

(function ($) {
    var _ = require("underscore");
    let oo = require("openorange");
    var cm = oo.classmanager

    class WindowContainer extends oo.ui.BaseContainer {

        static getWindowReportView(window, viewname) {
            for (let i = 0; i < oo.ui.containers.length; i++) {
                if (oo.ui.containers[i].entity === window) {
                    let res = oo.ui.containers[i].element.find(`[reportview=${viewname}]`);
                    if (res.length > 0) return $(res[0])
                    break;
                }
            }
            return null
        }

        constructor(wnd) {
            super(wnd)
            this.window = this.entity;
            this.windowjson = JSON.parse(JSON.stringify(this.window.__class__.getDescription().form));  //deep clone of the object because I need to add some metadata to it
            this.window.__container_data__ = {};
            this.last_tab_id = 0;
            this.matrix_idx = 0;
            this.matrix_json_map = {};
            this.virtual_rows = {};
            this.pastewindow_id = null;
            this.created_cards = []
            this.cardcontainers = {}
            this.templateElements = [];
        };

        close() {
            super.close()
            _(this.created_cards).each(card => {
                card.stop()
            })
            this.created_cards = []
        }

        render() {
            var self = this;
            //console.log(containerElement)
            oo.ui.containers.push({
                container: this,
                entity: this.window,
                element: this.__element__,
                tab_id: this.tab_id
            });
            this.__element__.append(self.createComponent(this.windowjson));
            this.__element__.append(self.createPasteWindow());
            //console.log(this.windowjson)
            this.displayWindow(this.__element__)
            self.renderActionBar();
            _.each(this.templateElements, (templateElement) => {
                templateElement.addedToPage();
            })
            this.templateElements = [];
        };

        displayWindow(windowElement) {
            let self = this;
            if (self.window.__ui_container_view_id__) {
                $('#' + self.window.__ui_container_view_id__).append(windowElement)
            } else {
                var tab = $('<li class="tab"><a href="#' + this.tab_id + '">' + this.window.getTitle() + '</a></li>');
                $('ul.tabs.workspace').append(tab);
                windowElement.attr('id', this.tab_id);
                $('#workspace').append(windowElement);
                $('ul.tabs.workspace').tabs();
            }
            //$(windowElement).find('ul.tabs').tabs();
            //windowElement.find('.datepicker').pickadate(WindowContainer.datePickerOptions);
            //$('input.editor[timeeditor=true]').mask('00:00:00');
            if (this.window.getRecord() != null) {
                this.bindRecordToWindow(this.window.getRecord());
            }
            //this.window.addListener(this);
            this.window.onAny(this.update.bind(this));
        }

        createComponent(json) {
            var self = this;
            if ('columns' in json) return self.createEmptyMatrix(json);
            if ('field' in json) return self.createFieldComponent(json);
            if ('type' in json && json.type == 'tabs') return self.createTabsComponent(json);
            if ('type' in json && json.type == 'column') return self.createColumnComponent(json);
            if ('type' in json && json.type == 'line') return self.createLineComponent(json);
            if ('type' in json && json.type == 'card') return self.createCardComponent(json);
            if ('type' in json && json.type == 'cardcontainer') return self.createCardContainerComponent(json);
            if ('type' in json && json.type == 'reportview') return self.createReportViewComponent(json);
            if ('content' in json) return self.createComponent(json.content);
            if (json instanceof Array) {
                var container = $('<div class="container"></div>');
                _(json).forEach(function (jcomponent) {
                    container.append(self.createComponent(jcomponent))
                });
                json.__element__ = container;
                return container;
            }
        };


        createCardComponent(json) {
            let self = this;
            //let component = $('<div class="col s12 m6"></div>')
            let component = $('<div class="col s12 m6"></div>')
            if (json.name) {
                this.createCard(json.name, null, component)
            }
            json.__element__ = component;
            return component;
        };


        async createCard(cardname, cardcontainername, htmlcontainer) {
            let self = this;
            let card = cm.getClass(cardname).new()
            self.created_cards.push(card)
            card.setDataProvider(await this.window.getProvidedData())
            let args = {
                cardname: cardname,
                content_id: oo.ui.genId("CARDCONTENT"),
                delete_action_id: oo.ui.genId("CARDDELETE")
            }
            let cardContainerElement = oo.ui.templates.get('window cardcontainer').createElement(args)
            let deleteButton = cardContainerElement.find('#' + args.delete_action_id)
            deleteButton.click(function (event) {
                if (cardcontainername) self.removeCardFromContainer(cardcontainername, cardname)
                card.stop();
                self.created_cards.splice(self.created_cards.indexOf(card), 1);
            })
            let content = cardContainerElement.find('#' + args.content_id)
            htmlcontainer.append(cardContainerElement)
            card.on('content updated', function (event) {
                content.html('')
                content.append(event.DOMComponent)
            });
            card.play()
        }

        createCardContainerComponent(json) {
            let self = this;
            let id = oo.ui.genId('card_container')
            let actions = [];
            let addAction = {icon: 'add', id: oo.ui.genId()}
            let editAction = {icon: 'edit', id: oo.ui.genId()}
            actions.push(addAction)
            actions.push(editAction)
            let args = {id: id, cardcontainername: json.name, actions: actions}
            let component = oo.ui.templates.get('window cardlistcontainer').createElement(args)
            let buttonbar = component.find('#' + args.actionbar_id)
            if (json.name) {
                self.cardcontainers[json.name] = []
                let addButton = component.find('#' + addAction.id);
                let editButton = component.find('#' + editAction.id);
                let params = {self: this, containerName: json.name}
                addButton.click(this.selectCards.bind(params))
                editButton.click(() => {
                    if (!editButton.hasClass('active')) {
                        component.find('.card-remove-btn').removeClass('hide')
                        editButton.addClass('active')
                    } else {
                        component.find('.card-remove-btn').addClass('hide')
                        editButton.removeClass('active')
                    }
                })
                let cardClasses = json.default;
                for (let i = 0; i < cardClasses.length; i++) {
                    this.cardcontainers[json.name].push(cardClasses[i])
                    self.createCard(cardClasses[i], json.name, component)
                }
            }
            json.__element__ = component;
            return component;
        };

        createReportViewComponent(json) {
            let self = this;
            let args = {name: json.name}
            let component = oo.ui.templates.get('window reportview').createElement(args)
            json.__element__ = component;
            return component;
        };

        createColumnComponent(json) {
            var self = this;

            let children = []
            _(json.content).forEach(function (child_component_json) {
                let child_component = self.createComponent(child_component_json);
                let child = {container_id: oo.ui.genId(), component: child_component}
                children.push(child);
            });
            let args = {components: children}
            var component = oo.ui.templates.get('window components column').createElement(args)
            _(children).each((child) => {
                component.find('#' + child.container_id).append(child.component)
            })
            json.__element__ = component;
            return component;
        };

        createLineComponent(json) {
            var self = this;
            var component = oo.ui.templates.get('window components line').createElement()
            _(json.content).forEach(function (child_component_json) {
                var child_component = self.createComponent(child_component_json);
                component.append(child_component);
            });
            json.__element__ = component;
            return component;
        };

        createTabsComponent(json) {
            var self = this;
            let tabs = []
            let pages = []
            _(json.pages).forEach(function (jpage) {
                let tab = {}
                tab.id = oo.ui.genId("TAB")
                tab.label = jpage.label;
                tabs.push(tab);
                let page = self.createComponent(jpage, {id: tab.id})
                page.attr('id', tab.id);
                pages.push({id: tab.id, page: page})
            })
            let args = {page_container_id: oo.ui.genId(), tabs: tabs}
            let res = oo.ui.templates.get("window tabs").createElement(args);
            let page_container = res.find("#" + args.page_container_id);
            _(pages).forEach(function (page) {
                page_container.append(page.page)
            })
            this.templateElements.push(res);
            json.__element__ = res;
            return res
        };


        createFieldComponent(json) {
            var self = this;
            var editor;
            var grid_cols = 4;
            var headerInput = true;
            var rclass = this.window.__class__.getRecordClass();
            var field = rclass.__description__.fields[json.field];
            if (!field) throw new Error("Field " + json.field + " not found in record");
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

            //var component = $('<div class="input-field col s' + grid_cols + '"></div>');
            var labelComponent = null;
            var ed = self[editor](json, "oomaster");
            let component = ed.component;
            let editorElement = ed.editor;
            var pasteWindowComponent = null;
            if (headerInput) {
                switch (editor) {
                    case 'checkbox':
                        editorElement.click(self.beforeEdit.bind(self));  //en el checkbox, el beforeEdit llama al afterEdit (esto es porque no siempre recibe eventos de focus -a veces se llama una sola vez y luego nunca mas-
                        break;
                    case 'radiobutton':
                        editorElement.click(self.beforeEdit.bind(self));
                        editorElement.change(self.afterEdit.bind(self));
                        break;
                    case 'combobox':
                        editorElement.change(self.beforeEdit.bind(self)); //en el combobox, el beforeEdit llama al afterEdit (esto es porque no recibe eventos ni de click ni de focus
                        break;
                    case 'date':
                        editorElement.change(self.beforeEdit.bind(self));
                        break;
                    default:
                        editorElement.focus(self.beforeEdit.bind(self));
                        editorElement.change(self.afterEdit.bind(self));
                        break;
                }
            }
            if (json.pastewindow && ed.pastewindowopener) {
                let pwopener = ed.pastewindowopener;
                var params = {
                    self: self,
                    field: field,
                    detailname: null,
                    rownr: null,
                    json: json,
                    editor: editorElement
                };
                pwopener.click(self.openPasteWindow.bind(params));
                editorElement.keypress((event) => {
                    //console.log(event.ctrlKey, event.keyCode, event.key)
                    //console.log(event)
                    if (event.ctrlKey && (event.key.toLowerCase() == 'enter')) {
                        self.openPasteWindow.bind(params)(event);
                    } else if (event.ctrlKey && (event.key.toLowerCase() == 'm')) {
                        self.openRelatedRecord.bind(params)(event);
                    }
                })
            }
            if (pasteWindowComponent) component.append(pasteWindowComponent);
            //component.append(editorElement);
            //if (labelComponent) component.append(labelComponent);
            json.__element__ = editorElement;
            //return editorElement;
            return component;
        };

        createMatrixComponent(json, cls, detailname, rownr, rowfield) {
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
                    case 'date':
                        editor = 'date';
                        break;
                    case 'boolean':
                        editor = 'checkbox';
                        break;
                }
            }
            var ed = self[editor](json, cls, rowfield);
            var component = ed.component;
            var editorElement = ed.editor;

            var bind_params = {self: self, json: json, detailname: detailname, rowfield: rowfield};
            switch (editor) {
                case 'checkbox':
                    editorElement.click(self.beforeEditRow.bind(bind_params));
                    break;
                case 'combobox':
                    editorElement.change(self.beforeEditRow.bind(bind_params));
                    break;
                case 'date':
                    editorElement.change(self.beforeEditRow.bind(bind_params));
                    break;
                default:
                    editorElement.focus(self.beforeEditRow.bind(bind_params));
                    editorElement.change(self.afterEditRow.bind(bind_params));
                    break;
            }
            if (json.pastewindow && ed.pastewindowopener) {
                //component = $('<div class="input-field" style="margin-left: 20px"></div>');
                //var pasteWindowComponent = $('<i class="mdi prefix" style="margin-left: -20px">search</i>');
                //component.append(pasteWindowComponent);
                var params = {
                    self: self,
                    detailname: detailname,
                    field: rowfield,
                    //rownr: rownr,
                    json: json,
                    editor: editorElement
                }
                ed.pastewindowopener.click(self.openPasteWindow.bind(params));
                editorElement.keypress((event) => {
                    if (event.ctrlKey && event.key.toLowerCase() == 'enter') {
                        self.openPasteWindow.bind(params)(event);
                    } else if (event.ctrlKey && (event.key.toLowerCase() == 'm')) {
                        self.openRelatedRecord.bind(params)(event);
                    }
                })

                //component.append(editors)
            }
            json.__element__ = editorElement;
            return component;
        };


        async save() {
            let res = await this.window.save()
            return res;
        };

        print() {
            this.window.print()
        };

        processEditor(json, cls, field, editor, aditional_template_args) {
            var self = this;
            var value = field != null ? field.getValue() : '';
            if (field != null && field.type == 'date' && value != null) value = value.format("YYYY-MM-DD");
            if (value == null) value = '';
            //var html = '<input value="' + value + '" type="text" name="' + json.field + '" class="editor ' + cls + ' validate">';
            let args = {
                id: oo.ui.genId(),
                value: value,
                field: json.field,
                cls: cls,
                label: json.label ? json.label : json.field,
                pastewindow: json.pastewindow
            }
            if (aditional_template_args) {
                _.extendOwn(args, aditional_template_args)
            }
            var template = oo.ui.templates.get('window ' + cls + ' components ' + editor)
            let res = template.createElement(args);
            let $editor = null;
            let editor_selector = template.meta.attr('editor-selector');
            if (editor_selector) {
                $editor = res.find(editor_selector)
                if ($editor.length == 0) $editor = $editor.addBack(editor_selector);
            } else {
                $editor = res;
            }
            let $pwopener = null;
            let pastewindow_opener_selector = template.meta.attr('pastewindow-opener-selector');
            if (pastewindow_opener_selector) {
                $pwopener = res.find(pastewindow_opener_selector)
                if ($pwopener.length == 0) $pwopener = $editor.addBack(pastewindow_opener_selector);
            }
            this.templateElements.push(res)
            return {component: res, editor: $editor, pastewindowopener: $pwopener};

        }

        string(json, cls, field) {
            return this.processEditor(json, cls, field, 'string')
        };

        memo(json, cls, field) {
            return this.processEditor(json, cls, field, 'memo')
        };

        time(json, cls, field) {
            return this.processEditor(json, cls, field, 'time')
            //return {component: res, editor: res.find(template.meta.attr('editor-selector'))};
        };

        integer(json, cls, field) {
            return this.processEditor(json, cls, field, 'integer')
        };

        date(json, cls, field) {
            let args = {datePickerOptions: WindowContainer.datePickerOptions}
            return this.processEditor(json, cls, field, 'date', args)
        };

        checkbox(json, cls, field) {
            var value = field != null ? field.getValue() : '';
            var checked = !!value;
            var options = {checked: checked}
            return this.processEditor(json, cls, field, 'checkbox', options)

        };

        combobox(json, cls, field) {
            let options = []
            var value = field != null ? field.getValue() : '';
            options.push({value: '', label: '', selected: (value == '' || value == null)})
            for (var i = 0; i < json.options.length; i++) {
                var option = json.options[i];
                let opt = {}
                opt.value = option.value;
                opt.label = option.label;
                opt.selected = (value == ('' + option.value)); //(''+option.value) es porque sino '' == 0 -> TRUE
                options.push(opt);
            }
            return this.processEditor(json, cls, field, 'combobox', {options: options})
        };

        radiobutton(json, cls, field) {
            let options = []
            for (var i = 0; i < json.options.length; i++) {
                var option = json.options[i];
                var element_id = oo.ui.genId("RADIO")
                let opt = {}
                opt.value = option.value;
                opt.cls = cls
                opt.field = json.field
                opt.id = element_id;
                opt.label = option.label;
                options.push(opt);
            }
            return this.processEditor(json, cls, field, 'radiobutton', {options: options, group_id: oo.ui.genId()})
            var self = this;
            var value = field != null ? field.getValue() : '';
            if (value == null) value = '';
            var html = '';
            for (var i = 0; i < json.options.length; i++) {
                var option = json.options[i];
                var element_id = oo.ui.genId("RADIO")
                html += '<p><input value="' + option.value + '" type="radio" name="' + json.field + '" class="editor ' + cls + ' validate" id="' + element_id + '">';
                html += '<label for="' + element_id + '">' + option.label + '</label></p>';
            }
            var res = $(html)//.find("input");
            return {component: res, editor: res.find('input')};
        };

        setReadOnly(element) {
            let newval = null;
            let self = this;
            let $e = $(element);
            switch (element.nodeName) {
                case 'INPUT':
                    switch ($e.attr('type')) {
                        case 'radio':
                            self.__element__.find(`input[group_id=${$e.attr('group_id')}][value!=${self.window.getRecord()[element.name]}]`).prop('checked', false);
                            self.__element__.find(`input[group_id=${$e.attr('group_id')}][value=${self.window.getRecord()[element.name]}]`).prop('checked', true);
                            break;
                        case 'checkbox':
                            newval = $e.val();
                            $e.prop('checked', Boolean(self.window.getRecord()[element.name]));
                            break;
                        default:
                            if ($e.attr('datepicker') == 'true') {
                                $e.pickadate('picker').close();
                                var d = null;
                                var value = self.window.getRecord()[element.name];
                                if (value != null && value != '') {
                                    d = moment(value, "YYYY-MM-DD").toDate()
                                }
                                element.__block_event__ = true;
                                newval = $e.pickadate('picker').get('select')
                                $e.pickadate('picker').set('select', d);
                                element.__block_event__ = false;
                            } else {
                                console.log("setting readony to", $e, true)
                                $e.attr('readonly', true)
                            }
                            break;
                    }
                    break;
                case 'SELECT':
                    newval = $e.val();
                    $e.val(self.window.getRecord()[element.name]);
                    $e.material_select();
                    break;

            }
            return newval; //se usa para select por ejemplo
        };

        async beforeEdit(event) {
            console.log("en beforeEdit")
            var self = this;
            if (self.window.getRecord() == null) return;
            var target = $(event.currentTarget);
            if ('__block_event__' in event.currentTarget && event.currentTarget.__block_event__) return;
            let newval = self.setReadOnly(event.currentTarget, self.window.getRecord()[event.currentTarget.name])
            console.log("WFUS")
            await oo.ui.workspace.waitForUnblockedScreen()
            console.log("WFUS DONE")
            oo.ui.workspace.blockScreen()
            var readonly = !Boolean(await self.window.beforeEdit(event.currentTarget.name));
            oo.ui.workspace.unblockScreen()
            if (event.currentTarget.nodeName == 'INPUT' && $(event.currentTarget).attr('type') == 'radio') {
                if (readonly) {
                    self.__element__.find(`input[group_id=${target.attr('group_id')}][value!=${self.window.getRecord()[event.currentTarget.name]}]`).prop('checked', false);
                    self.__element__.find(`input[group_id=${target.attr('group_id')}][value=${self.window.getRecord()[event.currentTarget.name]}]`).prop('checked', true);
                } else  {
                    target.prop('checked', true);
                    self.afterEdit(event);
                }
            } else if (event.currentTarget.nodeName == 'INPUT' && $(event.currentTarget).attr('type') == 'checkbox') {
                if (readonly) {
                    target.prop('checked', Boolean(self.window.getRecord()[event.currentTarget.name]));
                } else {
                    target.prop('checked', newval);
                    self.afterEdit(event);
                }
            }
            else if (event.currentTarget.nodeName == 'SELECT') {
                if (readonly) {
                    target.val(self.window.getRecord()[event.currentTarget.name]);
                    target.material_select();
                } else {
                    target.val(newval)
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
                    target.pickadate('picker').set('select', d);
                    event.currentTarget.__block_event__ = false;
                } else {
                    event.currentTarget.__block_event__ = true;
                    target.pickadate('picker').set('select', newval);
                    event.currentTarget.__block_event__ = false;
                    self.afterEdit(event)
                }
            } else {
                console.log("setting 2 readony to", target, readonly)
                target.attr("readonly", readonly);
            }
        };

        beforeEditRow(event) {
            if ('__block_event__' in event.currentTarget && event.currentTarget.__block_event__) return;
            var params = this;
            var self = params.self;
            var target = $(event.currentTarget);
            target.css('border-bottom', 'none');
            target.css('box-shadow', 'none');
            var readonly = null;
            var rownr = target.closest("tr").attr("rownr");
            if (isNaN(rownr)) { //virtual_row
                //si la fila anterior esta toda vacia, entonces no agrego otra nueva fila
                var tr = target.closest("tr");
                var tr_index = tr.index();
                if (tr_index == 0 || !self.window.getRecord()[params.detailname][tr_index - 1].isEmpty()) {
                    //  var newrow = self.window.getRecord()[params.detailname].newRow();

                    var addedRow = self.virtual_rows[params.detailname];
                    var tbody = target.closest("tbody");
                    addedRow.__window_container_avoid_insert__ = tbody.attr('matrix_idx');
                    self.window.getRecord()[params.detailname].push(self.virtual_rows[params.detailname]);
                    delete addedRow.__window_container_avoid_insert__;
                    tr.attr('rownr', addedRow.rowNr); //esto va antes del push para que durante el push toda este tr del table se complete con los valores que pudiera tener o que se seteen en el defaults del row (todo eso se corre adentro del push)
                    _(addedRow.fieldNames()).forEach(function (fn) {
                        var value = addedRow[fn];
                        if (value != null) {
                            self.update(self.window.newEvent('field modified', {
                                record: self.window.getRecord(),
                                field: self.window.getRecord().details(params.detailname),
                                row: addedRow,
                                rowfield: addedRow.fields(fn),
                                oldvalue: value
                            }));
                        }
                    });
                    self.virtual_rows[params.detailname] = self.window.getRecord()[params.detailname].newRow();
                    var json = _(self.matrix_json_map[params.detailname]).find(function (json) {
                        return json.__element__.find("tbody").attr("matrix_idx") == tbody.attr("matrix_idx")
                    });
                    self.insertMatrixRow(self.window.getRecord(), json, self.virtual_rows[params.detailname], tbody)
                } else {
                    readonly = true;
                }
            }
            if (readonly == null) readonly = !Boolean(self.window.beforeEditRow(this.detailname, this.rowfield.name, rownr));
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
            }
            if (event.currentTarget.nodeName == 'INPUT' && target.attr('datepicker') == 'true') {
                if (readonly) {
                    target.pickadate('picker').close();
                    var d = null;
                    var value = self.window.getRecord()[this.detailname][rownr][this.rowfield.name];
                    if (value != null && value != '') {
                        d = moment(value, "YYYY-MM-DD").toDate()
                    }
                    event.currentTarget.__block_event__ = true;
                    target.pickadate('picker').set('select', d);
                    event.currentTarget.__block_event__ = false;
                } else {
                    self.afterEditRow.call(params, event)
                }
            } else {
                target.attr("readonly", readonly);
            }
        };

        async afterEdit(event) {
            console.log("en afterEdit")
            var self = this;
            if ('__block_event__' in event.currentTarget && event.currentTarget.__block_event__) return;
            var value = event.currentTarget.value;
            if (event.currentTarget.nodeName == 'INPUT' && $(event.currentTarget).attr('type') == 'checkbox') {
                var ftype = self.window.getRecord().fields(event.currentTarget.name).type;
                if (ftype == 'boolean') {
                    value = event.currentTarget.checked;
                } else {
                    value = event.currentTarget.checked ? 1 : 0;
                }
            } else if (event.currentTarget.nodeName == 'INPUT' && $(event.currentTarget).attr('datepicker') == 'true') {
                value = $(event.currentTarget).pickadate('picker').get('select', 'yyyy-mm-dd');
            }
            //console.log("afteredit", self, value)

            oo.ui.workspace.blockScreen();
            console.log("BF")
            await self.window.call_afterEdit(event.currentTarget.name, value)
            console.log("AF")
            oo.ui.workspace.unblockScreen();
        };

        afterEditRow(event) {
            var params = this;
            var self = params.self;
            var target = $(event.currentTarget);
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
            } else if (event.currentTarget.nodeName == 'INPUT' && target.attr('datepicker') == 'true') {
                value = target.pickadate('picker').get('select', 'yyyy-mm-dd');
            }
            console.log("Before call afterEditRow: ", params.detailname, params.rowfield.name, rownr, value, self.window.getRecord().Rows.length)
            self.window.afterEditRow(params.detailname, params.rowfield.name, rownr, value);
        };


        update(event) {
            var self = this;
            //console.log(event)
            let x = null;
            switch (event._meta.name) {
                case "close":
                    self.close()
                    break;
                case "focus":
                    //el action 'open' es en event de clase y no entra por aca. ver final de este archivo.
                    self.focus()
                    break;
                case "record replaced":
                    self.bindRecordToWindow(event.record);
                    break;
                case "field modified":
                    var field = event.field;
                    if (field.type != "detail") {
                        self.setEditorValue(field.name, field.type, field.getValue());
                        Materialize.updateTextFields();
                    } else {
                        var rowNr = event.row.rowNr;
                        if (event.rowfield.name == 'rowNr') rowNr = event.oldvalue; //si lo que cambio fue el rowNr del row entonces uso el valor anterior a la modificacion para identificar la fila a modificar
                        self.setRowEditorValue(event.field.name, rowNr, event.rowfield.name, event.rowfield.type, event.rowfield.getValue());
                        Materialize.updateTextFields();
                    }
                    break;
                case "row inserted":
                    var detail = event.detail;
                    if (detail.name in this.matrix_json_map) {
                        _(this.matrix_json_map[detail.name]).forEach(function (matrixjson) {
                            var tbody = matrixjson.__element__.find("tbody[matrix_idx]");
                            self.insertMatrixRow(event.record, matrixjson, event.row, tbody);
                        })
                    }
                    break;
                case "row removed":
                    var detail = event.detail;
                    if (detail.name in this.matrix_json_map) {
                        _(this.matrix_json_map[detail.name]).forEach(function (matrixjson) {
                            matrixjson.__element__.find(`tbody[matrix_idx] tr[rownr=${event.position}]`).remove();
                        })
                    }
                    break;
                case "detail cleared":
                    var detail = event.detail;
                    if (detail.name in this.matrix_json_map) {
                        _(this.matrix_json_map[detail.name]).forEach(function (matrixjson) {
                            var tbody = matrixjson.__element__.find("tbody");
                            tbody.find("tr").not('[rowNr=null]').remove();
                        })
                    }
                    break;
                case "modified flag":
                    self.setModified(event.modified)
                    break;
                case "title changed":
                    self.setWindowTitle(event.title)
                    break
                case "add card":
                    self.createCard(event.name, event.container, self.__element__.find(`[cardcontainer=${event.container}]`))
                    break;
                case "remove card":
                    self.__element__.find(`div[cardcontainer=${event.container}] .singlecard-container[cardname=${event.name}]`).remove()
                    break;
                case "processing start":
                    oo.ui.workspace.blockScreen()
                    break;
                case "processing end":
                    oo.ui.workspace.unblockScreen()
                    break;

            }
        }

        insertMatrixRow(record, json, row, tbodyElement, position) {
            if (row.__window_container_avoid_insert__ == tbodyElement.attr("matrix_idx")) {
                //self.insertMatrixRow(record, json, self.virtual_rows[json.field], tbody)
                return;
            }
            var self = this;
            var tbody = tbodyElement;
            let args = {rowNr: "" + row.rowNr} //para que null vaya como string, y sea 'null'
            let template = oo.ui.templates.get('window oomaster components matrixrow')
            var tr = $(template.getHTML(args))
            //$('<tr rownr="' + row.rowNr + '"></tr>');

            _(json.columns).forEach(function (jcol) {
                let args = {}
                let template = oo.ui.templates.get('window oomaster components matrixcell')
                var td = $(template.getHTML(args))
                var component = self.createMatrixComponent(jcol, 'oodetail', json.field, row.rowNr, row.fields(jcol.field));
                var readonly = !record.fieldIsEditable(json.field, jcol.field, row.rowNr);
                if (readonly) component.attr('readonly', readonly);
                component.css('border-bottom', 'none');
                component.css('box-shadow', 'none');
                td.append(component);
                tr.append(td)
            });

            let rowTagName = tr.prop("tagName");
            var trs = tbody.children(rowTagName);
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
                    next_tr = tbody.children(rowTagName + '[rownr=' + i + ']');
                    next_tr.attr('rownr', i + 1)
                }
                next_tr.before(tr)
            }
            tr.find("select").material_select();
            //tr.find("input[datepicker=true]").pickadate(WindowContainer.datePickerOptions);
            return tr;
        };

        setEditorValue(fname, ftype, value) {
            var elements = this.__element__.find('.editor.oomaster[name=' + fname + ']');
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                var e = $(element);
                if (element.nodeName == 'SELECT') {
                    e.val(value);
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
                    e.pickadate('picker').set('select', d);
                    element.__block_event__ = false;
                } else if (element.nodeName == 'TEXTAREA') {
                    e.val(value)
                    e.trigger('autoresize')
                } else {
                    if (ftype == 'date' && value != null) {
                        e.val(value.format("YYYY-MM-DD"))
                    } else {
                        e.val(value)
                    }
                }
            }
        };

        setRowEditorValue(detailname, rowNr, rowfieldname, rowfieldtype, value) {
            var elements = this.__element__.find('table[name=' + detailname + '] tr[rownr=' + rowNr + '] .editor.oodetail[name=' + rowfieldname + ']');
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                var e = $(element);
                if (elements[i].nodeName == 'SELECT') {
                    e.val(value);
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
                    e.pickadate('picker').set('select', d);
                    element.__block_event__ = false;
                } else {
                    if (rowfieldtype == 'date' && value != null) {
                        e.val(value.format("YYYY-MM-DD"))
                    } else {
                        e.val(value)
                    }
                }
            }
            if (rowfieldname == 'rowNr') {
                let trs = this.__element__.find('table[name=' + detailname + '] tr[rownr=' + rowNr + ']');
                _(trs).each((tr)=> {
                    $(tr).attr('rowNr', value);
                })

            }

        };

        setEditorReadOnly(field, readonly) {
            this.__element__.find('.editor.oomaster[name=' + field.name + ']').attr('readonly', readonly)
        };

        createEmptyMatrix(json) {
            var self = this;
            let template = oo.ui.templates.get('window oomaster components matrix')
            console.log(template)
            let columns = []
            _(json.columns).forEach(function (col) {
                let column = {}
                column.label = col.label ? col.label : col.field;
                columns.push(column);
            });
            let args = {field: json.field, columns: columns}
            let res = $(template.getHTML(args))
            self.matrix_idx += 1;
            res.find(template.meta.attr('row-container-selector')).attr('matrix_idx', self.matrix_idx);
            json.__element__ = res;
            if (!(json.field in this.matrix_json_map)) this.matrix_json_map[json.field] = [];
            this.matrix_json_map[json.field].push(json);
            return res;
        };

        bindRecordToComponent(record, jcomponent) {
            var self = this;
            if (jcomponent instanceof Array) {
                _(jcomponent).forEach(function (json) {
                    if ('columns' in json) {
                        var tbody = json.__element__.find("tbody");
                        tbody.html('');
                        _(record[json.field]).forEach(function (row) {
                            self.insertMatrixRow(record, json, row, tbody)
                        });
                        self.insertMatrixRow(record, json, self.virtual_rows[json.field], tbody) //inserting virtual row
                    } else if ('field' in json) {
                        var field = record.fields(json.field);
                        self.setEditorValue(field.name, field.type, field.getValue());
                        self.setEditorReadOnly(field, !record.fieldIsEditable(json.field))
                    } else {
                        var jcontent = null;
                        if (json.pages instanceof Array) jcontent = json.pages;
                        else if (json.content instanceof Array) jcontent = json.content;
                        self.bindRecordToComponent(record, jcontent);
                    }
                })
            }
        };

        bindRecordToWindow(record) {
            if (this.current_record_id) oo.eventmanager.off(`start editing record ${this.window.__class__.getRecordClass().getDescription().name}:${this.current_record_id}`)
            this.current_record_id = null;
            var self = this;
            self.virtual_rows = {}
            if (record) {
                _(record.detailNames()).forEach(function (dn) {
                    var vt = record[dn].newRow();
                    //vt.rowNr =
                    self.virtual_rows[dn] = vt;
                });
                self.bindRecordToComponent(record, self.windowjson);
                self.setModified(this.window.getRecord().isModified())
            }

            self.setWindowTitle(this.window.getTitle());
            Materialize.updateTextFields();
            self.__element__.find("select").material_select()
            if (record && record.internalId) {
                this.current_record_id = record.internalId
                if (this.current_record_id) oo.eventmanager.on(`start editing record ${this.window.__class__.getRecordClass().getDescription().name}:${this.current_record_id}`, (event) => {
                    oo.postMessage(`Warning! User ${event._meta.user} just started editing this record.`)
                })
            }
        };


        createPasteWindow() {
            var self = this;
            self.pastewindow_id = oo.ui.genId("PASTEWINDOW");
            var html = '';
            html += '<div id="' + self.pastewindow_id + '" class="modal modal-fixed-footer pastewindow" style="z-index: 1003; display: none; opacity: 0; transform: scaleX(0.7); top: 317.636px;">';
            html += '  <div class="modal-content">';
            //html += '    <table class="recordlist"><thead></thead><tbody></tbody></table>';
            html += '    <div class="pastewindow_grid" style="width:600px;height:200px;"></div>';
            html += '  </div>';
            html += '  <div class="modal-footer green lighten-4">';
            html += '    <a href="#" class="waves-effect waves-red btn-flat modal-action modal-close">Disagree</a>';
            html += '    <a href="#" class="waves-effect waves-green btn-flat modal-action modal-close">Agree</a>';
            html += '  </div>';
            html += '</div>';
            var pastewindow = $(html);
            return pastewindow;
        };

        openPasteWindow(event) {
            var params = this;
            var self = params.self;
            var field = params.field;
            var fieldjson = params.json;
            var pw = cm.getClass(fieldjson.pastewindow);
            var pwelement = self.__element__.find(".pastewindow");
            var recordClass = cm.getClass(pw.__description__.recordClass);
            let columns = pw.__description__.columns;
            var readonly = null;
            let rownr = null;
            if (params.detailname == null) {
                readonly = !Boolean(self.window.beforeEdit(fieldjson.field));
            } else {
                //console.log(event)
                rownr = $(event.target).closest("tr").attr("rownr");
                if (isNaN(rownr)) { //virtual row
                    readonly = true;
                } else {
                    readonly = !Boolean(self.window.beforeEditRow(params.detailname, fieldjson.field, rownr));
                }
            }
            if (readonly) return;


            let generateColumns = function generateColumns() {
                let self = this;
                grid_columns = [];
                for (let i = 0; i < columns.length; i++) {
                    let col = columns[i];
                    grid_columns.push({id: col.field, name: col.field, field: col.field, sortable: true})
                }
                return grid_columns;
            }

            //var recordClass = self.listwindow.getRecordClass();
            //var columns = self.listwindow.__class__.__description__.columns;

            var grid;
            var loader = new Slick.Data.RemoteModel(recordClass);
            var options = {
                enableCellNavigation: true,
                enableColumnReorder: false,
                //showHeaderRow: true,

            };

            let grid_columns = generateColumns();
            grid = new Slick.Grid(pwelement.find(".pastewindow_grid"), loader.data, grid_columns, options);
            grid.onClick.subscribe(function (e, args) {
                var item = args.item;
                var pasteparams = {
                    self: self,
                    detailname: params.detailname,
                    rownr: rownr,
                    field: field,
                    fieldjson: fieldjson,
                    pastewindow: pw,
                    pastewindowelement: pwelement,
                    editor: params.editor,
                    record: args.grid.getData()[args.row]
                };

                //args.grid.getData()[args.row]

                self.recordSelectedInPasteWindow(pasteparams)
            });
            grid.onViewportChanged.subscribe(function (e, args) {
                var vp = grid.getViewport();
                loader.ensureData(vp.top, vp.bottom);
            });
            loader.onDataLoaded.subscribe(function (e, args) {
                for (var i = args.from; i <= args.to; i++) {
                    grid.invalidateRow(i);
                }
                grid.updateRowCount();
                grid.render();
                //loadingIndicator.fadeOut();
            });


            grid.onSort.subscribe(function (e, args) {
                loader.setSort(args.sortCol.field, args.sortAsc ? 1 : -1);
                var vp = grid.getViewport();
                loader.ensureData(vp.top, vp.bottom);
            });
            grid.onViewportChanged.notify();
            pwelement.openModal();
        };

        async openRelatedRecord(event) {
            var params = this;
            var self = params.self;
            var field = params.field;
            var fieldjson = params.json;
            var pw = cm.getClass(fieldjson.pastewindow);
            var recordClass = cm.getClass(pw.__description__.recordClass);
            var windowClass = cm.getClass(pw.__description__.windowClass);
            let columns = pw.__description__.columns;
            var readonly = null;
            let rownr = null;
            let record = recordClass.new();
            record.fields(pw.__description__.pastefieldname).setValue($(event.currentTarget).val())
            if (await record.load()) {

                let window = windowClass.new()
                window.setRecord(record);
                window.open();
                window.setFocus();
            }
        };

        recordSelectedInPasteWindow(params) {
            //var params = this;
            var self = this;
            params.pastewindowelement.closeModal()
            var readonly = null;
            if (params.detailname == null) {
                readonly = !Boolean(self.window.beforeEdit(params.fieldjson.field));
            } else {
                readonly = !Boolean(self.window.beforeEditRow(params.detailname, params.fieldjson.field, params.rownr));
            }
            if (readonly) return;
            var event = {target: params.editor[0], currentTarget: params.editor[0]};
            if (params.detailname == null) {
                self.setEditorValue(params.fieldjson.field, params.field.type, params.record[params.pastewindow.__description__.pastefieldname])
                self.afterEdit(event)
            } else {
                self.setRowEditorValue(params.detailname, params.rownr, params.fieldjson.field, params.field.type, params.record[params.pastewindow.__description__.pastefieldname])
                var bind_params = {
                    self: self,
                    json: params.fieldjson,
                    detailname: params.detailname,
                    rowfield: params.field
                };   //self.window.getRecord().details(params.detailname)[params.rownr].fields(params.fieldjson.name)
                self.afterEditRow.call(bind_params, event)
            }
        };

        setModified(modified) {
            if (modified) {
                $('a[href="#' + this.tab_id + '"]').css('color', 'blue')
            } else {
                $('a[href="#' + this.tab_id + '"]').css('color', '')
            }
        }


        getCardContainer(containerName) {
            return this.cardcontainers[containerName]
        }

        insertCardInContainer(containerName, cardname) {
            console.log("ICIC", containerName, cardname)
            this.cardcontainers[containerName].push(cardname);
            this.update(this.window.newEvent('add card', {container: containerName, name: cardname}))
        }

        removeCardFromContainer(containerName, cardname) {
            let classnames = this.getCardContainer(containerName);
            let idx = classnames.indexOf(cardname);
            if (idx >= 0) {
                classnames.splice(idx, 1);
                this.update(this.window.newEvent('remove card', {container: containerName, name: cardname}))
            }
        }

        async selectCards(event) {
            let params = this;
            let self = params.self;
            let containerName = params.containerName;
            //let selectorContainer = $(`<div></div>`)
            let cardClasses = self.window.__class__.findMatchingCardClasses();
            let cardListener = function (event) {
                let cardContainer = this;
                cardContainer.html('')
                cardContainer.append(event.DOMComponent)
            }
            let addListener = function (event) {
                let params = this;
                let self = params.self
                let cardname = params.cardname
                self.insertCardInContainer(containerName, cardname)
                let dialog = $(event.target).closest('.modal')
                selectorContainer.find('#' + params.id).remove()
                let length = selectorContainer.find('.singlecard-container').length;
                if (length == 0) {
                    dialog.closeModal();
                    _(cards).each((card) => {
                        card.stop()
                    })
                    cards = []
                }
            }
            let cards = [];
            let items = [];
            for (let i = 0; i < cardClasses.length; i++) {
                let cc = cardClasses[i];
                if (self.getCardContainer(containerName).indexOf(cc.getDescription().name) >= 0) continue
                let item = {
                    id: oo.ui.genId(),
                    add_action_id: oo.ui.genId(),
                    cardcontainer_id: oo.ui.genId(),
                    cardclassname: cc.getDescription().name
                }
                items.push(item);
            }
            let args = {items: items}
            let selectorContainer = oo.ui.templates.get('cardselector').createElement(args);
            for (let i = 0; i < items.length; i++) {
                let item = items[i]
                let card = cm.getClass(item.cardclassname).new()
                card.setDataProvider(await self.window.getProvidedData());
                let container = selectorContainer.find("#" + item.id)
                let addButton = selectorContainer.find("#" + item.add_action_id)
                addButton.click(addListener.bind({self: self, cardname: item.cardclassname, id: item.id}))
                let cardContainer = selectorContainer.find("#" + item.cardcontainer_id)
                card.on('content updated', cardListener.bind(cardContainer));
                card.play()
                cards.push(card);
            }
            //console.log("selectorContainer", selectorContainer)
            console.log("BEFORE INSERT IN PAGE")
            await window.oo.ui.dialogs.customDialog("select card", selectorContainer, {
                dismisible: true,
                complete: function () {
                    _(cards).each((card) => {
                        card.stop()
                    })
                    cards = []
                }
            })
            console.log("AFTER INSERT IN PAGE")
            selectorContainer.addedToPage(selectorContainer);
            //if (cards.length > 0) selectorContainer.carousel();  //si el carouse no tiene items tira error la libreria materialize
            //$('#' + containerid).append(m);
        }
    }

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
    $(document).ready(function () {
        //console.log("DOC READY WINDOWMANAGER")
        cm.getClass("Embedded_Window").onAny(function (event) {
            if (event._meta.name == 'open') {
                let wm = new WindowContainer(event.window, event.viewcontainer)
                wm.render()
            }
        });
    })
    window.oo.ui.windowmanager = WindowContainer;

    //$.extend(true, window.oo.ui, {windowmanager: WindowContainer})
    //window.WindowManager = WindowContainer; //para hacer global la variable WindowManager
})(jQuery);
