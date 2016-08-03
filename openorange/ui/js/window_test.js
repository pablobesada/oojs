"use strict";
//var WindowManager = require("./openorange/lib/windowmanager")
(function () {
    var oo = require("openorange")
    var cm = oo.classmanager

    $(document).ready(function () {
        let wso = cm.getClass("SalesOrderListWindow").new();
        //let wso = cm.getClass("TestRecordListWindow").new();
        wso.open()


        /*wso = cm.getClass("TestRecordWindow").new()
        cm.getClass("TestRecord").findOne({internalId: 7})
            .then(function (rec) {
                wso.setRecord(rec);
                wso.open();
                wso.setFocus();
            })*/


        /*let w = cm.getClass("SalesOrderWindow").new()
        w.open()
        w.setFocus();
        let r = w.__class__.getRecordClass().bring(4445634).then(function (rec) {
            w.setRecord(rec);
            w.print()
        })*/


        /*$('#myList').megalist()
        $('#myList').on('change', function(event){
            var message = "selected index: "+event.selectedIndex+"\n"+
                "selected item: "+event.srcElement.get()[0].outerHTML;
            alert( message );
        })*/


        //$.getScript("http://search.twitter.com/search.json?q=andytrice&rpp=50&include_entities=true&result_type=mixed&callback=dataReceived" );

    });

})();