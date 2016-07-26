"use strict";

(function ($) {
    let oo = require('openorange')
    class Workspace {
        constructor() {
        }

        render() {
            $('body').html(oo.ui.templates.get("workspace body").createElement())
        }


    }

    window.oo.ui.workspace = new Workspace();

    $(document).ready(function () {
        window.oo.ui.workspace.render();
    })
})(jQuery)