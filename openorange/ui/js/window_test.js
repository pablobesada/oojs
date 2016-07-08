"use strict";
//var WindowManager = require("./openorange/lib/windowmanager")
(function () {
    var oo = require("openorange")
    var cm = oo.classmanager

    $(document).ready(function () {
        let wso = cm.getClass("SalesOrderListWindow").new();
        wso.open()

    });

})();