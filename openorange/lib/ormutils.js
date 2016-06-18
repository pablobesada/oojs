
var ormutils = {}

ormutils.fill_record_with_query_result = function fill_record_with_query_result(record, row, fields) {
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var fn = field.name;
        //console.log(fn, row[fn].constructor)
        record[fn] = row[fn];
    }
}


module.exports = ormutils;