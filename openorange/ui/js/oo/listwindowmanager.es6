"use strict";

(function () {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    var ListWindowContainer = Object.create(null);
    ListWindowContainer.listwindows = [];
    ListWindowContainer.init = function (wnd) {
        this.listwindow = wnd;
        this.grid_columns = null;
        this.windowjson = JSON.parse(JSON.stringify(this.listwindow.__class__.__description__.columns));   //deep clone of the object because I need to add some metadata to it
        return this
    }

    ListWindowContainer.setFocus = function setFocus(window) {
        for (var i = 0; i < ListWindowContainer.listwindows.length; i++) {
            var w = ListWindowContainer.listwindows[i];
            if (w.listwindow === window) {
                console.log("window found: " + w.tab_id)
                $('ul.tabs').tabs('select_tab', w.tab_id);
            }
        }
    }

    ListWindowContainer.render = function render() {
        var self = this;
        //console.log(containerElement)
        var html = '<div class="container"></div>';
        let toolBar = self.createToolBar();
        var w = $(html)
        w.append(toolBar)
        w.append('<div class="grid-header" style="width:100%"> <label>lalala</label> <span style="float:right;display:inline-block;">Search: <input type="text" id="txtSearch" value="buscar"> </span> </div>');
        w.append('<div class="listwindow_grid" style="width:600px;height:200px;"></div>')
        this.tab_id = "tab_listwindow_" + (ListWindowContainer.listwindows.length + 1);
        console.log("setting tab_id: " + this.tab_id)
        ListWindowContainer.listwindows.push({
            listwindow: this.listwindow,
            element: w,
            tab_id: this.tab_id,
            container: self
        });
        this.__element__ = w;
        this.displayWindow(w)

    };

    ListWindowContainer.displayWindow = function displayWindow(windowElement) {

        var self = this
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

    ListWindowContainer.action_new = async function action_new() {
        var self = this;
        var record = self.listwindow.getRecordClass().new()
        var window = self.listwindow.getWindowClass().new();
        await record.defaults();
        window.setRecord(record);
        window.open();
        window.setFocus();
    }

    ListWindowContainer.generateColumns = function generateColumns() {
        var self = this;
        this.grid_columns = [];
        var columns = self.listwindow.__class__.__description__.columns;
        for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            this.grid_columns.push({id: col.field, name: col.field, field: col.field, sortable: true})
        }
    }


    ListWindowContainer.recordSelectedInListWindow = async function recordSelectedInListWindow(record) {
        var self = this;
        console.log("aca")
        let res = await record.load()
        if (res) {
            var window = cm.getClass(self.listwindow.__class__.getDescription().windowClass).new();
            window.setRecord(record);
            window.open();
            window.setFocus();
        }
    }

    $.extend(true, window.oo.ui, {listwindowmanager: ListWindowContainer})
    //window.ListWindowManager = ListWindowContainer; //para hacer global la variable WindowManager

})();