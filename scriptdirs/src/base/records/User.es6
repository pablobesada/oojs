let _ = require("underscore")
var cm = require('openorange').classmanager

var Description = {
    name: 'User',
    inherits: 'Master',
    fields: {
        Code: {type: "string", length: 10},
        Name: {type: "string", length: 100},
        AccessGroup: {type: "string", length: 10},
        SalesGroup: {type: "string", length: 10},
        Department: {type: "string", length: 20},
        Person: {type: "string", length: 10},
        Office: {type: "string", length: 20},
        Label: {type: "set", length: 20},
        StockDepo: {type: "string", length: 10},
        DisableBuffers: {type: "boolean", length: 10},
        Closed: {type: "boolean", length: 10},
        Shift: {type: "string", length: 5},
        DefaultReportFontSize: {type: "integer", length: 10},
        TaskCheckingInterval: {type: "integer", length: 10},
        Password: {type: "string", length: 130},
        Favourites: {type: "string", length: 1024},  
    },
    filename: __filename
}

var Parent = cm.SuperClass(Description)

class User extends Parent {

    addFavourite(favlink) {
        this.Favourites = this.Favourites || ""
        let values = _.filter(this.Favourites.split(","), (v) => {return v.trim()});
        values.push(favlink);
        this.Favourites = values.join(",")
        console.log(this.Favourites)
    }

    removeFavourite(favlink) {
        let values = this.Favourites.split(",");
        values.splice(values.indexOf(favlink), 1);
        this.Favourites = values.join(',')
    }
}

module.exports = User.initClass(Description)

