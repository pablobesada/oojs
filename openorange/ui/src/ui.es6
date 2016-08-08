"use strict";

(function ($) {
    var _ = require("underscore");
    var oo = require("openorange");
    var cm = oo.classmanager;

    class BaseContainer {
        constructor(entity, parentView) {
            let self = this;
            this.parentView = parentView;
            this.templateElements = [];
            this.entity = entity;
            this.tab_id = oo.ui.genId();
            this.actionbar_id = oo.ui.genId("actionbar")
            this.shouldBeAddedToWorkspace = false;
            this.shouldShowActions = true;
            this.shouldShowTitle = true;
            if (!this.parentView) {
                this.parentView = $('#workspace');
                this.shouldBeAddedToWorkspace = true;
            }
        }

        open(params) {
            let self = this;
            let args = {id: this.tab_id, title: this.getTitle(), favourite: false}
            this.__element__ = oo.ui.templates.get(".workspace .container").createElement(args);
            this.__element__.find('.oo-favourite-btn').click(this.toggleFavourite.bind(this))
            this.$title = this.__element__.find('.oo-container-title');
            if (!this.$title.length) this.$title = $title.find('.oo-container-title');
            if (!this.shouldShowTitle) {
                this.$title.hide();
            }
            this.parentView.append(this.__element__);

            this.__element__.append($(oo.ui.templates.get(".actionbar .container").getHTML({id: this.actionbar_id})))
            this.entity.on('action status', function (event) {
                self.renderActionBar()
            });

            self.populateUIElement();
            if (this.shouldBeAddedToWorkspace) {
                this.createUIEntry();
                oo.ui.containers.push({
                    entity: this.entity,
                    element: this.__element__,
                    tab_id: this.tab_id,
                    container: this,
                });
                console.log("WINDOW REGISTERED", this)
            }
            this.templateElements.push(this.__element__)
            self.renderActionBar();
            self.callInitOnPageCallbacks();
            self.updateFavouriteFlag();
        }

        async updateFavouriteFlag() {
            let self = this;
            let user = await oo.getCurrentUserObject();
            let favlink = this.getFavouriteLink()
            if (user && user.Favourites && user.Favourites.split(",").indexOf(favlink) >= 0) {
                this.__element__.find('.oo-favourite-btn').addClass("oo-selected")
            } else {
                this.__element__.find('.oo-favourite-btn').removeClass("oo-selected")
            }
        }

        getFavouriteLink() {
            return this.entity.__class__.getDescription().name
        }

        openFavouriteLink(link) {

        }

        async toggleFavourite(event) {
            let self = this;
            let user = await oo.getCurrentUserObject();
            if (user) {
                let favlink = this.getFavouriteLink()
                if (this.__element__.find('.oo-favourite-btn').hasClass("oo-selected")) {
                    user.removeFavourite(favlink)
                } else {
                    user.addFavourite(favlink)
                }
                let res = await user.saveAndCommit()
                this.updateFavouriteFlag();
                oo.ui.workspace.loadFavourites();
            }
        }

        createUIEntry() {
            let self = this;
            var tab = $('<li><a href="#' + this.tab_id + '">' + this.getTitle() + '</a></li>');
            $('.oo-recent-activity-container').prepend(tab);
            this.__element__.attr('id', this.tab_id);
            $('.oo-recent-activity-container').tabs();
            tab.mouseover(function () {
                $('.oo-recent-activity-container').tabs('select_tab', self.tab_id);
            })
            tab.click(function (event) {
                if (event.originalEvent) oo.ui.workspace.current_tab_id = self.tab_id;
            })

        }


        getTitle() {
            return 'no title'
        }

        callInitOnPageCallbacks() {
            _.each(this.templateElements, (templateElement) => {
                templateElement.addedToPage();
            })
            this.templateElements = [];
        }

        setWindowTitle(title) {
            $("a[href='#" + this.tab_id + "']").html(title)
            this.$title.find('.oo-title').html(title);
        };

        focus() {
            $('.oo-recent-activity-container').tabs('select_tab', this.tab_id);
            oo.ui.workspace.current_tab_id = this.tab_id;
            //$(`ul.recent-activity a`).removeClass('active')
            //$(`ul.recent-activity a[href="#${this.tab_id}"]`).addClass('active')
        }

        close() {
            if (this.entity.__ui_container_view_id__) {
                $('#' + this.entity.__ui_container_view_id__).html("")
            } else {
                let selected_tab_id = $('.oo-recent-activity-container').attr('href').substring(1);
                let is_selected = (selected_tab_id == this.tab_id);
                let newfocus = null
                if (is_selected) {
                    console.log("is selected")
                    let tabs_count = $(`a[href="#${this.tab_id}"]`).closest('ul').find('li').length
                    let pos = $(`a[href="#${this.tab_id}"]`).closest('ul').find('li').index($(`a[href="#${this.tab_id}"]`).closest('li'))
                    //let pos = 1
                    //console.log("POS", pos)
                    pos < tabs_count - 1 ? pos++ : pos--;
                    if (pos >= 0) newfocus = $($(`a[href="#${this.tab_id}"]`).closest('ul').find('li a')[pos])
                }
                $(`a[href="#${this.tab_id}"]`).closest('li').remove();
                $(`#${this.tab_id}`).remove();
                $('.oo-recent-activity-container').tabs();
                for (let i = 0; i < UI.containers.length; i++) {
                    if (UI.containers[i].entity === this.window) {
                        UI.containers.splice(i, 1)
                        break;
                    }
                }
                if (newfocus) $('.oo-recent-activity-container').tabs('select_tab', newfocus.attr('href').substring(1));
            }
        }

        async actionClicked(event) {
            let params = this;
            let self = params.self;
            let actiondef = params.actiondef;
            self.entity.callAction(actiondef);
        }

        async processKeyPress(event) {
            let actions = this.entity.getEnabledActions();
            for (let i = 0; i < actions.length; i++) {
                let actiondef = actions[i]
                if (actiondef.shortcut) {
                    let keys = actiondef.shortcut.toLowerCase().split("+");
                    let shift = false, enter = false, ctrl = false, alt = false, letter = null;
                    for (let j = 0; j < keys.length; j++) {
                        let key = keys[j]
                        switch (key) {
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
                    if (shift != event.shiftKey || ctrl != event.ctrlKey || alt != event.altKey) continue;
                    if (letter != event.key.toLowerCase()) continue;
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
                    let label = 'icon' in actiondef ? `<i class="mdi">${actiondef.icon}</i>` : actiondef.label;
                    let htmlAction = $(`<a class="btn waves-effect waves-light" action="${actiondef.method}">${label}</a>`);
                    let params = {self: self, actiondef: actiondef}
                    htmlAction.click(self.actionClicked.bind(params));
                    toolbar.append(htmlAction);
                }
            }
            self.__element__.find('#' + this.actionbar_id).html(toolbar);
        };

        renderActionBar() {
            let self = this
            if (!self.shouldShowActions) return;
            let actions = self.entity.getVisibleActions()
            if (actions.length == 0) return;
            //let toolbar = $(`<div class="fixed-action-btn"></div>`)
            let actiondef = actions[0]
            let icon = actiondef.icon || 'trending_flat'
            let buttons = []
            //let params = {self: self, actiondef: actiondef}
            let btn = {id: oo.ui.genId("ACTION"), label: actiondef.label, icon: icon, actiondef: actiondef}
            buttons.push(btn);


            //let btn = $(`<a data-tooltip="${actiondef.label}" data-position="left" class="btn-floating btn-large green"><i class="large mdi">${icon}</i></a>`)
            //let params = {self: self, actiondef: actiondef}
            //btn.click(self.actionClicked.bind(params));
            //toolbar.append(btn)
            //let ul = $("<ul></ul>");
            for (let i = 1; i < actions.length; i++) {
                let actiondef = actions[i]
                let icon = actiondef.icon || 'trending_flat'
                let btn = {id: oo.ui.genId("ACTION"), label: actiondef.label, icon: icon, actiondef: actiondef}
                buttons.push(btn)
                //let btn = $(`<li><a  data-tooltip="${actiondef.label}" data-position="left"  class="btn-floating blue"><i class="mdi">${icon}</i></a></li>`)
                //let params = {self: self, actiondef: actiondef}
                //btn.click(self.actionClicked.bind(params));
                //ul.append(btn);
            }
            //toolbar.append(ul);
            //console.log(this.__element__.find('#' + this.actionbar_id).find('[data-tooltip]'))
            this.__element__.find('#' + this.actionbar_id).find('[data-tooltip]').tooltip('remove')
            let args = {actions: buttons}
            let template = oo.ui.templates.get(".actionbar .content");
            let toolbar = template.createElement(args)
            _.each(buttons, (btn) => {
                let params = {self: self, actiondef: btn.actiondef}
                toolbar.find('#' + btn.id).click(self.actionClicked.bind(params))
            })
            this.__element__.find('#' + this.actionbar_id).html(toolbar);
            //toolbar.find('[data-tooltip]').tooltip({delay: 50});
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
    UI.processingScreenElement = null;
    UI.processingScreenElementShown = false;
    window.oo.ui = UI;


    window.addEventListener('keyup', function (event) {
        //si escucho KEYPRESS, al hacer click sobre otro tab, luego SHiFT+ENTER no se recibe el evento
        let key = event.key.toLowerCase();
        if (key == 'alt' || key == 'shift' || key == 'ctrl' || key == 'ctrl' || key == 'meta') return;
        //let curtab = $('ul.tabs.workspace li a.active');
        let curtab = $('.oo-recent-activity-container li a.active');
        if (curtab.length > 0) {
            let wc = UI.findContainerForTabId(curtab.attr("href").substring(1))
            //console.log("WC", wc)
            //if (!wc)  wc = oo.ui.listwindowmanager.findListWindowContainerForTabId(curtab.attr("href").substring(1)) // <-- esto es poco eficiente. se corre por cada tecla que se presiona y buscan en todos los tabs cual es el tab actual, y dps busca por ese tabId en windowmanagers, liswindowmanager y reportmanagers... muy pesado... encima una vez que encuentra la ventana recorre todos los actions para ver si alguno tiene esa combinacion de teclas.
            //if (!wc)  wc = oo.ui.reportmanager.findReportContainerForTabId(curtab.attr("href").substring(1)) // <-- esto es poco eficiente. se corre por cada tecla que se presiona y buscan en todos los tabs cual es el tab actual, y dps busca por ese tabId en windowmanagers, liswindowmanager y reportmanagers... muy pesado... encima una vez que encuentra la ventana recorre todos los actions para ver si alguno tiene esa combinacion de teclas.
            if (wc) {
                wc.processKeyPress(event);
            }
        }
    })

})(jQuery)
