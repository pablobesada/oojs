'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

//console.log("en Master.js 4: current filename: " + __filename)

var cm = require('openorange').classmanager;
//console.log("en Master.js 5: current filename: " + __filename)

var Description = {
    name: 'Master',
    inherits: 'Record',
    fields: {
        Code: { type: "string", length: 30 },
        Name: { type: "string", length: 100 }
    }
};

var Master = cm.createClass(Description, __filename);
Master.init = function init() {
    Master.__super__.init.call(this);
    return this;
};

Master.inspect = function inspect() {
    return "<" + this.__description__.name + " " + this.Code + ">";
};

Master.bring = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(Code) {
        var rec, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        rec = this.new();

                        rec.Code = Code;
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

module.exports = Master;

//# sourceMappingURL=Master.js.map