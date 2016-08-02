"use strict";
require("babel-polyfill");
require('source-map-support').install(); //solo debe usarse para debugging
require('continuation-local-storage'); //hay que importarlo muy rapido para que no tire warnings
let Promise = require('bluebird')
//var app = require("./app")
global.__main__ = module
var oo = require("openorange")
var cm = oo.classmanager
oo.init()


function getItems(start ,count) {
    console.log('fetching items: ', start, 'to', start+count-1, " (" +count+ ")")
    var promise = Promise.pending();
    var res = [];
    for (var i=start;i<start+count;i++) res.push('Item ' + i);
    setTimeout(function () {promise.resolve(res)}, 200);
    return promise.promise
}


function RemoteArray(source) {
    this.items = [];
    this.start = 0;
    this.bufferlength = 60;
    this.fetching = null;
    this.fetching_start = null;
    this.fetching_count = null;
    this.last_fetch_id = 1;
    this.waiters = {};
    this.waiter_ids = 1;
    this.source = source;
}

RemoteArray.prototype.length = function () {
        return 50;
    }

RemoteArray.prototype.ensure = function(start, count) {
    let self = this;
    //let promise = Promise.pending();
    this.fetching = true;
    this.fetching_start = start;
    this.fetching_count = count;
    this.last_fetch_id++;
    let fetch_id = this.last_fetch_id;
    this.source(start, count)
        .then(function (items) {
            self.start = start;
            self.items = items;
            if (fetch_id == self.last_fetch_id) {
                self.fetching = false;
                self.fetching_start = false;
                self.fetching_count = false;
            }
            //promise.resolve({start:start, count:count, items:items})
            for (let i in self.waiters) self.waiters[i].onResponse({start:start, count:count, items:items});

        })
    //return promise.promise;
}

RemoteArray.prototype.get = function (idx) {
    let self = this;
    let promise = Promise.pending();
    if (idx < this.start || idx >= this.start + this.items.length) {
        if (!this.fetching || idx < this.fetching_start || idx >= this.fetching_start + this.fetching_count) {
            let start = Math.max(Math.round(idx - this.bufferlength / 3), 0); //traigo 1/3 para atras y 2/3 para adelante
            let count = this.bufferlength;
            //console.log("calling ensure", start, count)
            this.ensure(start, count)
        }
        let waiter_id = self.waiter_ids++;
        let waiter = {onResponse: function (data) {
            //console.log("received waited item", idx, data.start, data.count)
            if (idx >= data.start && idx < data.start + data.count) {
                //console.log("removing waiter")
                delete self.waiters[waiter_id]
                promise.resolve(data.items[idx - data.start])
            }
        }}
        this.waiters[waiter_id] = waiter;
    } else {
        promise.resolve(this.items[idx - this.start])
    }
    return promise.promise;
}



let a = new RemoteArray(getItems);
console.log(a.length())
/*
a.get(354)
    .then(function (item) {
        console.log("x354", item)
        a.printItems()
    })
a.get(355)
    .then(function (item) {
        console.log("x355", item)
        a.printItems()
    })

a.get(230)
    .then(function (item) {
        console.log("x230", item)
        a.printItems()
    })
 */

for (let i=0;i<2000;i++){
    a.get(i)
        .then(function (item) { console.log(item)})
}
