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
        let f1 =  function (a,b,c,ename,d) {
            console.log(this)
            should(this === e).ok()
            should(a).equal(6);
            should(b).equal(7);
            should(c).equal(8);
            should(ename).equal('test event');
            should(d).undefined();
            calls++;
        }
        let f2 =  function (a,b,c,ename, d) {
            console.log(this)
            should(this === e).ok()
            should(a).equal(6);
            should(b).equal(7);
            should(c).equal(8);
            should(ename).equal('test event');
            should(d).undefined();
            calls++;
        }

        e.on('test event',f1)
        e.on('test event', f2)
        e.on('other event', function (a,b,c,d,e) {
            calls++;
        })
        e.emit('test event', 6,7,8)
        calls.should.be.equal(2)
        e.off('test event', f1)
        e.off('test event', f2)
        e.emit('test event', 6,7,8)
        calls.should.be.equal(2)

    })
    it('Events Any', async () => {
        let e = oo.BaseEntity.new()
        let calls = 0
        let f1 =  function (a,b,c,ename,d) {
            console.log(this)
            should(this === e).ok()
            should(a).equal(6);
            should(b).equal(7);
            should(c).equal(8);
            should(ename == 'test event' || ename == 'other event').ok()
            should(d).undefined();
            calls++;
        }
        e.onAny(f1)
        e.emit('test event', 6,7,8)
        e.emit('test event', 6,7,8)
        e.emit('other event', 6,7,8)
        calls.should.be.equal(3)
        e.offAny(f1)
        e.emit('test event', 6,7,8)
        e.emit('other event', 6,7,8)
        calls.should.be.equal(3)

    })
});