"use strict";

(function ($) {
    var _ = require("underscore");
    var cm = require("openorange").classmanager;

    var DocumentContainer = Object.create(null);

    DocumentContainer.init = function (docspec, record) {
        this.docspec = docspec;
        this.record = cm.getClass("TestRecord").new().fillWithRandomValues();
        return this;
    };

    DocumentContainer.render = function render() {
        var self = this;
        var body = $('<div>HOLA MUNDO!!!!</div>');
        var style = $('<style>@media screen, print {body { line-height: 1.2 } div {position: absolute}} </style>');
        body.append(style);
        console.log(body.html());
        var wtab = window.open();
        self.drawFields(body);
        $(wtab.document.body).html(body);
    };

    DocumentContainer.drawFields = function drawFields(w) {
        var f = $("<div style=\"top:120px; left:30px\">" + this.record.String_Field + "</div>");
        w.append(f);
    };

    $.extend(true, window.oo.ui, { documentmanager: DocumentContainer });
    //window.WindowManager = WindowContainer; //para hacer global la variable WindowManager
})(jQuery);

//# sourceMappingURL=documentmanager.js.map