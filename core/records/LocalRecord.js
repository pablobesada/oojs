"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cm = require('openorange').classmanager;
var _ = require("underscore");

var Description = {
    name: 'LocalRecord',
    inherits: 'Record',
    filename: __filename
};

var Parent = cm.SuperClass(Description);

var LocalRecord = function (_Parent) {
    _inherits(LocalRecord, _Parent);

    _createClass(LocalRecord, null, [{
        key: "initClass",
        value: function initClass(description) {
            _get(Object.getPrototypeOf(LocalRecord), "initClass", this).call(this, description);
            this.__storage_table_name__ = 'oo_table_' + this.__description__.name;
            this.__records__ = [];
            this.__fetched__ = false;
            return this;
        }
    }, {
        key: "getTableName",
        value: function getTableName() {
            return this.__storage_table_name__;
        }
    }, {
        key: "getAllRecords",
        value: function getAllRecords() {
            if (!this.__fetched__) this.__fetchRecords__();
            return this.__records__;
        }
    }, {
        key: "checkFetched",
        value: function checkFetched() {
            if (!this.__class__.__fetched__) this.__class__.__fetchRecords__();
        }
    }, {
        key: "__fetchRecords__",
        value: function __fetchRecords__() {
            var cls = this;
            var s = localStorage.getItem("oo_table_" + this.__description__.name);
            if (s == null) {
                s = JSON.stringify(LocalRecord.records);
                localStorage.setItem(this.getTableName(), s);
            }
            //var records =  _(result.response).map(function (jsonrec) {return Record.fromJSON(jsonrec)})
            var json = JSON.parse(s);
            this.__records__ = _(json).map(function (jsonrec) {
                return cls.fromJSON(jsonrec);
            });
            this.__fetched__ = true;
        }
    }, {
        key: "__updateStorage__",
        value: function __updateStorage__() {
            var cls = this;
            var s = JSON.stringify(_(cls.__records__).map(function (rec) {
                return rec.toJSON();
            }));
            localStorage.setItem(this.getTableName(), s);
        }
    }]);

    function LocalRecord() {
        _classCallCheck(this, LocalRecord);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(LocalRecord).call(this));
    }

    _createClass(LocalRecord, [{
        key: "load",
        value: function load() {
            var records = this.__class__.getAllRecords();
            var whereClause = {};
            for (var i in this.fieldNames()) {
                var fn = this.fieldNames()[i];
                if (this[fn] != null) whereClause[fn] = this[fn];
            }
            if (whereClause == {}) return false;
            for (var _i in records) {
                var record = records[_i];
                var found = true;
                for (var _fn in whereClause) {
                    if (record[_fn] != whereClause[_fn]) {
                        found = false;
                        break;
                    }
                }
                if (found) {
                    LocalRecord.fromJSON(record.toJSON(), this); //medio feo, pero efectivo
                    this.syncOldFields();
                    return true;
                }
            }
            return false;
        }
    }, {
        key: "store",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var records, updated, i;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(!this.isNew() && !this.isModified())) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt("return", true);

                            case 2:
                                records = this.__class__.getAllRecords();

                                if (!this.isNew()) {
                                    _context.next = 10;
                                    break;
                                }

                                records.push(this);
                                this.internalId = records.length;
                                this.syncVersion++;
                                this.setNewFlag(false);
                                _context.next = 24;
                                break;

                            case 10:
                                updated = false;
                                i = 0;

                            case 12:
                                if (!(i < records.length)) {
                                    _context.next = 21;
                                    break;
                                }

                                if (!(records[i].internalId == this.internalId)) {
                                    _context.next = 18;
                                    break;
                                }

                                this.syncVersion++;
                                records[i] = this;
                                updated = true;
                                return _context.abrupt("break", 21);

                            case 18:
                                i++;
                                _context.next = 12;
                                break;

                            case 21:
                                if (updated) {
                                    _context.next = 24;
                                    break;
                                }

                                console.log("No se pudo actualizar el registro local", this);
                                return _context.abrupt("return", false);

                            case 24:
                                this.__class__.__records__ = records;
                                this.__class__.__updateStorage__();
                                this.syncOldFields();
                                return _context.abrupt("return", true);

                            case 28:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function store() {
                return ref.apply(this, arguments);
            }

            return store;
        }()
    }, {
        key: "save",
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                return _context2.abrupt("return", _get(Object.getPrototypeOf(LocalRecord.prototype), "save", this).call(this));

                            case 1:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function save() {
                return ref.apply(this, arguments);
            }

            return save;
        }()
    }]);

    return LocalRecord;
}(Parent);

module.exports = LocalRecord.initClass(Description);

//# sourceMappingURL=LocalRecord.js.map