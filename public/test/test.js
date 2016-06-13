"use strict";

function main() {
/*
 21 June 12

 Experimentations of Virtual Rendering
 huge amount of items, eg. 1,000,000
 using custom UI components.

 This approach loads and unload dom objects
 as they scroll in/out of view.

 This hack has only been tested on webkit.

 http://twitter.com/blurspline
 http://jsdo.it/zz85
 */

var NUMBER_OF_ITEMS = 1000000;


// ********** class: ScrollBar ****************** //
/*
 Simple UI widget that displays a scrolltrack
 and slider, that fires some scroll events
 */
// *********************************************** //
function ScrollBar(h, w) {

    var SCROLLBAR_WIDTH = w ? w : 12;
    var SCROLLBAR_MARGIN = 3;
    var SCROLL_WIDTH = SCROLLBAR_WIDTH + SCROLLBAR_MARGIN * 2;
    var MIN_BAR_LENGTH = 25;

    var scrolltrack = document.createElement('div');
    var scrolltrackHeight = h - 2;
    scrolltrack.className = 'scrolltrack';
    scrolltrack.style.height = h - 2;
    scrolltrack.style.width = SCROLL_WIDTH - 2;

    // var scrollTop = 0;
    var scrollbar = document.createElement('div');
    scrollbar.className = 'scrollbar';
    scrollbar.style.width = SCROLLBAR_WIDTH - 2;
    scrollbar.style.height = h / 2;
    scrollbar.style.top = 0;
    scrollbar.style.left = SCROLLBAR_MARGIN;

    scrolltrack.appendChild(scrollbar);

    var me = this;

    var bar_length, bar_y;

    // Sets lengths of scrollbar by percentage
    this.setLength = function(l) {
        // limit 0..1
        l = Math.max(Math.min(1, l), 0);
        l *= scrolltrackHeight;
        bar_length = Math.max(l, MIN_BAR_LENGTH);
        scrollbar.style.height = bar_length;
    }

    // Moves scrollbar to position by Percentage
    this.setPosition = function(p) {
        p = Math.max(Math.min(1, p), 0);
        var emptyTrack = scrolltrackHeight - bar_length;
        bar_y = p * emptyTrack;
        scrollbar.style.top = bar_y;
    }

    this.setLength(1);
    this.setPosition(0);
    this.onScroll = new SimpleEvent();

    var mouse_down_grip;

    function onDown(event) {
        event.preventDefault();

        if (event.target == scrollbar) {
            mouse_down_grip = event.offsetY;
            scrolltrack.addEventListener('mousemove', onMove, false);
            scrolltrack.addEventListener('mouseup', onUp, false);
        } else {
            if (event.offsetY < bar_y) {
                me.onScroll.notify('pageup');
            } else if (event.offsetY > (bar_y + bar_length)) {
                me.onScroll.notify('pagedown');
            }
            // if want to drag scroller to empty track instead
            // me.setPosition(event.offsetY / (scrolltrackHeight - 1));
        }
    }

    function onMove(event) {
        event.preventDefault();

        if (event.target == scrollbar) {
            var emptyTrack = scrolltrackHeight - bar_length;
            var scrollto = (bar_y + event.offsetY - mouse_down_grip) / emptyTrack;
            me.setPosition(scrollto);
            me.onScroll.notify('scrollto', scrollto);
            return;

        }
        var emptyTrack = scrolltrackHeight - bar_length;
        var scrollto = (event.offsetY - mouse_down_grip) / emptyTrack;
        me.setPosition(scrollto);
        me.onScroll.notify('scrollto', scrollto);
    }

    function onUp(event) {
        onMove(event);
        scrolltrack.removeEventListener('mousemove', onMove, false);
        scrolltrack.removeEventListener('mouseup', onUp, false);
    }

    scrolltrack.addEventListener('mousedown', onDown, false);
    this.domElement = scrolltrack;

}

// ********** class: RowItem ****************** //
/*
 Simple Object to be added to ScrollPane.
 Handles its dom when require to draw
 and destroy itself when scrolled out of view
 */
// *********************************************** //
function RowItem(text) {
    this.text = text;
    this.height = eachHeight;
}

RowItem.prototype.draw = function(parent, translate) {
    if (!this.dom) {
        this.dom = document.createElement('div');
        this.dom.innerHTML = this.text;
        this.dom.className = 'rowitem';
        this.dom.style.backgroundColor = 'black';
        this.dom.style.color = 'white';
        parent.appendChild(this.dom);
    }
    this.dom.style.top = this.y - translate;

}

RowItem.prototype.destroy = function(parent) {
    parent.removeChild(this.dom);
    this.dom = null;
}

// ********** class: ScrollWindow ****************** //
/*
 A Scrollpane, Controller and Virtual Controller that
 handles rendering of items and integrates events from
 ScrollBar.
 */
// *********************************************** //
function ScrollPane(w, h) {

    var me = this;

    this.width = w;
    this.height = h;

    var container = document.createElement('div');
    container.className = 'pane';
    container.style.width = w;
    container.style.height = h;

    var SCROLLBAR_WIDTH = 12;

    var canvas = document.createElement('div');
    canvas.className = 'mainpane';
    canvas.style.width = w - SCROLLBAR_WIDTH - 4;
    canvas.style.height = h;

    canvas.width = w;
    canvas.height = h;

    var scrollbar = new ScrollBar(h, SCROLLBAR_WIDTH);
    this.scrollbar = scrollbar;
    window.bar = scrollbar;

    container.appendChild(canvas);
    container.appendChild(scrollbar.domElement);

    var pageOffset = h / 2 * 40;

    scrollbar.onScroll.add(function(type, scrollTo) {
        switch (type) {
            case 'pageup':
                scrollTop -= pageOffset;
                me.draw();
                me.updateScrollbar();
                break;
            case 'pagedown':
                scrollTop += pageOffset;
                me.draw();
                me.updateScrollbar();
                break;
            case 'scrollto':
                scrollTop = scrollTo  * (innerHeight - h);
                me.draw();
                break;
        }
    });

    var scrollTop = 0;
    var innerHeight = h;

    function onWheel(e) {
        e.preventDefault();
        var delta = e.wheelDelta;
        scrollTop-=delta;
        me.draw();
        me.updateScrollbar();
    }

    container.addEventListener('mousewheel', onWheel, false);

    document.body.appendChild(container);

    var items = [];
    this.items = items;

    var onscreen = [];

    // === draw() ====
    // paints contents
    // ===============
    this.draw = function() {
        var time = Date.now();

        scrollTop = Math.max(Math.min(scrollTop, innerHeight - h), 0);

        var oldscreen = onscreen;
        onscreen = [];

        var creating = 0, destorying = 0;
        var item;
        for (var i=0, il=items.length;i<il;i++) {
            item = items[i];
            if ((item.y + item.height >= scrollTop) && (item.y <= h + scrollTop)) {
                if (!item.dom) {
                    creating++;
                }
                item.draw(canvas, scrollTop);
                onscreen.push(item);
            }
        }

        for (var i=0, il=oldscreen.length;i<il;i++) {
            item = oldscreen[i];
            if (onscreen.indexOf(item)==-1) {
                item.destroy(canvas);
                destorying++;
            }
        }

        DEBUG.innerHTML = 'Redraw: ' + (Date.now() - time) + 'ms';

    }

    // ====== add() ======

    this.add = function(item) {
        items.push(item);
        innerHeight = item.y + item.height;
    }

    this.updateScrollbar = function() {
        var item = this.items[this.items.length - 1];
        innerHeight = item.y + item.height;
        me.scrollbar.setLength(me.height / innerHeight);
        me.scrollbar.setPosition(scrollTop / (innerHeight-h));

    }

}


// ********** class: SimpleEvent ****************** //
/*
 Simple "signals" style event handling
 */
// *********************************************** //

function SimpleEvent() {
    var listeners = [];

    this.add = function(target) {
        listeners.push(target);
    }

    this.remove = function(target) {
        var index = listeners.indexOf(target);
        listeners.splice(index, 1);
    }

    this.notify = function() {
        var i, il;
        for (i=0,il=listeners.length; i<il; i++) {
            listeners[i].apply(this, arguments);
        }
    }
}



// ********** Main ****************** //
/*
 I've created some simple custom
 components
 */
// ********************************** //
// Let's start!

    console.time('start');
    var pane = new ScrollPane(320, 380);


    var DEBUG = document.createElement('div');
    document.body.appendChild(DEBUG);
    DEBUG.innerHTML = 'M';
    var eachHeight = DEBUG.clientHeight + 1; // estimate each row's height
// document.body.removeChild(DEBUG);

    var item;
    var lasty = 0;

    for (var i = 1; i <= NUMBER_OF_ITEMS; i++) {
        item = new RowItem('Virtual Item $' + i + ' =)');
        item.y = lasty;
        item.x = 0;
        lasty += item.height;
        pane.add(item);
    }
    pane.items[0].text += ' ~~ Start ~~';
    pane.items[pane.items.length - 1].text += ' ~~ End ~~';
    pane.updateScrollbar();
    console.timeEnd('start');

    pane.draw();
}

// **** Thanks for reading! =) ****/