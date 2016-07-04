"use strict";

(function ($) {
    var oo = require("openorange");

    function RemoteModel(rClass) {
        // private
        var PAGESIZE = 50;
        var data = {length: 0};
        var searchstr = "";
        var sortcol = null;
        var sortdir = 1;
        var h_request = null;
        var req = null; // ajax request
        let recordClass = rClass;
        // events
        var onDataLoading = new Slick.Event();
        var onDataLoaded = new Slick.Event();


        function init() {
        }

        function isDataLoaded(from, to) {
            for (var i = from; i <= to; i++) {
                if (data[i] == undefined || data[i] == null) {
                    return false;
                }
            }

            return true;
        }

        function clear() {
            for (var key in data) {
                delete data[key];
            }
            data.length = 0;
        }


        function ensureData(from, to) {
            if (req) {
                req.abort();
                for (var i = req.fromPage; i <= req.toPage; i++)
                    data[i * PAGESIZE] = undefined;
            }

            if (from < 0) {
                from = 0;
            }

            if (data.length > 0) {
                to = Math.min(to, data.length - 1);
            }

            var fromPage = Math.floor(from / PAGESIZE);
            var toPage = Math.floor(to / PAGESIZE);

            while (data[fromPage * PAGESIZE] !== undefined && fromPage < toPage)
                fromPage++;

            while (data[toPage * PAGESIZE] !== undefined && fromPage < toPage)
                toPage--;

            if (fromPage > toPage || ((fromPage == toPage) && data[fromPage * PAGESIZE] !== undefined)) {
                // TODO:  look-ahead
                onDataLoaded.notify({from: from, to: to});
                return;
            }
            var start = fromPage * PAGESIZE;
            var limit = ((toPage - fromPage) * PAGESIZE) + PAGESIZE;

            var query = recordClass.select().offset(start).limit(limit);
            if (sortcol != null) query.order(sortcol, sortdir == -1 ? "DESC" : "ASC");
            if (searchstr != '') query.where({Name__like: '%'+searchstr+'%'})

            if (h_request != null) {
                clearTimeout(h_request);
            }

            h_request = setTimeout(function () {
                for (var i = fromPage; i <= toPage; i++)
                    data[i * PAGESIZE] = null; // null indicates a 'requested but not available yet'

                onDataLoading.notify({from: from, to: to});

                query.fetch()
                    .then(function (result) {
                        onSuccess(result, start)
                    })
                    .catch(function (err) {
                        console.log(err)
                        onError(fromPage, toPage)
                    })

            }, 50);
        }


        function onError(fromPage, toPage) {
            alert("error loading pages " + fromPage + " to " + toPage);
        }

        function onSuccess(result, start) {
            //console.log(result);
            var from = start, to = from + result.length;
            if (from + PAGESIZE > to) {
                data.length = to
            } else {
                data.length = to+PAGESIZE+1;
            }


            for (var i = 0; i < result.length; i++) {
                var item = result[i];
                data[from + i] = item;
                data[from + i].index = from + i;
            }

            //req = null;

            onDataLoaded.notify({from: from, to: to});
        }


        function reloadData(from, to) {
            for (var i = from; i <= to; i++)
                delete data[i];

            ensureData(from, to);
        }


        function setSort(column, dir) {
            sortcol = column;
            sortdir = dir;
            clear();
        }

        function setSearch(str) {
            searchstr = str;
            clear();
        }


        init();

        return {
            // properties
            "data": data,

            // methods
            "clear": clear,
            "isDataLoaded": isDataLoaded,
            "ensureData": ensureData,
            "reloadData": reloadData,
            "setSort": setSort,
            "setSearch": setSearch,

            // events
            "onDataLoading": onDataLoading,
            "onDataLoaded": onDataLoaded
        };
    }

    // Slick.Data.RemoteModel
    $.extend(true, window, {Slick: {Data: {RemoteModel: RemoteModel}}});
})(jQuery);
