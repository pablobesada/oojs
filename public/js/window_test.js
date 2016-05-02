"use strict";
var WindowManager = require("./openorange/lib/windowmanager")
var cm = require("./openorange").classmanager
var window_def = {
    title: "Ventana Test",
    form: [
        {type: 'input', field: 'SerNr', label: 'Numero'},
        {type: 'input', field: 'CustCode'}
    ]
}

$().ready(function () {
    console.log("ready")
    $("#addWindow").click(addWindow)
})

function addWindow() {
    var w = cm.getClass("SalesOrderWindow").new()
    cm.getClass("SalesOrder").bring(333)
        .then(function (so) {
            console.log(so)
            w.setRecord(so);
            w.open()
            //var wm = Object.create(WindowManager).init(w)

            //wm.render($('#content')[0])
            //console.log($('#content')[0])
        })
};
