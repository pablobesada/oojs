"use strict";

(function ($) {

    let _ = require('underscore')

    Handlebars.registerHelper('slice', function(context, block) {
        var ret = "",
            offset = parseInt(block.hash.offset) || 0,
            limit = parseInt(block.hash.limit) || 5,
            i,j;
        if(offset < 0){
            i = (offset < context.length) ? context.length-offset : 0;
        }else{
            i = (offset < context.length) ? offset : 0;
        }
        j = ((limit + offset) < context.length) ? (limit + offset) : context.length;
        for(i,j; i<j; i++) {
            ret += block.fn(context[i]);
        }
        return ret;
    });

    Handlebars.registerHelper('if_equal', function(a, b, opts) {
        if(a == b) // Or === depending on your needs
            return opts.fn(this);
        else
            return opts.inverse(this);
    });

    Handlebars.registerHelper('if_not_equal', function(a, b, opts) {
        if(a != b) // Or === depending on your needs
            return opts.fn(this);
        else
            return opts.inverse(this);
    });

    Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        var operator = options.hash.operator || "==";
        var operators = {
            '==':       function(l,r) { return l == r; },
            '===':      function(l,r) { return l === r; },
            '!=':       function(l,r) { return l != r; },
            '<':        function(l,r) { return l < r; },
            '>':        function(l,r) { return l > r; },
            '<=':       function(l,r) { return l <= r; },
            '>=':       function(l,r) { return l >= r; },
            'typeof':   function(l,r) { return typeof l == r; }
        }
        if (!operators[operator])
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
        var result = operators[operator](lvalue,rvalue);
        if( result ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    class TemplateManager {

        constructor() {
            this.selectors = {}
        }

        get(selector) {
            let res = this.selectors[selector];
            if (!res) {
                let meta = TemplateManager.html.find(selector)
                if (meta.length == 0) throw new Error(`Template for "${selector}" not found`)
                try {
                    let template = Handlebars.compile(meta.text()) //, this.underscoreTemplateArgs);
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
                                    console.log(meta.attr('initonpage'))
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

    let templatesURL = "html/templates.html";
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
        success: function (html) {
            TemplateManager.html = $(html);
        }
    });

    window.oo.ui.templates = new TemplateManager();
})(jQuery)