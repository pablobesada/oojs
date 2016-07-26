"use strict";

(function ($) {

    let _ = require('underscore')

    class TemplateManager {

        constructor() {
            this.selectors = {}
            this.underscoreTemplateArgs = {
                evaluate: /\{\{(.+?)\}\}/g,
                interpolate: /\{\{=(.+?)\}\}/g,
                escape: /\{\{-(.+?)\}\}/g
            }
        }

        get(selector) {
            let res = this.selectors[selector];
            if (!res) {
                let meta = TemplateManager.xml.find(selector)
                if (meta.length == 0) throw new Error(`Template for "${selector}" not found`)
                try {
                    let template = _.template(meta.text(), this.underscoreTemplateArgs);
                    this.selectors[selector] = {
                        meta: meta, getHTML: template, createElement: (args) => {
                            let $e = $(template(args))
                            if (meta.attr('init')) {
                                var $this = $e; //esto hay que hacerlo con VAR!!!
                                eval(meta.attr('init'))
                            }
                            $e.addedToPage = function ($r) {
                                if (meta.attr('initonpage')) {
                                    var $this = $e; //esto hay que hacerlo con VAR!!!
                                    eval(meta.attr('initonpage'))
                                }
                            }.bind($e)
                            return $e;
                        }
                    };
                    //else throw new Error (`Template for "${selector}" not found`)
                    res = this.selectors[selector];
                } catch (err) {
                    console.log('Error processing template ' + selector)
                    throw err;
                }
            }
            return res;
        }

    }


    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    }

    let templatesURL = "html/templates.xml";
    let data = {}
    let t = getURLParameter('templatesURL');
    if (t) {
        templatesURL = '/oo/api/crossdomainfetch';
        data = {url: t}
    }

    $.ajax({
        type: "GET",
        url: templatesURL,
        cache: false,
        //dataType: "jsonp",
        data: data,
        async: false,
        success: function (xml) {
            TemplateManager.xml = $(xml)
        }
    });

    window.oo.ui.templates = new TemplateManager();
})(jQuery)