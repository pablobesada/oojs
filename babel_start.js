"use strict";
require('babel-register')({
    ignore: /node_modules\/(?!openorange)/
});
require("babel-polyfill");
require("./server")