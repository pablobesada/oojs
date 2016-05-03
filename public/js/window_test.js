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
var n1 = 6669;
var n2 = 444;
var n = n1;
$().ready(function () {
    console.log("ready")
    $("#addSalesOrder").click(addSalesOrder)
    $("#addItem").click(addItem)
    $("#test").click(test)
    wso = cm.getClass("SalesOrderWindow").new()
    addSalesOrder().then(function () {wso.open()});
})
var wso;
var wit;
var so;
function addSalesOrder() {
    return cm.getClass("SalesOrder").bring(n)
        .then(function (ss) {
            so = ss;
            wso.setRecord(so);
            if (n == n1) {
                n = n2;
            } else {
                n = n1;
            }
        })
};

function addItem() {
    var wit = cm.getClass("ItemWindow").new()
    var rec = cm.getClass("Item").new()
    rec.Code = '123'
    wit.setRecord(rec);
    wit.open()
    //var wm = Object.create(WindowManager).init(w)

    //wm.render($('#content')[0])
    //console.log($('#content')[0])
};

function test() {
    so.CustName = so.CustName + "H"
}