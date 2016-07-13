"use strict"
var oo = require('openorange')
let _ = require("underscore")

var CardDescription = {
    name: 'Embedded_Card',
    inherits: null,
    filename: __filename,
    title: '',
    no_data_template: `
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">No data available</span>
              <p></p>
            </div>
          </div>`
}

class Embedded_Card extends oo.BaseEntity {


    static initClass(descriptor) {
        super.initClass(descriptor)
        let parentdesc = this.__description__;
        let newdesc = {}
        newdesc.name = descriptor.name;
        newdesc.title = descriptor.title;
        newdesc.filename = descriptor.filename;
        newdesc.template = descriptor.template || parentdesc.template;
        newdesc.no_data_template = descriptor.no_data_template || parentdesc.no_data_template;
        newdesc.params = descriptor.params;
        this.__description__ = newdesc;
        return this;
    }

    constructor(container) {
        super()
        this.__status__ = 'stopped';
        this.params = {}
        this.container = container
        this.paramListener = this.paramListener.bind(this);
    }

    play() {
        if (!this.isPlaying()) {
            this.__status__ = "playing";
            this.refresh();
        }
    }

    isPlaying() {
        return (this.__status__ == 'playing')
    }

    stop() {
        this.__status__ = "stopped";
    }

    isStopped() {
        return (this.__status__ == 'stopped')
    }

    pause() {
        this.__status__ = "paused";
    }

    isPaused() {
        return (this.__status__ == "paused")
    }

    getContainer() {
        return this.container
    }

    isReady() {
        return this.checkParams();
    }

    checkParams() {
        let desc_params = this.__class__.getDescription().params;
        for (let p in desc_params) {
            if (!this.params[p]) return false;
        }
        return true;
    }

    setParam(name, param) {
        if (this.params[name] && this.params[name] instanceof oo.BaseEntity) {
            this.params[name].off('field modified', this.paramListener);
        }
        this.params[name] = param;
        if (this.params[name] && this.params[name] instanceof oo.BaseEntity) {
            this.params[name].on('field modified', this.paramListener);
        }
        this.refresh()
    }

    getTemplate() {
        return this.__class__.getDescription().template
    }

    getNoDataTemplate() {
        return this.__class__.getDescription().no_data_template
    }

    async refresh() {
        if (this.isPlaying()) {
            this.emit('content updated', {DOMComponent: await this.getDOMComponent()})
        }
    }


    paramListener(event) {
        this.refresh()
    }

    async getDOMComponent() {
        if (this.isReady() && !this.isStopped()) {
            let args = await this.getTemplateVariables();
            for (let p in this.params) { args[p] = this.params[p]; }
            let DOMComponent = $(this.__class__.formatString(this.getTemplate(), args))
            this.wireActions(DOMComponent)
            return DOMComponent;
        } else {
            return $(this.getNoDataTemplate());
        }

    }

    async getTemplateVariables() {
        return {}
    }

    static formatString(format,args) {
        return format.replace(/\{\{(\w+)\}\}/g, function (match, name) {
            return typeof args[name] != 'undefined' ? args[name] : match;
        });
    };

    wireActions(DOMComponent) {
        let self = this;
        _(DOMComponent.find("[clickmethod]")).each((e)=> {
            let method = self[e.getAttribute('clickmethod')]
            if (method) $(e).click(method.bind(self))
        })
        _(DOMComponent.find("[changemethod]")).each((e)=> {
            let method = self[e.getAttribute('changemethod')]
            if (method) $(e).change(method.bind(self))
        })
    }
}

//Embedded_Card.__description__ = CardDescription;
module.exports = Embedded_Card.initClass(CardDescription)