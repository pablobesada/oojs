"use strict"
require('source-map-support').install();


async function aa() {
    return 1
}


async function pepe(){
    var b = await aa()
    console.log(b)
}

a.b.c = 5
pepe();
