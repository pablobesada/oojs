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
            this.start = null;
            this.count = null;
            this.batch = 3;
            return this
        }

        render() {
            var self = this;
            this.__element__.addClass('oo-listwindow-container')
            this.__element__.append(oo.ui.templates.get('.listwindow .body').createElement())

            oo.ui.containers.push({
                entity: this.listwindow,
                element: this.__element__,
                tab_id: this.tab_id,
                container: self
            });
            this.displayWindow(this.__element__)
            self.renderActionBar();
            this.callInitOnPageCallbacks();

        };

        displayWindow(windowElement) {

            var self = this
            var tab = $('<li class="tab"><a href="#' + this.tab_id + '">' + this.listwindow.getTitle() + '</a></li>');
            $('ul.tabs.workspace').append(tab);
            windowElement.attr('id', this.tab_id);
            $('#workspace').append(windowElement);
            this.templateElements.push(windowElement)
            $('ul.tabs.workspace').tabs();

            var recordClass = self.listwindow.getRecordClass();
            self.generateColumns();

            let $body = oo.ui.templates.get('.listwindow .body').createElement()
            this.listcontainer = $body.find('.oo-list-container');
            if (this.listcontainer.length >= 0) this.listcontainer = this.listcontainer.addBack('.oo-list-container')
            let $listheader = $body.find('.oo-list-header')
            if ($listheader.length > 0) {
                for (let i in self.grid_columns) {
                    let col = self.grid_columns[i]
                    let args = {label: col.label}
                    let $cell = oo.ui.templates.get('.listwindow .header-cell').createElement(args)
                    $listheader.append($cell)
                }
            }
            //$listheader.html("pepepep")
            this.listcontainer.scroll(this.listScrolled.bind(this))
            this.__element__.html($body)
            this.templateElements.push($body)
            //this.start = 0;
            function getItems(start, count) {
                console.log('fetching items: ', start, 'to', start + count - 1, " (" + count + ")")
                var promise = Promise.pending();
                var res = [];
                for (var i = start; i < start + count; i++) {
                    let item = document.createElement("div")
                    item.style.fontSize = '12pt'
                    item.style.padding = '35px'
                    item.style.border = '1px solid black'
                    item.style.width = '100%'
                    //item.style.position = 'absolute'
                    //item.style.backgroundColor = 'black';
                    //item.style.color = 'white';
                    item.innerHTML = 'Item ' + i
                    res.push(item);
                }
                //return res;
                setTimeout(function () {promise.resolve(res)}, 5);
                //promise.resolve(res)
                return promise.promise
            }
            setTimeout(() => {
                this.listcontainer = this.listcontainer.superlist({src: this.getRows.bind(this)});
            }, 0)

            //this.fill(this.start, this.start+this.batch);

        };

        generateColumns() {
            var self = this;
            this.grid_columns = [];
            var columns = self.listwindow.__class__.__description__.columns;
            for (var i = 0; i < columns.length; i++) {
                var col = columns[i];
                this.grid_columns.push({id: col.field, label: col.field, field: col.field, sortable: true})
            }
        }

        async getRows(start, count) {
            let self = this;
            let records = await this.listwindow.getRecords(start, count);
            this.count = records.length;
            let res = [];
            for (let i in records) {
                let rec = records[i];
                let args = {}
                let $row = oo.ui.templates.get('.listwindow .row').createElement(args)
                let $cellcontainer = $row.find('.oo-cell-container')
                if ($cellcontainer.length == 0) $cellcontainer = $cellcontainer.addBack('.oo-cell-container');
                if ($cellcontainer.length == 0) $cellcontainer = $row;

                for (let j in this.grid_columns) {
                    let col = this.grid_columns[j];
                    let args = {value: rec[col.field], label: col.label}
                    let $cell = oo.ui.templates.get('.listwindow .row-cell').createElement(args)
                    $cellcontainer.append($cell)
                }
                $row.click((event) => {
                    self.recordSelectedInListWindow(rec);
                })
                res.push($row)
            }
            return res;
        }

        listScrolled(event) {
            console.log(this.listcontainer.offsetY)
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