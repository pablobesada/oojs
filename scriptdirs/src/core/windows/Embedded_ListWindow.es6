"use strict" 
var oo = require('openorange')
let moment = require("moment")

var ListWindowDescription = {
    name: 'Embedded_ListWindow',
    inherits: null,
    suggested_searches: [],
    filename: __filename,

}

class Embedded_ListWindow extends oo.UIEntity {


    static initClass(descriptor) {
        super.initClass(descriptor)
        let newdesc = {}
        let parentdesc = this.__description__;
        newdesc.name = descriptor.name;
        newdesc.title = descriptor.title;
        newdesc.recordClass = descriptor.record
        newdesc.windowClass = descriptor.window
        newdesc.columns = descriptor.columns;
        newdesc.filename = descriptor.filename;
        newdesc.actions = parentdesc.actions
        newdesc.suggested_searches = parentdesc.suggested_searches ? parentdesc.suggested_searches.slice() : []
        if (descriptor.suggested_searches) {
            for (let i = 0; i < descriptor.suggested_searches.length; i++) newdesc.suggested_searches.push(descriptor.suggested_searches[i])
        }

        this.__recordClass__ = null;
        this.__windowClass__ = null;
        this.__description__ = newdesc;
        this.searchText = null;
        this.where = null;
        return this;
    }

    static new() {
        var res = new this();
        return res;
    }

    constructor() {
        super()
        this.__class__ = this.constructor
        this.__listeners__ = []
    }

    open() {
        Embedded_ListWindow.emit('open', {listwindow: this})
    }

    close() {
        this.emit("close", {listwindow: this})
    }

    setFocus() {
        this.emit("focus", {listwindow: this})
    }

    setSearchText(txt) {
        console.log("new search text: ", txt)
        function processToken(t) {
            if (t == '$user') return oo.currentUser();
            if (t == '$today') return moment().format("YYYY-MM-DD");
            return t;
        }
        this.searchText = txt;
        this.where = null
        if (txt.trim()) {
            this.where = {};
            let tokens = txt.split(' ')
            let or = {};
            for (let token of tokens) {
                if (!token.trim()) continue;
                if (token.indexOf("=") >= 0) {
                    console.log("HAS EQUAL")
                    let left = processToken(token.split("=")[0])
                    //if (left == token.split("=")[0]) left = left + '__eq';
                    let right = processToken(token.split("=")[1])
                    this.where[left] = right;
                }
                else {
                    console.log("ELSE")
                    for (let col of this.__class__.getDescription().columns) {
                        or[col.field + '__LIKE'] = '%' + token + '%';
                    }
                }
            }
            console.log("OR:", or)
            if (Object.keys(or).length) this.where['__or__'] = oo.query.or(or);
        }
    }

    async getRecords(start, count) {
        let q = this.getRecordClass().select();
        if (this.where) q.where(this.where)
        console.log("GETTING RECORDS WITH WHERE: ", this.where)
        q = q.offset(start).limit(count);
        return await q.fetch();
    }


    /*async getRecordsLength(start, count) {
        return await this.getRecordClass().select().offset(start).limit(count).fetch();
    }*/

    getSuggestedSearches() {
        return this.__class__.getDescription().suggested_searches
    }

    static tryCall(self, methodname) {
        if (methodname in this) {
            return this[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(2));
        } else {
            return Promise.resolve();
        }
    }

    static getDescription() {
        return this.__description__
    }

    inspect() {
        return "<" + this.__class__.__description__.name + ", from " + this.__class__.__description__.filename + ">"
    }

    getTitle() {
        return "List of " + this.getRecordClass().getDescription().name;
    }

    getRecordClass() {
        if (this.__class__.__recordClass__ == null && this.__class__.__description__.recordClass) {
            this.__class__.__recordClass__ = oo.classmanager.getClass(this.__class__.__description__.recordClass)
        }
        return this.__class__.__recordClass__
    }

    getWindowClass() {
        if (this.__class__.__windowClass__ == null && this.__class__.__description__.windowClass) {
            this.__class__.__windowClass__ = oo.classmanager.getClass(this.__class__.__description__.windowClass)
        }
        return this.__class__.__windowClass__
    }

}

//Embedded_ListWindow.__description__ = ListWindowDescription;
Embedded_ListWindow.__class_listeners__ = []
module.exports = Embedded_ListWindow.initClass(ListWindowDescription)