"use strict";
//var WindowManager = require("./openorange/lib/windowmanager")
(function () {
    var oo = require("openorange")
    var cm = oo.classmanager

    $(document).ready(function () {
        let wso = cm.getClass("SalesOrderListWindow").new();
        wso.open()

        /*let w = cm.getClass("SalesOrderWindow").new()
        w.open()
        w.setFocus();
        let r = w.__class__.getRecordClass().bring(4445634).then(function (rec) {
            w.setRecord(rec);
        })*/

    });

})();