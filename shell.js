"use strict"
require("babel-polyfill");
require('source-map-support').install(); //solo debe usarse para debugging
require('continuation-local-storage'); //hay que importarlo muy rapido para que no tire warnings


global.__main__ = module
