"use strict";

(function ($) {
    let oo = require('openorange')
    let Promise = require('bluebird')
    let _ = require('underscore')

    class Workspace {
        constructor() {
            this.blockScreenId = oo.ui.genId("BLOCK")
            this.processingScreenId = oo.ui.genId("PROCESSING")
            this.blockToProcessingTime = 1500; //1.5 seg
            this.blockToProcessingCallback = null;
            this.__screenblocked__ = false;
            this.lastFocusElement = null;
            this.waiters = []
        }

        render() {
            let args= {processingscreen_id: this.processingScreenId, blockscreen_id: this.blockScreenId}
            $('body').html(oo.ui.templates.get(".workspace .body").createElement(args))
        }

        async waitForUnblockedScreen() {
            let self = this;
            if (!this.__screenblocked__) return;
            return new Promise(function (resolve, reject) {
                let waiter = {};
                waiter.done = function () {
                    resolve();
                }
                self.waiters.push(waiter);
            })
        }

        blockScreen() {
            console.log("block")
            let self = this;
            this.__screenblocked__ = true;
            $('#' + this.blockScreenId).show();
            this.blockToProcessingCallback = setTimeout(function () {
                $('#' + self.processingScreenId).show();
            },self.blockToProcessingTime)
            //this.lastFocusElement = document.activeElement;
            //console.log("removing focus form ", this.lastFocusElement)
            //this.lastFocusElement.blur();
        }

        unblockScreen() {
            console.log("en unblock")
            if (this.blockToProcessingCallback) clearTimeout(this.blockToProcessingCallback);
            this.blockToProcessingCallback = null;
            $('#' + this.blockScreenId).hide();
            $('#' + this.processingScreenId).hide();
            this.__screenblocked__ = false;
            let waiters = this.waiters.slice();
            this.waiters = [];
            _(waiters).each((w) => w.done())
            //if (this.lastFocusElement) {
            //    console.log("returning focus to: ", this.lastFocusElement)
            //    this.lastFocusElement.focus();
            //    this.lastFocusElement = null;
            //}
        }

    }

    window.oo.ui.workspace = new Workspace();

    $(document).ready(function () {
        window.oo.ui.workspace.render();
    })
})(jQuery)