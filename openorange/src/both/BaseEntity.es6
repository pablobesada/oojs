"use strict"

let Descriptor = {
    name: "BaseEntity",
    filename: "entity.js",
    actions: []
}

let EventEmitter = {}
let _oo = null;
let getOO = function getOO() {
    if (!_oo) _oo = require("openorange");
    return _oo;
}

EventEmitter.emit = function emit(eventName, event) {
    event = this.newEvent(eventName, event);
    if (eventName in this.__ev__) {
        for (let i = 0; i < this.__ev__[eventName].length; i++) {
            this.__ev__[eventName][i].call(this, event);
        }
    }
    for (let i=0;i<this.__anyev__.length; i++) {
        this.__anyev__[i].call(this, event);
    }
}

EventEmitter.classEmit = function classEmit(eventName, event) {
    event = this.newEvent(eventName, event);
    let cls = this;
    while (cls != null) {
        if (eventName in cls.__ev__) {
            for (let i = 0; i < cls.__ev__[eventName].length; i++) {
                cls.__ev__[eventName][i].call(this, event);
            }
        }
        for (let i = 0; i < cls.__anyev__.length; i++) {
            cls.__anyev__[i].call(this, event);
        }
        cls = cls.__super__
    }
}

EventEmitter.on = function on(eventName, cb) {
    if (!(eventName in this.__ev__)) this.__ev__[eventName] = []
    this.__ev__[eventName].push(cb);
}


EventEmitter.onAny = function onAny(cb) {
    this.__anyev__.push(cb);
}

EventEmitter.off = function off(eventName, cb) {
    if (!(eventName in this.__ev__)) return;
    let idx = this.__ev__[eventName].indexOf(cb)
    if (idx >= 0) this.__ev__[eventName].splice(idx, 1)
}

EventEmitter.offAny = function offAny(cb) {
    let idx = this.__anyev__.indexOf(cb)
    if (idx >= 0) this.__anyev__.splice(idx, 1)
}


EventEmitter.newEvent = function newEvent(eventName, data) {
    if (!data) data = {};
    data._meta = {user: getOO().currentUser(), name: eventName}
    return data
}

class BaseEntity {

    static new() {
        return new this();
    }

    static createFromDescription(description) {
        class AnonymousClass extends getOO().classmanager.getClass(description.inherits) {

        }
        AnonymousClass.initClass(description)
        return new AnonymousClass();
    }

    static initClass(Descriptor) {
        //console.log("en initClass de BaseEntity. Called for ", new this(), Descriptor.name)
        this.__super__ = Reflect.getPrototypeOf(this);
        this.__ev__ = {}
        this.__anyev__ = []
        this.emit = EventEmitter.classEmit.bind(this);
        this.on = EventEmitter.on.bind(this);
        this.onAny = EventEmitter.onAny.bind(this);
        this.off = EventEmitter.off.bind(this);
        this.offAny = EventEmitter.offAny.bind(this);
        this.newEvent = EventEmitter.newEvent.bind(this)
        return this;
    }

    static tryCall(self, defaultResponse, methodname) {
        if (methodname == null) throw new Error("methodname can not be null")
        if (methodname in this.prototype) {
            return this.prototype[methodname].apply(self, Array.prototype.slice.apply(arguments).slice(3));
        } else {
            return defaultResponse;
        }
    }

    static getDescription() {
        return this.__description__
    }

    constructor() {
        this.__class__ = this.constructor
        this.__ev__ = {}
        this.__anyev__ = []
        this.emit = EventEmitter.emit.bind(this);
        this.on = EventEmitter.on.bind(this);
        this.onAny = EventEmitter.onAny.bind(this);
        this.off = EventEmitter.off.bind(this);
        this.offAny = EventEmitter.offAny.bind(this);
        this.newEvent = EventEmitter.newEvent.bind(this)
    }

    inspect() {
        return "<" + this.__class__.__description__.name + ", from " + this.__class__.__description__.filename + ">"
    }

    async callAction(actiondef) {
        if (this[actiondef.method]) return this[actiondef.method]();
    }

    isActionRelevant(actiondef) {
        return true;
    }
}

//BaseEntity.__super__ = null;

//BaseEntity.__ev__ = {}
//BaseEntity.__anyev__ = []
//BaseEntity.emit = EventEmitter.emit.bind(BaseEntity);
//BaseEntity.on = EventEmitter.on.bind(BaseEntity);
//BaseEntity.onAny = EventEmitter.onAny.bind(BaseEntity);
//BaseEntity.off = EventEmitter.off.bind(BaseEntity);
//BaseEntity.offAny = EventEmitter.offAny.bind(BaseEntity);
//BaseEntity.newEvent = EventEmitter.newEvent.bind(BaseEntity);

let BaseEntityClass = BaseEntity.initClass(Descriptor)
BaseEntity.__description__ = Descriptor
BaseEntityClass.__super__ = null;

if (typeof window == 'undefined') {
    module.exports = BaseEntityClass
} else {
    window.oo.BaseEntity = BaseEntityClass
    window.oo.eventmanager = BaseEntity.new();
    $(document).ready(function () {
        //console.log("EN DOCREDY DE BaseEntity")
        window.oo.classmanager.getClass("Window").onAny(function (event) {
            window.oo.pushreceiver.emitFromEntity(event._meta.name, event)
        })
    });
}