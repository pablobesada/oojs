"user strict"
var should = require('should');
var chance = new require("chance")()
var oo = require("openorange")
var query = oo.query;
var cm = oo.classmanager
var md5 = require('md5')

describe("Login", function () {
    let User = cm.getClass("User")
    it("Failed login", async () => {
        let res = await oo.login(chance.word({length: 200}), chance.word({length: 200}));
        should(res).be.false("esta permitiendo login para un usuario y claves inexistentes")
        res = await oo.login(chance.word({length: 200}), null);
        should(res).be.false("esta permitiendo login para un usuario inexistente y clave nula")
        res = await oo.login(null, null);
        should(res).be.false("esta permitiendo login para un usuario y clave nulos")
        res = await oo.login('', '');
        should(res).be.false("esta permitiendo login para un usuario y clave con string vacios")
    });

    it("Successful login", async () => {
        try {
            oo.beginTransaction()
            let u = User.new()
            u.Code = chance.word({length: 10})
            u.pass = chance.word({length: 20})
            u.Password = md5(u.pass)
            let res = await u.store();
            should(res).be.true();
            res = await oo.login(u.Code, u.Password)
            should(res).be.true()
            res = await oo.login(u.Code, u.pass)
            should(res).be.false()
            res = await oo.login(u.Code, null)
            should(res).be.false()
            res = await oo.login(u.Code, '')
            should(res).be.false()
        } finally {
            oo.rollback()
        }
    });
});