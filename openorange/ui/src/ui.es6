"use strict";

(function ($) {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    class BaseContainer {
        constructor(entity) {
            this.entity = entity;
            this.__element__ = $('<div class="container"></div>');
            this.__element__.append('<div class="oo_actionbar"></div>')
            this.tab_id = oo.ui.genId();
        }

        setWindowTitle(title) {
            $("a[href='#" + this.tab_id + "']").html(title)
        };

        focus() {
            $('ul.tabs.workspace').tabs('select_tab', this.tab_id);
        }

        close() {
            if (this.entity.__ui_container_view_id__) {
                $('#' + this.entity.__ui_container_view_id__).html("")
            } else {
                let selected_tab_id = $('ul.tabs.workspace a.active').attr('href').substring(1);
                let is_selected = (selected_tab_id == this.tab_id);
                let newfocus = null
                if (is_selected) {
                    console.log("is selected")
                    let tabs_count = $(`a[href="#${this.tab_id}"]`).closest('ul').find('li').length
                    let pos = $(`a[href="#${this.tab_id}"]`).closest('ul').find('li').index($(`a[href="#${this.tab_id}"]`).closest('li'))
                    //let pos = 1
                    //console.log("POS", pos)
                    pos < tabs_count - 1? pos++ : pos--;
                    if (pos >= 0) newfocus = $($(`a[href="#${this.tab_id}"]`).closest('ul').find('li a')[pos])
                }
                $(`a[href="#${this.tab_id}"]`).closest('li').remove();
                $(`#${this.tab_id}`).remove();
                $('ul.tabs.workspace').tabs();
                for (let i = 0; i < UI.containers.length; i++) {
                    if (UI.containers[i].entity === this.window) {
                        UI.containers.splice(i, 1)
                        break;
                    }
                }
                if (newfocus) $('ul.tabs.workspace').tabs('select_tab', newfocus.attr('href').substring(1));
            }
        }

        async actionClicked(event) {
            let params = this;
            let self = params.self;
            let actiondef = params.actiondef;
            self.entity.callAction(actiondef);
        }

        async processKeyPress(event) {
            let actions = this.entity.__class__.getDescription().actions;
            for (let i=0;i<actions.length;i++) {
                let actiondef = actions[i]
                if (actiondef.shortcut) {
                    let keys = actiondef.shortcut.toLowerCase().split("+");
                    let shift = false, enter = false, ctrl = false, alt = false, letter = null;
                    for (let j=0;j<keys.length;j++) {
                        let key = keys[j]
                        switch(key) {
                            case "shift":
                                shift = true;
                                break;
                            case "ctrl":
                                ctrl = true;
                                break;
                            case "alt":
                                alt = true;
                                break;
                            case "enter":
                                letter = 'enter';
                                break;
                            default:
                                letter = key;
                                break;
                        }
                    }
                    if (shift != event.shiftKey || ctrl != event.ctrlKey || alt != event.altKey) return;
                    if (letter != event.key.toLowerCase()) return;
                    this.entity.callAction(actiondef)
                }
            }
            return false;
        }

        renderActionBar() {
            var self = this;
            var toolbar = $('<div class="row"></div>');
            for (let i = 0; i < self.entity.__class__.getDescription().actions.length; i++) {
                let actiondef = self.entity.__class__.getDescription().actions[i]
                if (self.entity.isActionRelevant(actiondef)) {
                    let label = 'icon' in actiondef? `<i class="mdi">${actiondef.icon}</i>` : actiondef.label;
                    let htmlAction = $(`<a class="btn waves-effect waves-light" action="${actiondef.method}">${label}</a>`);
                    let params = {self: self, actiondef: actiondef}
                    htmlAction.click(self.actionClicked.bind(params));
                    toolbar.append(htmlAction);
                }
            }
            self.__element__.find('.oo_actionbar').html(toolbar);
        };
    }

    class UI {
        static findContainerForTabId(tab_id) {
            for (let i=0;i<UI.containers.length;i++) {
                if (UI.containers[i].tab_id == tab_id) {
                    return UI.containers[i].container;
                }
            }
            return null
        }

        static genId(str) {
            if (str) return "oo_" + str + "_" + UI.unique_id_seed++;
            return "oo_ui_" + UI.unique_id_seed++;
        }
    }

    UI.unique_id_seed = 1;
    UI.containers = [];
    UI.BaseContainer = BaseContainer;
    window.oo.ui = UI;


    window.addEventListener('keyup', function (event) {
        //si escucho KEYPRESS, al hacer click sobre otro tab, luego SHiFT+ENTER no se recibe el evento
        let key = event.key.toLowerCase();
        if (key == 'alt' || key == 'shift' || key == 'ctrl' || key == 'ctrl' || key == 'meta') return;
        let curtab = $('ul.tabs.workspace li a.active');
        if (curtab) {
            let wc = UI.findContainerForTabId(curtab.attr("href").substring(1))
            console.log("WC", wc)
            if (!wc)  wc = oo.ui.listwindowmanager.findListWindowContainerForTabId(curtab.attr("href").substring(1)) // <-- esto es poco eficiente. se corre por cada tecla que se presiona y buscan en todos los tabs cual es el tab actual, y dps busca por ese tabId en windowmanagers, liswindowmanager y reportmanagers... muy pesado... encima una vez que encuentra la ventana recorre todos los actions para ver si alguno tiene esa combinacion de teclas.
            if (!wc)  wc = oo.ui.reportmanager.findReportContainerForTabId(curtab.attr("href").substring(1)) // <-- esto es poco eficiente. se corre por cada tecla que se presiona y buscan en todos los tabs cual es el tab actual, y dps busca por ese tabId en windowmanagers, liswindowmanager y reportmanagers... muy pesado... encima una vez que encuentra la ventana recorre todos los actions para ver si alguno tiene esa combinacion de teclas.
            if (wc) {
                wc.processKeyPress(event);
            }
        }
    })

})(jQuery)