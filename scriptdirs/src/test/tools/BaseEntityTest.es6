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
    it("Class Events", async () => {
        let Record = cm.getClass("Record")
        let BaseEntity = oo.BaseEntity
        let Embedded_Record = cm.getClass("Embedded_Record");
        let Embedded_Report = cm.getClass("Embedded_Report");
        let calls=0;
        Embedded_Record.on('myevent', function (e) {
            should(e.receivers.indexOf(this.__description__.name) >= 0).ok('No deberia haberse recibido este evento')
            calls++;
        })
        Embedded_Report.on('myevent', function (e) {
            should(e.receivers.indexOf(this.__description__.name) >= 0).ok('No deberia haberse recibido este evento')
            calls++;
        })
        BaseEntity.on('myevent', function (e) {
            should(e.receivers.indexOf(this.__description__.name) >= 0).ok('No deberia haberse recibido este evento')
            calls++;
        })
        Record.on('myevent', function (e) {
            should(e.receivers.indexOf(this.__description__.name) >= 0).ok('No deberia haberse recibido este evento')
            calls++;
        })
        let expected_calls = 0
        let emit = function emit(cls, receivers) {
            expected_calls += receivers.length;
            cls.emit('myevent', {receivers: receivers})
        }
        emit(BaseEntity, ['BaseEntity'])
        emit(Embedded_Record, ['BaseEntity', 'Embedded_Record'])
        emit(Record, ['BaseEntity', 'Embedded_Record', 'Record'])
        emit(Embedded_Report, ['BaseEntity', 'Embedded_Report'])
        calls.should.be.equal(expected_calls)
    })
    it('Parent.TryCall',async ()=> {
        //SYNC
        let cls2 = cm.getClass("TestRecord2")
        let rec2 = cls2.new().fillWithRandomValues()
        let res = rec2.__class__.__super__.tryCall(rec2, 333, 'tryCallTestSync', 20,40)
        res.should.be.equal(cm.getClass("TestRecord").new().tryCallTestSync(20,40))
        res = rec2.__class__.__super__.tryCall(rec2, 333, 'inexistentMethod',20,40)
        res.should.be.equal(333)
        //ASYNC

        res = await rec2.__class__.__super__.tryCall(rec2, 333, 'tryCallTestAsync',20,40)
        res.should.be.equal(await cm.getClass("TestRecord").new().tryCallTestAsync(20,40))
        res = await rec2.__class__.__super__.tryCall(rec2, 333, 'inexistentMethod',20,40)
        res.should.be.equal(333)

    })
});