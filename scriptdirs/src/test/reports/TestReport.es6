"use strict";
var cm = require('openorange').classmanager
let moment = require("moment")
var Description = {
    name: 'TestReport',
    inherits: 'Report',
    title: 'Test Report',
    filename: __filename,
    params: {
        S1: {type: 'string'},
        I1: {type: 'integer'},
    }

}

//let CustomerListReport = cm.createClass(Description, __filename)
let Parent = cm.SuperClass(Description)

class TestReport extends Parent {
    getData() {
        let data = []
        for (let i=0;i<10;i++){
            data.push(['A'+i, 'B'+i])
        }
        return data
    }

    async run() {
        super.run()
        var self = this;
        self.startTable()
        self.startHeaderRow()
        self.addValue(moment())
        self.addValue(this.getRecord().S1)
        self.addValue(this.getRecord().I1)
        self.endHeaderRow()
        self.startHeaderRow()
        self.addValue("COL 1")
        self.addValue("COL 2")
        self.endHeaderRow()
        let data = this.getData();
        for (var i = 0; i < data.length; i++) {
            var rec = data[i];
            self.startRow()
            self.addValue(rec[0])
            self.addValue(rec[1])
            self.endRow()
        }
        self.endTable()
    }
}


module.exports = TestReport.initClass(Description)