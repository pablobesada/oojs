"use strict";
var app = require("./../../../../app")
var chance = new require("chance")()
var _ = require("underscore")
var oo = require("openorange")
let cm = oo.classmanager
var Query = oo.query;
var should = require('should');
var async = require('async')


describe('Query', function () {
    it('Select', async () => {
        let q = oo.query.select(oo.classmanager.getClass("TestRecord"))
        q.where({__or__:q.or({String_Field: '123', Integer_Field: '444'})})
        await q.fetch();
    })

});