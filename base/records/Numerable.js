"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var cm = require('openorange').classmanager;

var Description = {
    name: 'Numerable',
    inherits: 'Record',
    fields: {
        SerNr: { type: "integer" }
    }
};

var Numerable = cm.createClass(Description, __filename);

Numerable.init = function init() {
    Numerable.__super__.init.call(this);
    return this;
};

Numerable.bring = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(SerNr) {
        var rec, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        rec = this.new();

                        rec.SerNr = SerNr;
                        _context.next = 4;
                        return rec.load();

                    case 4:
                        res = _context.sent;

                        if (!res) {
                            _context.next = 7;
                            break;
                        }

                        return _context.abrupt('return', rec);

                    case 7:
                        return _context.abrupt('return', null);

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function bring(_x) {
        return ref.apply(this, arguments);
    }

    return bring;
}();

Numerable.fieldIsEditable = function fieldIsEditable(fieldname, rowfieldname, rowNr) {
    var self = this;
    var res = Numerable.super("fieldIsEditable", self, fieldname, rowfieldname, rowNr);
    if (!res) return res;
    if (fieldname == 'SerNr' && self.SerNr == 444) return false;
    return true;
};

module.exports = Numerable;

//# sourceMappingURL=Numerable.js.map