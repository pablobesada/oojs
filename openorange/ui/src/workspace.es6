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
            this.current_tab_id = null;
        }

        render() {
            let self = this;
            let args = {processingscreen_id: this.processingScreenId, blockscreen_id: this.blockScreenId}
            $('body').html(oo.ui.templates.get(".workspace>.body").createElement(args))

            $('.oo-recent-activity-container').tabs({
                onShow: function (tab_id) {
                }
            })
            $('.oo-recent-activity-container').mouseenter(() => {
                //this.current_tab_id = $(`.oo-recent-activity-container a.active`).attr('href').substring(1)
                //console.log("TABID", this.current_tab_id)
            })
            $('.oo-recent-activity-container').mouseleave(() => {
                if (this.current_tab_id) {
                    $('.oo-recent-activity-container').tabs('select_tab', this.current_tab_id);
                }
            })

            this.loadFavourites();
        }

        async loadFavourites() {
            let user = await oo.getCurrentUserObject()
            $('.oo-favourites-container').html('')
            if (user) {
                let f = _.filter((user.Favourites || '').split(','), (v) => {
                    return v.trim()
                })
                _.each(f, async (v) => {
                    let tokens = v.split("#")
                    let wnd = oo.classmanager.getClass(tokens[0]).new()
                    if (tokens.length > 1) {
                        let rec = await wnd.__class__.getRecordClass().findOne({internalId: tokens[1]})
                        wnd.setRecord(rec)
                    }
                    let $item = oo.ui.templates.get('.workspace .favourite-item').createElement({label: wnd.getTitle()})
                    $('.oo-favourites-container').append($item)
                    let $open_action = $item.find('.oo-open-action')
                    if (!$open_action.length) $open_action = $item.addBack('.oo-open-action');
                    $open_action.click((event) => {
                        event.stopPropagation();
                        event.preventDefault()
                        console.log("OPEN")
                        wnd.open();
                        wnd.setFocus();
                    })
                    let $create_action = $item.find('.oo-create-action')
                    if (!$create_action.length) $create_action = $item.addBack('.oo-create-action');
                    if (wnd instanceof oo.classmanager.getClass('Embedded_ListWindow')) {
                        $create_action.click((event) => {
                            event.stopPropagation();
                            event.preventDefault()
                            console.log("DELETE")
                            let rec = wnd.getRecordClass().new();
                            rec.defaults();
                            console.log(rec)
                            let w = wnd.getWindowClass().new();
                            w.setRecord(rec);
                            w.open();
                            w.setFocus();
                            return true;
                        })
                    } else {
                        $create_action.hide()
                    }

                    let $delete_action = $item.find('.oo-delete-action')
                    if (!$delete_action.length) $delete_action = $item.addBack('.oo-delete-action');
                    $delete_action.click(async (event) => {
                        event.stopPropagation();
                        event.preventDefault()
                        console.log("DELETE", user)
                        user.removeFavourite(v);
                        await user.saveAndCommit();
                        $item.remove();
                        return true;
                    })

                })
            }
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

        isScreenBlocked() {
            return this.__screenblocked__;
        }

        blockScreen() {
            console.log("block")
            let self = this;
            this.__screenblocked__ = true;
            $('#' + this.blockScreenId).show();
            this.blockToProcessingCallback = setTimeout(function () {
                $('#' + self.processingScreenId).show();
            }, self.blockToProcessingTime)
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