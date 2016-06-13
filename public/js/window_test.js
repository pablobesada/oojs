"use strict";
//var WindowManager = require("./openorange/lib/windowmanager")
var cm = require("./openorange").classmanager
var window_def = {
    title: "Ventana Test",
    form: [
        {type: 'input', field: 'SerNr', label: 'Numero'},
        {type: 'input', field: 'CustCode'}
    ]
}
var n1 = 2222444;
var n2 = 444;
var n = n1;
var itcode = '123'
$(document).ready(function () {
    console.log("ready")
    //$('ul.tabs').tabs();

    console.log("ready2")
    $("#addSalesOrder").click(addSalesOrder)
    $("#addItem").click(addItem)
    $("#test").click(test)
    //wso = cm.getClass("SalesOrderWindow").new()
    addSalesOrder();
})

var wso;
var wit;
var so;
function addSalesOrder() {

    wso = cm.getClass("CustomerListWindow").new()
    wso.open()
    wso = cm.getClass("SalesOrderWindow").new()
    wso.open()
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
        .catch(function () {
            console.log("sales order not found")
        })

};

function addItem() {
    wit = cm.getClass("ItemWindow").new()
    var rec = cm.getClass("Item").new()
    rec.Code = itcode;
    itcode += '4'
    wit.setRecord(rec);
    wit.open()
    //var wm = Object.create(WindowManager).init(w)

    //wm.render($('#content')[0])
    //console.log($('#content')[0])
};

function test() {
    var wcust = cm.getClass("CustomerWindow").new()
    var rec = cm.getClass("Customer").new()
    wcust.setRecord(rec)
    wcust.open()
}