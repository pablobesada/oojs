"use strict"
async function aa() {
    return [1,2]
}


async function pepe(){
    var [a, b] = await aa()
    console.log(b)
}

pepe();