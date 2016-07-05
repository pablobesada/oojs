"use strict";
let fs = require("fs")
let path = require("path")
let _ = require('underscore')


var walk = function (dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    for (let i = 0; i < list.length; i++) {
        var fn = list[i];
        if (fn == "node_modules" || fn == "bower_components" || fn.startsWith(".")) continue;
        var fullpath = dir + '/' + fn;
        let stat = fs.statSync(fullpath);
        if (stat.isDirectory()) {
            results = results.concat(walk(fullpath))
        } else {
            if (fn.endsWith(".js")) {
                if (list.indexOf(path.basename(fn, '.js') + ".es6") >= 0) {
                    results.push(fullpath);
                }
            } else if (fn.endsWith('.js.map')) {
                results.push(fullpath);
            } else if (fn.endsWith(".html")) {
                if (list.indexOf(path.basename(fn, '.html') + ".jade") >= 0) {
                    results.push(fullpath);
                }
            } else if (fn.endsWith(".css")) {
                if (list.indexOf(path.basename(fn, '.css') + ".scss") >= 0) {
                    results.push(fullpath);
                }
            }
        }
    }
    return results
}

function run() {

    _(walk(".")).forEach((fn) => {
        console.log(fn)
        //require('child_process').execSync("git rm " + fn);
    });





}


run();