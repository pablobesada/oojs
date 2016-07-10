"use strict";
require("babel-polyfill");
require('source-map-support').install(); //solo debe usarse para debugging
require('continuation-local-storage'); //hay que importarlo muy rapido para que no tire warnings
//var app = require("./app")
global.__main__ = module
var oo = require("openorange")

oo.init()



class A {}

class B extends A {}

class C extends B {}

class NO {}

//console.log(B.prototype)
console.log(new NO() instanceof A)