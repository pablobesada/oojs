"use strict";

(function () {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    class ListWindowContainer {

        static findListWindowContainerForTabId(tab_id) {
            for (let i = 0; i < ListWindowContainer.listwindows.length; i++) {
                if (ListWindowContainer.listwindows[i].tab_id == tab_id) {
                    return ListWindowContainer.listwindows[i].container;
                }
            }
            return null
        }

        constructor(wnd) {
            this.listwindow = wnd;
            this.grid_columns = null;
            this.windowjson = JSON.parse(JSON.stringify(this.listwindow.__class__.__description__.columns));   //deep clone of the object because I need to add some metadata to it
            this.listwindow.onAny(this.update.bind(this));
            return this
        }

        setFocus() {
            $('ul.tabs.workspace').tabs('select_tab', this.tab_id);
            return;
            for (var i = 0; i < ListWindowContainer.listwindows.length; i++) {
                var w = ListWindowContainer.listwindows[i];
                if (w.listwindow === window) {
                    $('ul.tabs.workspace').tabs('select_tab', w.tab_id);
                }
            }
        }

        render() {
            var self = this;
            //console.log(containerElement)
            var html = '<div class="container"></div>';
            let toolBar = self.createToolBar();
            var w = $(html)
            w.append(toolBar)
            w.append('<div class="grid-header" style="width:100%"> <label>lalala</label> <span style="float:right;display:inline-block;">Search: <input type="text" id="txtSearch" value="buscar"> </span> </div>');
            w.append('<div class="listwindow_grid" style="width:600px;height:200px;"></div>')
            this.tab_id = "tab_listwindow_" + (ListWindowContainer.listwindows.length + 1);
            ListWindowContainer.listwindows.push({
                listwindow: this.listwindow,
                element: w,
                tab_id: this.tab_id,
                container: self
            });
            this.__element__ = w;
            this.displayWindow(w)

        };

        displayWindow(windowElement) {

            var self = this
            var tab = $('<li class="tab"><a href="#' + this.tab_id + '">' + this.listwindow.getTitle() + '</a></li>');


            $('ul.tabs.workspace').append(tab);

            windowElement.attr('id', this.tab_id);

            $('#workspace').append(windowElement);

            $('ul.tabs.workspace').tabs();

            var recordClass = self.listwindow.getRecordClass();
            var columns = self.listwindow.__class__.__description__.columns;

            var grid;
            var loader = new Slick.Data.RemoteModel(recordClass);
            var options = {
                enableCellNavigation: true,
                enableColumnReorder: false,
                //showHeaderRow: true,

            };

            self.generateColumns();
            grid = new Slick.Grid(windowElement.find(".listwindow_grid"), loader.data, self.grid_columns, options);
            grid.onClick.subscribe(function (e, args) {
                var item = args.item;
                self.recordSelectedInListWindow(args.grid.getData()[args.row])
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

            $("#txtSearch").keyup(function (e) {
                if (e.which == 13) {
                    loader.setSearch($(this).val());
                    var vp = grid.getViewport();
                    loader.ensureData(vp.top, vp.bottom);
                }
            });
            grid.onSort.subscribe(function (e, args) {
                loader.setSort(args.sortCol.field, args.sortAsc ? 1 : -1);
                var vp = grid.getViewport();
                loader.ensureData(vp.top, vp.bottom);
            });
            grid.onViewportChanged.notify();
        };

        createToolBar() {
            var self = this;
            var html = '<div class="row">';
            for (let i = 0; i < self.listwindow.__class__.getDescription().actions.length; i++) {
                let actiondef = self.listwindow.__class__.getDescription().actions[i]
                let label = 'icon' in actiondef ? `<i class="mdi">${actiondef.icon}</i>` : actiondef.label;
                html += `<a class="btn waves-effect waves-light" action="${actiondef.method}">${label}</a>`;
            }

            html += '</div>';
            var res = $(html);
            for (let i = 0; i < self.listwindow.__class__.getDescription().actions.length; i++) {
                let actiondef = self.listwindow.__class__.getDescription().actions[i];
                let params = {self: self, actiondef: actiondef}
                res.find(`a[action=${actiondef.method}]`).click(self.actionClicked.bind(params));
            }
            return res;
        };

        /*async action_new() {
         var self = this;
         var record = self.listwindow.getRecordClass().new()
         var window = self.listwindow.getWindowClass().new();
         await record.defaults();
         window.setRecord(record);
         window.open();
         window.setFocus();
         }*/


        generateColumns() {
            var self = this;
            this.grid_columns = [];
            var columns = self.listwindow.__class__.__description__.columns;
            for (var i = 0; i < columns.length; i++) {
                var col = columns[i];
                this.grid_columns.push({id: col.field, name: col.field, field: col.field, sortable: true})
            }
        }


        async recordSelectedInListWindow(record) {
            var self = this;
            let res = await record.load()
            if (res) {
                var window = cm.getClass(self.listwindow.__class__.getDescription().windowClass).new();
                window.setRecord(record);
                window.open();
                window.setFocus();
            }
        }

        update(event) {
            var self = this;
            switch (event._meta.name) {
                case 'focus':
                    self.setFocus()
                    break;
            }
        };

        async actionClicked(event) {
            let params = this;
            let self = params.self;
            let actiondef = params.actiondef;
            self.listwindow.callAction(actiondef);
        }

        async processKeyPress(event) {
            let actions = this.listwindow.__class__.getDescription().actions;
            for (let i = 0; i < actions.length; i++) {
                let actiondef = actions[i]
                if (actiondef.shortcut) {
                    let keys = actiondef.shortcut.toLowerCase().split("+");
                    let shift = false, enter = false, ctrl = false, alt = false, letter = null;
                    for (let j = 0; j < keys.length; j++) {
                        let key = keys[j]
                        switch (key) {
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
                    this.listwindow.callAction(actiondef)
                }
            }
            return false;
        }
    }

    $(document).ready(function () {
        cm.getClass("Embedded_ListWindow").on('open', function (event) {
            let wm = new ListWindowContainer(event.listwindow)
            wm.render()
            // esto deberia ser asyncronico, y ademas traer: Rows y Cards
            // wm.listwindow.getWindowClass() //para que ya vaya trayendo del servidor la clase Window y al hacer click no haya que esperar
        })
    });

    ListWindowContainer.listwindows = [];

    window.oo.ui.listwindowmanager = ListWindowContainer;
    //$.extend(true, window.oo.ui, {listwindowmanager: ListWindowContainer})
    //window.ListWindowManager = ListWindowContainer; //para hacer global la variable WindowManager

})();