"use strict";

(function ($) {
    function RemoteArray(source, length) {
        this.items = [];
        this.start = 0;
        this.bufferlength = 60;
        this.fetching = null;
        this.fetching_start = null;
        this.fetching_count = null;
        this.last_fetch_id = 1;
        this.waiters = {};
        this.waiter_ids = 1;
        this.source = source;
        this.length = length
        this.length_fixed =false;
        if (typeof source == 'array') {
            this.items = source;
            this.length = this.items.length;
            this.length_fixed = true;
        }
        //if (this.bufferlength > this.length) this.bufferlength = length;
    }

    RemoteArray.prototype.ensure = function (start, count) {
        if (!this.source) return;
        let self = this;
        this.fetching = true;
        this.fetching_start = start;
        this.fetching_count = count;
        this.last_fetch_id++;
        let fetch_id = this.last_fetch_id;
        Promise.resolve(this.source(start, count))
            .then(function (items) {
                console.log(start, count, items.length)
                if (!self.length_fixed) {
                    if (count > items.length) {
                        self.length = start + items.length;
                        self.length_fixed = true;
                        console.log('setting length to:' + self.length)
                    } else if (count == items.length) {
                        self.length = start + count + self.bufferlength;
                        console.log('2setting length to:' + self.length)
                    }
                }
                self.start = start;
                self.items = items;
                if (fetch_id == self.last_fetch_id) {
                    self.fetching = false;
                    self.fetching_start = false;
                    self.fetching_count = false;
                }
                for (let i in self.waiters) self.waiters[i].onResponse({start: start, count: count, items: items});
            })
    }

    RemoteArray.prototype.get = function (idx) {
        let self = this;
        return new Promise(function (resolve, reject) {
            if (idx < self.start || idx >= self.start + self.items.length) {
                if (!self.fetching || idx < self.fetching_start || idx >= self.fetching_start + self.fetching_count) {
                    let start = Math.max(Math.round(idx - self.bufferlength / 3), 0); //traigo 1/3 para atras y 2/3 para adelante
                    let count = self.bufferlength;
                    self.ensure(start, count)
                }
                let waiter_id = self.waiter_ids++;
                let waiter = {
                    onResponse: function (data) {
                        if (idx >= data.start && idx < data.start + data.count) {
                            delete self.waiters[waiter_id]
                            resolve(data.items[idx - data.start])
                        }
                    }
                }
                self.waiters[waiter_id] = waiter;
            } else {
                resolve(self.items[idx - self.start])
            }
        });
    }

    var pluginName = 'superlist',
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function SuperList(element, options) {
        this.element = element;
        //this.element.setLength = this.setLength.bind(this)
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    SuperList.prototype.init = function () {
        let self = this;
        let container = this.element;
        let $e = $(container);
        this.width = $e.width()
        this.height = $e.height();
        console.log("SIZE: ", this.width, this.height)
        container.className += ' oo-superlist';
        //container.style.width = w;
        //container.style.height = h;
        this.canvas = document.createElement('div');
        //this.canvas.className = 'mainpane';
        this.canvas.style.display = 'block';
        this.canvas.style.position = 'absolute';
        this.canvas.style.overflow = 'hidden';

        this.canvas.style.height = this.height + "px";

        //this.canvas.style.width = this.width;
        //this.canvas.style.height = this.height;
        let scrollbar = new ScrollBar(this.height);
        this.scrollbar = scrollbar;
        container.appendChild(this.canvas);
        container.appendChild(scrollbar.domElement);
        this.canvas.style.width = (this.width - $(this.scrollbar.domElement).width() - 4) + "px" ;
        //$(this.canvas).height(400)
        scrollbar.onScroll.add(function (type, scrollTo) {
            switch (type) {
                case 'pageup':
                    self.scrollTop -= self.height;
                    self.draw();
                    self.updateScrollbar();
                    break;
                case 'pagedown':
                    self.scrollTop += self.height;
                    self.draw();
                    self.updateScrollbar();
                    break;
                case 'scrollto':
                    self.scrollTop = scrollTo * (self.innerHeight - self.height); //scrollTo * (self.innerHeight - self.height);
                    self.draw();
                    break;
            }
        });

        this.scrollTop = 0;
        container.addEventListener('mousewheel', this.onWheel.bind(this), false);
        //document.body.appendChild(container);
        //var items = [];
        this.onscreen = [];
        this.itemHeight = null;
        this.setSource(this.options.src);
    };

    SuperList.prototype.initiate = function() {
        let self = this;
        let $e = $(self.element);
        self.width = $e.width()
        self.height = $e.height();
        console.log("SIZE INITIATE: ", this.width, this.height)
        this.initiated = false;
        if (this.items.length) {
            return this.items.get(0)
                .then(function (firstItem) {
                    self.itemHeight = 16;
                    if (firstItem) {
                        if (firstItem.jquery) firstItem = firstItem[0]
                        self.canvas.appendChild(firstItem);
                        self.itemHeight = $(firstItem).outerHeight(true);
                        self.canvas.removeChild(firstItem);
                    } else {
                        self.itemHeight = 16;
                    }
                    self.initiated = true;
                    self.updateScrollbar();
                    self.draw();
                })
        } else {
            self.updateScrollbar();
            self.draw();
        }
    }

    SuperList.prototype.onWheel = function (e) {
        e.preventDefault();
        if (!this.initiated) return;
        var delta = e.wheelDelta;
        let scrollTop = Math.max(0, this.scrollTop - delta);
        scrollTop = Math.min(this.innerHeight-this.height+100, scrollTop)
        if (scrollTop == this.scrollTop) return;
        this.scrollTop = scrollTop;
        this.draw();
        this.updateScrollbar();
    };

    SuperList.prototype.setLength = function(l) {
        this.options.length = l;
        this.items.length = l;
        this.initiate()
    }

    SuperList.prototype.setSource = function (src) {
        this.items = new RemoteArray(src, 120)
        this.initiate();
    }

    SuperList.prototype.draw = function () {
        //console.log('ini?', this.initiated)
        if (!this.initiated) return;
        let self = this;
        self.innerHeight = self.items.length * self.itemHeight;
        //var time = Date.now();
        let scrollTop = Math.max(Math.min(this.scrollTop, this.innerHeight - this.height), 0);

        let first_item = Math.max(0, Math.ceil(scrollTop / self.itemHeight) - 1);
        //console.log(Math.ceil(this.height / self.itemHeight))
        let last_item = Math.min(first_item + Math.ceil(this.height / self.itemHeight), this.items.length-1);
        //console.log("REDRAWING", first_item, last_item)
        let promises = [];
        for (let i = first_item; i <= last_item; i++) {
             promises.push(this.items.get(i));
        }
        Promise.all(promises).then(function (result) {
            //console.log("RESULT:", result)
            //self.element.removeChild(self.canvas)
            var frag = document.createDocumentFragment();
            var oldscreen = self.onscreen;
            self.onscreen = [];
            for (let i = first_item; i <= last_item; i++) {
                let item = result[i-first_item];
                if (!item) continue;
                //console.log(item)
                if (item.jquery) item = item[0]
                let top = i * self.itemHeight
                //if ((top + self.itemHeight >= scrollTop) && (top <= self.height + scrollTop)) {
                    //item.className += ' superlist-item';
                    item.style.position = 'absolute'

                    item.style.top = (top - scrollTop) + "px";
                //console.log("drawing item " + i + " at " + item.style.top, top, scrollTop)
                    frag.appendChild(item)
                    self.onscreen.push(item);
                //}
            }
            self.canvas.appendChild(frag);
            for (let i = 0, il = oldscreen.length; i < il; i++) {
                let item = oldscreen[i];
                if (self.onscreen.indexOf(item) == -1) {
                    //console.log("removing item", item)
                    self.canvas.removeChild(item);
                }
            }
            //self.first_item = first_item;
            //self.last_item = last_item;
            //self.drawed_scrollTop = scrollTop;
            //self.element.appendChild(self.canvas)
        })

    }

    SuperList.prototype.updateScrollbar = function () {
        if (!this.initiated) return;
        this.innerHeight = this.items.length * this.itemHeight;
        this.scrollbar.setLength(this.height / this.innerHeight);
        this.scrollbar.setPosition(this.scrollTop / (this.innerHeight - this.height));
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            let p = $.data(this, pluginName);
            if (!p) {
                $.data(this, pluginName,
                    new SuperList(this, options));
            }
        });
    }


    function ScrollBar (h) {

            //let SCROLLBAR_WIDTH = w ? w : 12;
            //let SCROLLBAR_MARGIN = 3;
            //let SCROLL_WIDTH = SCROLLBAR_WIDTH + SCROLLBAR_MARGIN * 2;
            this.MIN_BAR_LENGTH = 25;

            this.scrolltrack = document.createElement('div');
            this.scrolltrackHeight = h-2;
            this.scrolltrack.className = 'superlist-scrolltrack';
            this.scrolltrack.style.height = (h-2) + "px";
            //this.scrolltrack.style.width = SCROLL_WIDTH - 2;

            // var scrollTop = 0;
            this.scrollbar = document.createElement('div');
            this.scrollbar.className = 'superlist-scrollbar';
            //this.scrollbar.style.width = SCROLLBAR_WIDTH - 2;
            this.scrollbar.style.height = (h / 2) + "px";
            this.scrollbar.style.top = 0;
            //this.scrollbar.style.left = 3;

            this.scrolltrack.appendChild(this.scrollbar);

            this.onMove = this.onMove.bind(this)
            this.onUp = this.onUp.bind(this)
            this.onDown = this.onDown.bind(this)

            this.setLength(1);
            this.setPosition(0);
            this.onScroll = new SimpleEvent();
            this.scrolltrack.addEventListener('mousedown', this.onDown.bind(this), false);
            this.domElement = this.scrolltrack;

            // Sets lengths of scrollbar by percentage
        }

        ScrollBar.prototype.setLength = function(l) {
            // limit 0..1
            l = Math.max(Math.min(1, l), 0);
            l *= this.scrolltrackHeight;
            this.bar_length = Math.max(l, this.MIN_BAR_LENGTH);
            this.scrollbar.style.height = this.bar_length + "px";
        }

        // Moves scrollbar to position by Percentage
        ScrollBar.prototype.setPosition = function(p) {
            p = Math.max(Math.min(1, p), 0);
            let emptyTrack = this.scrolltrackHeight - this.bar_length;
            this.bar_y = p * emptyTrack;
            this.scrollbar.style.top = this.bar_y + "px";
        }


        ScrollBar.prototype.onDown = function(event) {
            event.preventDefault();

            if (event.target == this.scrollbar) {
                this.mouse_down_grip = event.offsetY;
                this.scrolltrack.addEventListener('mousemove', this.onMove, false);
                this.scrolltrack.addEventListener('mouseup', this.onUp, false);
            } else {
                if (event.offsetY < this.bar_y) {
                    this.onScroll.notify('pageup');
                } else if (event.offsetY > (this.bar_y + this.bar_length)) {
                    this.onScroll.notify('pagedown');
                }
                // if want to drag scroller to empty track instead
                // me.setPosition(event.offsetY / (scrolltrackHeight - 1));
            }
        }

        ScrollBar.prototype.onMove = function(event) {
            event.preventDefault();

            if (event.target == this.scrollbar) {
                var emptyTrack = this.scrolltrackHeight - this.bar_length;
                var scrollto = (this.bar_y + event.offsetY - this.mouse_down_grip) / emptyTrack;
                this.setPosition(scrollto);
                this.onScroll.notify('scrollto', scrollto);
                return;

            }
            var emptyTrack = this.scrolltrackHeight - this.bar_length;
            var scrollto = (event.offsetY - this.mouse_down_grip) / emptyTrack;
            this.setPosition(scrollto);
            this.onScroll.notify('scrollto', scrollto);
        }

        ScrollBar.prototype.onUp = function(event) {
            this.onMove(event);
            this.scrolltrack.removeEventListener('mousemove', this.onMove, false);
            this.scrolltrack.removeEventListener('mouseup', this.onUp, false);
        }



    function SimpleEvent() {
        var listeners = [];

        this.add = function (target) {
            listeners.push(target);
        }

        this.remove = function (target) {
            var index = listeners.indexOf(target);
            listeners.splice(index, 1);
        }

        this.notify = function () {
            var i, il;
            for (i = 0, il = listeners.length; i < il; i++) {
                listeners[i].apply(this, arguments);
            }
        }
    }

})
(jQuery)
