"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

(function () {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    var ListWindowContainer = Object.create(null);

    $(document).ready(function () {
        cm.getClass("Embedded_ListWindow").addClassListener(ListWindowContainer);
    });

    ListWindowContainer.listwindows = [];
    ListWindowContainer.init = function (wnd) {
        this.listwindow = wnd;
        this.grid_columns = null;
        this.windowjson = JSON.parse(JSON.stringify(this.listwindow.__class__.__description__.columns)); //deep clone of the object because I need to add some metadata to it
        return this;
    };

    ListWindowContainer.setFocus = function setFocus(window) {
        for (var i = 0; i < ListWindowContainer.listwindows.length; i++) {
            var w = ListWindowContainer.listwindows[i];
            if (w.listwindow === window) {
                console.log("window found: " + w.tab_id);
                $('ul.tabs').tabs('select_tab', w.tab_id);
            }
        }
    };

    ListWindowContainer.render = function render() {
        var self = this;
        //console.log(containerElement)
        var html = '<div class="container"></div>';
        var toolBar = self.createToolBar();
        var w = $(html);
        w.append(toolBar);
        w.append('<div class="grid-header" style="width:100%"> <label>lalala</label> <span style="float:right;display:inline-block;">Search: <input type="text" id="txtSearch" value="buscar"> </span> </div>');
        w.append('<div class="listwindow_grid" style="width:600px;height:200px;"></div>');
        this.tab_id = "tab_listwindow_" + (ListWindowContainer.listwindows.length + 1);
        console.log("setting tab_id: " + this.tab_id);
        ListWindowContainer.listwindows.push({
            listwindow: this.listwindow,
            element: w,
            tab_id: this.tab_id,
            container: self
        });
        this.__element__ = w;
        this.displayWindow(w);
    };

    ListWindowContainer.displayWindow = function displayWindow(windowElement) {

        var self = this;
        var tab = $('<li class="tab col s3"><a href="#' + this.tab_id + '">' + this.listwindow.getTitle() + '</a></li>');

        $('ul.tabs.workspace').append(tab);

        windowElement.attr('id', this.tab_id);

        $('#workspace').append(windowElement);

        $('ul.tabs').tabs();

        var recordClass = self.listwindow.getRecordClass();
        var columns = self.listwindow.__class__.__description__.columns;

        var grid;
        var loader = new Slick.Data.RemoteModel(recordClass);
        var options = {
            enableCellNavigation: true,
            enableColumnReorder: false
        };

        //showHeaderRow: true,

        self.generateColumns();
        grid = new Slick.Grid(windowElement.find(".listwindow_grid"), loader.data, self.grid_columns, options);
        grid.onClick.subscribe(function (e, args) {
            var item = args.item;
            self.recordSelectedInListWindow(args.grid.getData()[args.row]);
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

    ListWindowContainer.action_new = function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var self, record, window;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            self = this;
                            record = self.listwindow.getRecordClass().new();
                            window = self.listwindow.getWindowClass().new();
                            _context.next = 5;
                            return record.defaults();

                        case 5:
                            window.setRecord(record);
                            window.open();
                            window.setFocus();

                        case 8:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function action_new() {
            return ref.apply(this, arguments);
        }

        return action_new;
    }();

    ListWindowContainer.generateColumns = function generateColumns() {
        var self = this;
        this.grid_columns = [];
        var columns = self.listwindow.__class__.__description__.columns;
        for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            this.grid_columns.push({ id: col.field, name: col.field, field: col.field, sortable: true });
        }
    };

    ListWindowContainer.recordSelectedInListWindow = function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(record) {
            var self, res, window;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            self = this;

                            console.log("aca");
                            _context2.next = 4;
                            return record.load();

                        case 4:
                            res = _context2.sent;

                            if (res) {
                                window = cm.getClass(self.listwindow.__class__.getDescription().windowClass).new();

                                window.setRecord(record);
                                window.open();
                                window.setFocus();
                            }

                        case 6:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function recordSelectedInListWindow(_x) {
            return ref.apply(this, arguments);
        }

        return recordSelectedInListWindow;
    }();

    ListWindowContainer.update = function update(event) {
        var self = this;
        switch (event.type) {
            case "listwindow":
                switch (event.action) {
                    case 'open':
                        var wm = Object.create(ListWindowContainer).init(event.data);
                        wm.render();
                        break;
                    case 'setFocus':
                        self.setFocus(event.data);
                        break;
                }
                break;
        }
    };

    window.oo.ui.listwindowmanager = ListWindowContainer;
    //$.extend(true, window.oo.ui, {listwindowmanager: ListWindowContainer})
    //window.ListWindowManager = ListWindowContainer; //para hacer global la variable WindowManager
})();

//# sourceMappingURL=listwindowmanager.js.map