"use strict";
//var app = require("./../../app")

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var chance = new require("chance")();
var _ = require("underscore");
var oo = require("openorange");
var query = oo.query;
var cm = oo.classmanager;
var should = require('should');
var async = require('async');
var moment = require('moment');
var utils = null;

describe("Embedded_Record", function () {
    var _this = this;

    var cls = cm.getClass("TestRecord");
    var cls2 = cm.getClass("TestRecord2");
    var rec = null;
    var original_rec = null;

    beforeEach(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return oo.beginTransaction();

                    case 2:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this);
    })));
    after(_asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return oo.commit();

                    case 2:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    })));

    it("create new record and set some field values", _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var now;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        rec = cls.new();
                        rec.String_Field = 'ABCD';
                        now = moment([2014, 4 - 1, 3]);

                        rec.Date_Field = now;
                        should(rec.String_Field).be.equal('ABCD');
                        should(rec.Date_Field.isSame(now)).ok();

                    case 6:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, _this);
    })));

    it("Linkto fields must get its length from the linked record", _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var linkto_class;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        rec = cls.new();
                        linkto_class = rec.fields("LinkTo_Field").getLinktoRecordClass();

                        should(rec.fields("LinkTo_Field").getMaxLength()).be.equal(linkto_class.getDescription().fields[linkto_class.uniqueKey()[0]].length);
                        should(rec.fields("String_Field").getMaxLength()).be.equal(cls.getDescription().fields.String_Field.length);

                    case 4:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, _this);
    })));

    it("create new record and store it", _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var res;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        rec = cls.new().fillWithRandomValues();
                        _context5.next = 3;
                        return rec.store();

                    case 3:
                        res = _context5.sent;

                        res.should.be.true();
                        original_rec = rec.clone();

                    case 6:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, _this);
    })));

    it("control for non-persistent fields", _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var row, res, loaded_rec;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        rec = cls.new().fillWithRandomValues();
                        rec.NonPersistent_Field = "esto no deberia persistir";
                        row = rec.NonPersistent_Rows.newRow();

                        cls.fillRecordWithRandomValues(row);
                        rec.NonPersistent_Rows.push(row);
                        _context6.next = 7;
                        return rec.store();

                    case 7:
                        res = _context6.sent;

                        res.should.be.true();
                        _context6.next = 11;
                        return cls.findOne({ internalId: rec.internalId });

                    case 11:
                        loaded_rec = _context6.sent;

                        should(loaded_rec.NonPersistent_Field).be.null();
                        should(loaded_rec.Rows.length).be.greaterThan(0);
                        should(loaded_rec.NonPersistent_Rows.length).be.equal(0);

                    case 15:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, _this);
    })));

    it("load", _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        var res;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        rec = cls.new();
                        rec.internalId = original_rec.internalId;
                        rec.Date_Field = original_rec.Date_Field;
                        console.log(original_rec.Date_Field);
                        _context7.next = 6;
                        return rec.load();

                    case 6:
                        res = _context7.sent;

                        res.should.be.true("no se grabo");
                        original_rec.syncOldFields();
                        rec.isEqual(original_rec).should.be.true("registros diferentes");

                    case 10:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, _this);
    })));

    it("Concurrent store (storing with old syncVersion)", _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        var r1, r2;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return cls.newSavedRecord();

                    case 2:
                        r1 = _context8.sent;
                        _context8.next = 5;
                        return cls.findOne({ internalId: r1.internalId });

                    case 5:
                        r2 = _context8.sent;

                        should(r1.isEqual(r2)).be.true();
                        r1.String_Field = 'r1';
                        r1.Integer_Field++;
                        _context8.next = 11;
                        return r1.store();

                    case 11:
                        _context8.t0 = _context8.sent;
                        should(_context8.t0).ok();

                        r2.Integer_Field--;
                        r2.String_Field = 'r2';
                        _context8.next = 17;
                        return r2.store();

                    case 17:
                        _context8.t1 = _context8.sent;
                        should(_context8.t1).not.ok();

                    case 19:
                    case "end":
                        return _context8.stop();
                }
            }
        }, _callee8, _this);
    })));

    it("Detail integrity against master syncVersion", _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
        var r1, r2;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return cls.newSavedRecord();

                    case 2:
                        r1 = _context9.sent;
                        _context9.next = 5;
                        return cls.findOne({ internalId: r1.internalId });

                    case 5:
                        r2 = _context9.sent;

                        should(r1.isEqual(r2)).be.true();
                        console.log(r1);
                        console.log(r1.Rows);
                        console.log(r1.Rows.length);
                        r1.Rows[0].Integer_Field++;
                        _context9.next = 13;
                        return r1.store();

                    case 13:
                        _context9.t0 = _context9.sent;
                        should(_context9.t0).ok();

                        r2.Rows[0].Integer_Field--;
                        _context9.next = 18;
                        return r2.store();

                    case 18:
                        _context9.t1 = _context9.sent;
                        should(_context9.t1).not.ok();

                    case 20:
                    case "end":
                        return _context9.stop();
                }
            }
        }, _callee9, _this);
    })));

    it("Save new OK", _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        rec = cls.new().fillWithRandomValues();
                        _context10.next = 3;
                        return rec.save();

                    case 3:
                        _context10.t0 = _context10.sent;
                        should(_context10.t0).be.true("El save no grabo");
                        _context10.t1 = should;
                        _context10.next = 8;
                        return cls.findOne({ internalId: rec.internalId, Integer_Field: rec.Integer_Field });

                    case 8:
                        _context10.t2 = _context10.sent;

                        _context10.t1.exist.call(_context10.t1, _context10.t2, "El save devolvio true, pero el registro no esta en la DB");

                    case 10:
                    case "end":
                        return _context10.stop();
                }
            }
        }, _callee10, _this);
    })));

    it("Save with Check fail", _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
        var internalId, res;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        internalId = rec.internalId;
                        _context11.next = 3;
                        return cls.findOne({ internalId: rec.internalId });

                    case 3:
                        rec = _context11.sent;

                        should.exist(rec);
                        rec.checkReturnValue = false;
                        rec.Integer_Field++;
                        _context11.next = 9;
                        return rec.save();

                    case 9:
                        res = _context11.sent;

                        res.should.be.false("El save grabo y no deberia haberse grabado");
                        _context11.t0 = should.not;
                        _context11.next = 14;
                        return cls.findOne({ internalId: rec.internalId, Integer_Field: rec.Integer_Field });

                    case 14:
                        _context11.t1 = _context11.sent;

                        _context11.t0.exist.call(_context11.t0, _context11.t1, "El save devolvio false, pero igual grabo el registro");

                    case 16:
                    case "end":
                        return _context11.stop();
                }
            }
        }, _callee11, _this);
    })));

    it("Save with beforeInsert fail", _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
        var rec, i, record, res, _i, _record;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        rec = cls.new().fillWithRandomValues();

                        rec.beforeInsertReturnValue = false;
                        for (i = 0; i < 3; i++) {
                            record = cls.new().fillWithRandomValues();

                            record.SubTestName = "Save with beforeInsert fail";
                            rec.beforeInsert_recordsToStore.push(record);
                        }
                        rec.SubTestName = 'PARENT';
                        _context12.next = 6;
                        return rec.save();

                    case 6:
                        res = _context12.sent;

                        should(res).be.false("No deberia haber grabado");
                        _context12.t0 = should.not;
                        _context12.next = 11;
                        return cls.findOne({ String_Field: rec.String_Field });

                    case 11:
                        _context12.t1 = _context12.sent;

                        _context12.t0.exist.call(_context12.t0, _context12.t1, "El save devolvio false, pero igual grabo el registro");

                        _context12.t2 = regeneratorRuntime.keys(rec.beforeInsert_recordsToStore);

                    case 14:
                        if ((_context12.t3 = _context12.t2()).done) {
                            _context12.next = 24;
                            break;
                        }

                        _i = _context12.t3.value;
                        _record = rec.beforeInsert_recordsToStore[_i];
                        _context12.t4 = should.not;
                        _context12.next = 20;
                        return cls.findOne({ internalId: _record.internalId, String_Field: _record.String_Field });

                    case 20:
                        _context12.t5 = _context12.sent;

                        _context12.t4.exist.call(_context12.t4, _context12.t5, "El save devolvio false, pero igual grabo registros dentro del beforeInsert");

                        _context12.next = 14;
                        break;

                    case 24:
                    case "end":
                        return _context12.stop();
                }
            }
        }, _callee12, _this);
    })));

    it("Save with beforeUpdate fail", _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
        var rec, res;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        rec = cls.new();

                        utils.fillRecord(rec);
                        rec.beforeUpdateReturnValue = false;

                        _context13.next = 5;
                        return rec.save();

                    case 5:
                        res = _context13.sent;

                        should(res).be.true("Deberia haber grabado");
                        rec.Integer_Field++;

                        _context13.next = 10;
                        return rec.save();

                    case 10:
                        res = _context13.sent;


                        should(res).be.false("No Deberia haber grabado");
                        _context13.t0 = should.not;
                        _context13.next = 15;
                        return cls.findOne({ internalId: rec.internalId, Integer_Field: rec.Integer_Field });

                    case 15:
                        _context13.t1 = _context13.sent;

                        _context13.t0.exist.call(_context13.t0, _context13.t1, "El save devolvio false, pero igual grabo el registro");

                    case 17:
                    case "end":
                        return _context13.stop();
                }
            }
        }, _callee13, _this);
    })));

    it("Check if it makes rollback when storing record with wrong fields", _asyncToGenerator(regeneratorRuntime.mark(function _callee14() {
        var rec, i, record, res;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        //cls.__description__.fields['DUMMY'] = {type: "string", length: 30}
                        //cls.__description__.fieldnames.push("DUMMY")
                        rec = cls.new().fillWithRandomValues();

                        rec.beforeInsertReturnValue = false;
                        rec.SubTestName = 'TEST';
                        for (i = 0; i < 3; i++) {
                            record = cls2.new().fillWithRandomValues();

                            record.SubTestName = rec.SubTestName;
                            rec.beforeInsert_recordsToStore.push(record);
                        }
                        _context14.next = 6;
                        return rec.save();

                    case 6:
                        res = _context14.sent;

                    case 7:
                    case "end":
                        return _context14.stop();
                }
            }
        }, _callee14, _this);
    })));

    it("delete record", _asyncToGenerator(regeneratorRuntime.mark(function _callee15() {
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                    case "end":
                        return _context15.stop();
                }
            }
        }, _callee15, _this);
    })));

    //should(true).be.false()
    it("delete record check details and sets are gone", _asyncToGenerator(regeneratorRuntime.mark(function _callee16() {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
                switch (_context16.prev = _context16.next) {
                    case 0:
                    case "end":
                        return _context16.stop();
                }
            }
        }, _callee16, _this);
    })));

    //should(true).be.false()
    it("check sets behaviour (adding, changing, deleting)", _asyncToGenerator(regeneratorRuntime.mark(function _callee19() {
        var checkSetField = function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee17(rec, fn) {
                var setvalues, response, rset, i;
                return regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                setvalues = _(rec[fn].split(",")).map(function (v) {
                                    return v.trim();
                                });
                                _context17.next = 3;
                                return oo.getDBConnection();

                            case 3:
                                _context17.t0 = "SELECT Value FROM " + rec.fields(fn).setrecordname + " WHERE masterId=?";
                                _context17.t1 = [rec.internalId];
                                _context17.next = 7;
                                return _context17.sent.query(_context17.t0, _context17.t1);

                            case 7:
                                response = _context17.sent;
                                rset = response[0];

                                should(rset.length).be.equal(setvalues.length);
                                for (i = 0; i < setvalues.length; i++) {
                                    should(rset[i].Value).be.equal(setvalues[i]);
                                }

                            case 11:
                            case "end":
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            return function checkSetField(_x, _x2) {
                return ref.apply(this, arguments);
            };
        }();

        var checkSetFieldDeleted = function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee18(rec, fn) {
                var response, rset;
                return regeneratorRuntime.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                _context18.next = 2;
                                return oo.getDBConnection();

                            case 2:
                                _context18.t0 = "SELECT COUNT(*) as CNT FROM " + rec.fields(fn).setrecordname + " WHERE masterId=?";
                                _context18.t1 = [rec.internalId];
                                _context18.next = 6;
                                return _context18.sent.query(_context18.t0, _context18.t1);

                            case 6:
                                response = _context18.sent;
                                rset = response[0];

                                should(rset[0].CNT).be.equal(0);

                            case 9:
                            case "end":
                                return _context18.stop();
                        }
                    }
                }, _callee18, this);
            }));

            return function checkSetFieldDeleted(_x3, _x4) {
                return ref.apply(this, arguments);
            };
        }();
        //Aca empieza: creo un registro y le seteo el Set_Field al encabezado y a las filas. Luego lo grabo y compruebo que se hayan creado bien los registros set asociados
        //A su vez luego de chequear, modifico los campos sets para la siguiente comprobacion, elimino la primera fila y agrego una nueva al final


        var res, i, row, removed_row, _i2, _row, removed_recs, _i3;

        return regeneratorRuntime.wrap(function _callee19$(_context19) {
            while (1) {
                switch (_context19.prev = _context19.next) {
                    case 0:
                        rec = cls.new().fillWithRandomValues();
                        _context19.next = 3;
                        return rec.store();

                    case 3:
                        res = _context19.sent;

                        res.should.be.true();
                        _context19.next = 7;
                        return checkSetField(rec, 'Set_Field');

                    case 7:
                        rec.Set_Field = chance.sentence({ words: 2 }).replace(/ /g, ",").replace(/\./g, "");
                        i = 0;

                    case 9:
                        if (!(i < rec.Rows.length)) {
                            _context19.next = 17;
                            break;
                        }

                        row = rec.Rows[i];
                        _context19.next = 13;
                        return checkSetField(row, 'Set_Field');

                    case 13:
                        row.Set_Field = chance.sentence({ words: 3 }).replace(/ /g, ",").replace(/\./g, "");

                    case 14:
                        i++;
                        _context19.next = 9;
                        break;

                    case 17:
                        removed_row = rec.Rows[0];

                        rec.Rows.splice(0, 1);
                        rec.Rows.push(cls.fillRecordWithRandomValues(rec.Rows.newRow()));
                        //grabo nuevamente el registro sin la primera fila y con una nueva fila al final. Con todos los campos Set_Field modificados (encabezado y filas)
                        //compruebo que los registros asociados esten correctos (que se hayan borrado todos y creado solo los modificados y nuevos)
                        _context19.next = 22;
                        return rec.store();

                    case 22:
                        res = _context19.sent;

                        res.should.be.true();
                        _context19.next = 26;
                        return checkSetField(rec, 'Set_Field');

                    case 26:
                        _i2 = 0;

                    case 27:
                        if (!(_i2 < rec.Rows.length)) {
                            _context19.next = 34;
                            break;
                        }

                        _row = rec.Rows[_i2];
                        _context19.next = 31;
                        return checkSetField(_row, 'Set_Field');

                    case 31:
                        _i2++;
                        _context19.next = 27;
                        break;

                    case 34:
                        _context19.next = 36;
                        return checkSetFieldDeleted(removed_row, 'Set_Field');

                    case 36:
                        //Ahora guardo en una lista todos los registros grabados en DB: encabezado y rows. Luego borro el registro
                        //Compruebo que efectivamete todos los registros asociados a encabezado y rows se eliminaron
                        removed_recs = _(rec.Rows).map(function (r) {
                            return r;
                        });

                        removed_recs.push(rec);
                        _context19.next = 40;
                        return rec.delete();

                    case 40:
                        res = _context19.sent;
                        _i3 = 0;

                    case 42:
                        if (!(_i3 < removed_recs.length)) {
                            _context19.next = 48;
                            break;
                        }

                        _context19.next = 45;
                        return checkSetFieldDeleted(removed_recs[_i3], 'Set_Field');

                    case 45:
                        _i3++;
                        _context19.next = 42;
                        break;

                    case 48:
                    case "end":
                        return _context19.stop();
                }
            }
        }, _callee19, _this);
    })));
});

module.exports = function config(utilsModule) {
    utils = utilsModule;
};

//# sourceMappingURL=Embedded_RecordTest.js.map