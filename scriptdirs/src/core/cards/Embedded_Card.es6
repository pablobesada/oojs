"use strict"
var oo = require('openorange')
let _ = require("underscore")

var CardDescription = {
    name: 'Embedded_Card',
    inherits: null,
    filename: __filename,
    abstract: true,
    title: '',
    params: {},
    no_data_template: `
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">No data available</span>
              <p></p>
            </div>
          </div>`
}

class Embedded_Card extends oo.UIEntity {


    static initClass(descriptor) {
        super.initClass(descriptor)
        let parentdesc = this.__description__;
        let newdesc = {}
        newdesc.name = descriptor.name;
        newdesc.title = descriptor.title;
        newdesc.filename = descriptor.filename;
        newdesc.template = descriptor.template || parentdesc.template;
        newdesc.no_data_template = descriptor.no_data_template || parentdesc.no_data_template;
        newdesc.abstract = 'abstract' in descriptor ? descriptor.abstract : false;
        newdesc.params = descriptor.params || {};
        this.__description__ = newdesc;
        return this;
    }

    constructor() {
        super()
        this.__status__ = 'stopped';
        this.params = {}
        this.dataProviderChange = this.dataProviderChange.bind(this)
        this.dataprovider = new oo.BaseEntity.ProvidedData();
        this.dataprovider.on('changed', this.dataProviderChange)
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

    isReady() {
        return this.checkParams();
    }

    checkParams() {
        let desc_params = this.__class__.getDescription().params;
        for (let p in desc_params) {
            if (!this.params[p]) {
                //console.log("FALTA PARAMETRO, ", p, this.__class__.getDescription().name)
                return false;
            }
        }
        //console.log("PARAMS OK, ", this.__class__.getDescription().name)
        return true;
    }

    async setDataProvider(dataprovider) {
        this.dataprovider.setSource(dataprovider);
    }

    dataProviderChange(event) {
        this.refreshParamsFromProvider()
    }

    async refreshParamsFromProvider() {
        //console.log("REFRESH PARAMS FROM PROVIDER", this.__class__.getDescription().name)
        //console.log("BBB", this.dataprovider.keys())
        //console.log("AAA", await this.dataprovider.getData('__record__'))
        this.params = {}
        let requiredParams = this.__class__.getDescription().params
        for (let p in requiredParams) {
            let keys = this.dataprovider.keys()
            for (let i in keys) {
                let key = keys[i];
                let data = await this.dataprovider.getData(key)
                //if ('function' == typeof data.then) data = await data;
                //console.log("PARAM", p, key, data, this.__class__.getDescription().name)
                if (data instanceof oo.classmanager.getClass(requiredParams[p])) {
                    //console.log("SETTING PARAM", p, data, this.__class__.getDescription().name)
                    this.params[p] = data;
                }
            }
        }
        //console.log("BEFORE CALL REFRESH", this.__class__.getDescription().name)
        this.refresh();
        //console.log("AFTER CALL REFRESH", this.__class__.getDescription().name)
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


    async getDOMComponent() {
        if (this.isReady() && !this.isStopped()) {
            let args = await this.getTemplateVariables();
            for (let p in this.params) {
                args[p] = this.params[p];
            }
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

    static formatString(format, args) {
        //console.log(args)
        return _.template(format, {
            evaluate:    /\{\{(.+?)\}\}/g,
            interpolate: /\{\{=(.+?)\}\}/g,
            escape:      /\{\{-(.+?)\}\}/g
        })(args)
        /*return format.replace(/\{\{(\w+)\}\}/g, function (match, name) {
            return typeof args[name] != 'undefined' ? args[name] : match;
        });*/
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

    static findMatchingCards(providedDataTypes) {
        let allcards = {};
        let res = []
        let classStructure = oo.classmanager.getClassStructure();
        for (let i = 0; i < classStructure.length; i++) {
            let sd = classStructure[i];
            for (let cardClassName in sd.cards) {
                if (!(cardClassName in allcards)) allcards[cardClassName] = sd.cards[cardClassName];
            }
        }
        for (let cardClassName in allcards) {
            let cardClass = oo.classmanager.getClass(cardClassName);
            if (cardClass.getDescription().abstract) continue;
            if (cardClass.matchesRequirements(providedDataTypes)) res.push(cardClass);
        }

        return res;
    }

    static matchesRequirements(providedDataTypes) {
        //console.log("PDT, ", providedDataTypes)
        let requiredParams = this.getDescription().params
        let providedClassNames = {}
        for (let k in providedDataTypes) {
            //console.log("AA",providedDataTypes[k])
            providedClassNames[providedDataTypes[k]] = 1;
        }
        for (let p in requiredParams) {
            let requiredClassName = requiredParams[p];
            if (!(requiredClassName in providedClassNames)) {
                return false;
            }
        }
        return true;
    }
}

//Embedded_Card.__description__ = CardDescription;
module.exports = Embedded_Card.initClass(CardDescription)