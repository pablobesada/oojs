"use strict";

(function () {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    class ListWindowContainer extends oo.ui.BaseContainer {


        constructor(wnd) {
            super(wnd)
            this.listwindow = wnd;
            this.grid_columns = null;
            this.windowjson = JSON.parse(JSON.stringify(this.listwindow.__class__.__description__.columns));   //deep clone of the object because I need to add some metadata to it
            this.listwindow.onAny(this.update.bind(this));
            return this
        }

        render() {
            var self = this;
            this.__element__.append(oo.ui.templates.get('.listwindow .content').createElement())

            oo.ui.containers.push({
                entity: this.listwindow,
                element: this.__element__,
                tab_id: this.tab_id,
                container: self
            });
            this.displayWindow(this.__element__)
            self.renderActionBar();

        };

        displayWindow(windowElement) {
            var self = this
            var tab = $('<li><a href="#' + this.tab_id + '">' + this.listwindow.getTitle() + '</a></li>');
            $('ul.recent-activity').prepend(tab);
            windowElement.attr('id', this.tab_id);
            $('#workspace').append(windowElement);
            $('ul.recent-activity').tabs();
            var recordClass = self.listwindow.getRecordClass();
            var columns = self.listwindow.__class__.__description__.columns;
            var grid;
            var loader = new Slick.Data.RemoteModel(recordClass);
            var options = {
                enableCellNavigation: true,
                enableColumnReorder: false,
                forceFitColumns: true,
                //autoExpandColumns: true,
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

            var siblings = windowElement.siblings();
            if (siblings.length > 0) {
              siblings.each(function() {
                $(this).css('display', 'none');
              });
            }

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
                    self.focus()
                    break;
                case "close":
                    self.close()
                    break;
            }
        };

    }

    $(document).ready(function () {
        cm.getClass("Embedded_ListWindow").on('open', function (event) {
            let wm = new ListWindowContainer(event.listwindow)
            wm.render()
            // esto deberia ser asyncronico, y ademas traer: Rows y Cards
            // wm.listwindow.getWindowClass() //para que ya vaya trayendo del servidor la clase Window y al hacer click no haya que esperar
        })
    });

    window.oo.ui.listwindowmanager = ListWindowContainer;

})();
