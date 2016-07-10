"use strict";
var app = require("./../../../../app")
var chance = new require("chance")()
var _ = require("underscore")
var oo = require("openorange")
var Query = oo.query;
var cm = oo.classmanager
var should = require('should');
var async = require('async')


describe('BaseEntity', function () {
    it('Events', async () => {
        let e = oo.BaseEntity.new()
        let calls = 0
        let f1 =  function (event) {
            console.log(this.__class__)
            should(this === e).ok()
            should(event.a).equal(6);
            should(event.b).equal(7);
            should(event.c).equal(8);
            should(event._meta.name).equal('test event');
            calls++;
        }
        let f2 =  function (event) {
            console.log(this)
            should(this === e).ok()
            should(event.a).equal(6);
            should(event.b).equal(7);
            should(event.c).equal(8);
            should(event._meta.name).equal('test event');
            calls++;
        }

        e.on('test event',f1)
        e.on('test event', f2)
        e.on('other event', function (event) {
            calls++;
        })
        e.emit('test event', {a:6,b:7,c:8})
        calls.should.be.equal(2)
        e.off('test event', f1)
        e.off('test event', f2)
        e.emit('test event', {a:6,b:7,c:8})
        calls.should.be.equal(2)

    })
    it('Events Any', async () => {
        let e = oo.BaseEntity.new()
        let calls = 0
        let f1 =  function (event) {
            console.log(this)
            should(this === e).ok()
            should(event.a).equal(6);
            should(event.b).equal(7);
            should(event.c).equal(8);
            should(event._meta.name == 'test event' || event._meta.name == 'other event').ok()
            calls++;
        }
        e.onAny(f1)
        e.emit('test event', {a:6,b:7,c:8})
        e.emit('test event', {a:6,b:7,c:8})
        e.emit('test event', {a:6,b:7,c:8})
        calls.should.be.equal(3)
        e.offAny(f1)
        e.emit('test event', {a:6,b:7,c:8})
        e.emit('other event', {a:6,b:7,c:8})
        calls.should.be.equal(3)

    })
});