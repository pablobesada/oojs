"use strict"

let _ = require("underscore")
let chance = new require("chance")()
let moment = require("moment")

let utils = {}

utils.fillRecord = function fillRecord(record){
    var fields = record.__class__.getDescription().fields
    _(fields).forEach(function(fielddef, fn) {
        if (fn == 'masterId') return;
        if (fn == 'rowNr') return;
        switch (fielddef.type) {
            case 'string':
                record[fn] = chance.word({length: fielddef.length});
                break;
            case 'integer':
                record[fn] = chance.integer({min: -10000, max: 10000});
                break;
            case 'date':
                record[fn] = moment()
                break;
            case 'time':
                //record[fn] = moment()
                record[fn] = '07:04:33'
                break;
            case 'detail':
                var nrows = chance.natural({min: 4, max: 13})
                for (var j=0;j<nrows;j++) {
                    //console.log(fn)
                    var row = record[fn].newRow()
                    fillRecord(row)
                    record[fn].push(row);
                }
        }
    });
    return record;
}


module.exports = utils