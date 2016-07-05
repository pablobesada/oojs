"use strict";
let fs = require("fs")
let path = require("path")
let _ = require('underscore')


var getArtifactList = function (dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    for (let i = 0; i < list.length; i++) {
        var fn = list[i];
        if (fn == "node_modules" || fn == "bower_components" || fn.startsWith(".")) continue;
        var fullpath = dir + '/' + fn;
        let stat = fs.statSync(fullpath);
        if (stat.isDirectory()) {
            results = results.concat(getArtifactList(fullpath))
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

var getSourceList = function (dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    for (let i = 0; i < list.length; i++) {
        var fn = list[i];
        if (fn == "node_modules" || fn == "bower_components" || fn.startsWith(".")) continue;
        var fullpath = dir + '/' + fn;
        let stat = fs.statSync(fullpath);
        if (stat.isDirectory()) {
            results = results.concat(getSourceList(fullpath))
        } else {
            if (fn.endsWith(".es6")) {
                results.push(fullpath);
            }
        }
    }
    return results
}

function run() {

/*
    _(getArtifactList(".")).forEach((fn) => {
        console.log(fn)
        try {
            require('child_process').execSync("git rm " + fn);
        } catch (err) {
            require('child_process').execSync("rm " + fn);
        }
    });
*/
/*
    _(getSourceList(".")).forEach((fn) => {
        console.log(fn)
        let command = "node_modules/.bin/babel --source-maps --out-file " + fn.substring(0, fn.length - 4) + ".js " + path.dirname(fn);
        console.log(command)
        require('child_process').exec(command, function (error, stdout, stderr) {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            //console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    });
*/

}


run();