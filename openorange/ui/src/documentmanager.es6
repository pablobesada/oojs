"use strict";

(function ($) {
    $.fn.drags = function (opt) {

        opt = $.extend({handle: "", cursor: "move"}, opt);

        if (opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function (e) {
            //console.log(e.offsetX, $(this).width())
            if (e.offsetX > $(this).width() - 20) return true;
            if (opt.handle === "") {
                var $drag = $(this).addClass('oo_draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('oo_draggable');
            }
            let z_idx = $drag.css('z-index');
            let drg_h = $drag.outerHeight();
            let drg_w = $drag.outerWidth();
            let pos_y = $drag.offset().top + drg_h - e.pageY;
            let pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function (e) {
                $('.oo_draggable').offset({
                    top: e.pageY + pos_y - drg_h,
                    left: e.pageX + pos_x - drg_w
                }).on("mouseup", function () {
                    $(this).removeClass('oo_draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function () {
            if (opt.handle === "") {
                $(this).removeClass('oo_draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('oo_draggable');
            }
        });

    }
})(jQuery);

(function ($) {

    var _ = require("underscore");
    let oo = require("openorange");
    var cm = oo.classmanager;

    class DocumentObject {
        constructor(container) {
            this.container = container
            this.element = null;
            this.id = oo.ui.genId("doc_element")
            this.selected = false;
            this.type = null;
        }

        isSelected() {
            return this.selected;
        }

        select() {
            this.selected = true;
            this.container.selectObject(this)
        }

        setElement($el) {
            let self = this;
            self.element = $el;
            $el.drags();
            $el.resize(this.onResize.bind(self));
            $el.mousemove(this.onMouseMove.bind(self));
            $el.mousedown(function (event) {
                self.select()
            })
            $el.mouseup(function (event) { //este evento esta definido para que en los Rectangles, al estar haciendo resize, al soltar el boton se actualicen el width y el height del property toolbox
                self.select()
            })
            $el.mouseover(function (event) {
                self.element.addClass("mouseover")
            })
            $el.mouseout(function (event) {
                self.element.removeClass("mouseover")
            })
        }

        move(newpos) {
            let pos = {};
            if ('left' in newpos) pos.left = newpos.left + "px";
            if ('top' in newpos) pos.top = newpos.top + "px";
            console.log(pos)
            this.element.css(pos)
        }

        draw() {
        }

        onMouseMove(event) {
            if (this.isSelected()) {
                this.container.selectedObjectMoved(event.currentTarget.offsetLeft, event.currentTarget.offsetTop)
            }
        }

        onResize(event) {
            console.log("RESIZING", event);
            if (this.isSelected()) {
                //this.container.selectedObjectMoved(event.currentTarget.offsetLeft, event.currentTarget.offsetTop)
            }
        }

        toJSON() {
            let json = {}
            json.type = this.type;
            json.position = {left: this.element[0].offsetLeft, top: this.element[0].offsetTop}
            return json
        }

        static fromJSON(json, container) {
            let res = null;
            switch (json.type) {
                case 'label':
                    res = new Label(container)
                    break;
                case 'field':
                    res = new Field(container)
                    break;
                case 'rectangle':
                    res = new Rectangle(container)
                    break;
            }
            res.loadFromJSON(json)
            res.draw();
            return res;
        }

        loadFromJSON(json) {
            this.move(json.position)
        }
    }

    class TextObject extends DocumentObject {
        constructor(container) {
            super(container)
            this.fontsize = null;
        }

        setFontSize(size) {
            this.fontsize = size;
            this.element.css('font-size', size + 'pt')
        }

        toJSON() {
            let json = super.toJSON()
            json.fontsize = this.fontsize;
            return json
        }

        loadFromJSON(json) {
            super.loadFromJSON(json)
            this.fontisize = json.fontsize
        }

    }

    class Label extends TextObject {
        constructor(container, text) {
            super(container)
            this.type = "label"
            this.setElement($(`<span id="${this.id}" class="label"></span>`))
            this.text = '';
            this.setText(text || '');
        }

        setText(text) {
            if (this.text != text) {
                this.text = text;
                this.draw();
            }
        }

        getText(text) {
            return this.text
        }

        draw() {
            this.element.html(this.getText())
        }

        toJSON() {
            let json = super.toJSON()
            json.text = this.text;
            return json
        }

        loadFromJSON(json) {
            super.loadFromJSON(json)
            this.text = json.text
        }

    }

    class Field extends TextObject {
        constructor(container, field) {
            super(container)
            this.type = 'field'
            this.setElement($(`<span id="${this.id}" class="field"></span>`))
            this.setField(null);
            this.fontsize = null;
        }

        setField(field) {
            if (field != this.field || this.field === undefined) {
                this.field = field;
                this.draw();
            }
        }

        getField() {
            return this.field;
        }

        draw() {
            if (this.container.mode == 'edit') {
                let f = this.getField();
                if (!f) f = 'no field';
                this.element.html(`{ ${f} }`)
            } else {
                let rec = this.container.document.getRecord()
                let fieldname = this.getField()
                let v = '';

                if (rec && fieldname) {
                    let field = rec.fields(fieldname)
                    v = field.getFormattedValue()
                }
                this.element.html(`${v}`)
            }
        }
        toJSON() {
            let json = super.toJSON()
            json.field = this.field;
            return json
        }

        loadFromJSON(json) {
            super.loadFromJSON(json)
            this.field = json.field
        }

    }

    class Rectangle extends DocumentObject {
        constructor(container) {
            super(container)
            this.type = 'rectangle'
            this.setElement($(`<span id="${this.id}" class="rectangle"></span>`))
        }

        resize(newsize) {
            let size = {};
            if ('width' in newsize) size.width = newsize.width + "px";
            if ('height' in newsize) size.height = newsize.height + "px";
            console.log("loading from hjson size2:", size)
            this.element.css(size)
        }

        toJSON() {
            let json = super.toJSON()
            json.size = this.getSize()
            return json
        }


        getSize() {
            return {width: this.element.width(), height: this.element.height()};
        }

        loadFromJSON(json) {
            super.loadFromJSON(json)
            console.log("loading from hjson size:", json.size)
            this.resize(json.size)
        }

    }


    class DocumentContainer extends oo.ui.BaseContainer {

        constructor(doc) {
            super(doc)
            this.document = this.entity
            this.objects = []
            this.fields = []
            this.selectedObj = null;
            this.curScale = 2;
            this.mode = 'view'
            this.document.onAny(this.update.bind(this));
        }

        open() {
            var tab = $(`<li><a href="#${this.tab_id}">DOCUMENT</a></li>`);
            $('ul.recent-activity').prepend(tab);
            this.render()
            $('ul.recent-activity').tabs();
        }

        render() {
            oo.ui.containers.push({
                container: this,
                entity: this.document,
                element: this.__element__,
                tab_id: this.tab_id
            });
            let obj_field_id = oo.ui.genId();
            let obj_label_id = oo.ui.genId();
            let posX_id = oo.ui.genId();
            let posY_id = oo.ui.genId();
            let height_id = oo.ui.genId();
            let width_id = oo.ui.genId();
            let font_size_id = oo.ui.genId();
            let html = `
            <link rel='stylesheet' href='css/documenteditor.css'/>
            <div class="document-container">
    <div class="print-section">
    </div>

    <div class="elements-toolbar edit">
        <ul class="">
            <li><a class="btn" action="zoomin">ZOOM IN</a></li>
            <li><a class="btn" action="zoomout">ZOOM OUT</a></li>
            <li><a class="btn" action="newlabel">NEW LABEL</a></li>
            <li><a class="btn" action="newfield">NEW FIELD</a></li>
            <li><a class="btn" action="newrectangle">NEW RECT</a></li>
        </ul>
    </div>
    <div class="properties-toolbox edit">
        <div class="label-properties property-group">
            <div class="input-field">
                <input id="${obj_label_id}" class='obj-label' name="label" type="text"/>
                <label for="${obj_label_id}">Label</label>
            </div>
        </div>
        <div class="field-properties property-group">
            <div class="input-field">
                <select id="${obj_field_id}" class='obj-field' name="field">
                </select>
                <label for="${obj_field_id}">Field</label>
            </div>
        </div>
        <div class="text-properties property-group">
            <div class="input-field">
                <input id="${font_size_id}" class='font-size' name="font-size" type="number"/>
                <label for="${font_size_id}">Font Size</label>
            </div>
        </div>
        <div class="input-field">
            <input id="${posX_id}" class='posX' name="X" type="number"/>
            <label for="${posX_id}">X</label>
        </div>
        <div class="input-field">
            <input id="${posY_id}" class='posY' name="Y" type="number"/>
            <label for="${posY_id}">Y</label>
        </div>
        <div class="rectangle-properties property-group">
            <div class="input-field">
                <input id="${width_id}" class='width' name="width" type="number"/>
                <label for="${width_id}">Width</label>
            </div>
            <div class="input-field">
                <input id="${height_id}" class='height' name="height" type="number"/>
                <label for="${height_id}">Height</label>
            </div>

        </div>
    </div>
</div>
            `
            this.__element__.append(html);
            $('#workspace').append(this.__element__);
            this.setViewScale()
            this.__element__.find('.obj-label').change(this.changeLabelText.bind(this))
            this.__element__.find('.obj-field').change(this.changeFieldName.bind(this))
            this.__element__.find('.posX').change(this.changePosX.bind(this))
            this.__element__.find('.posY').change(this.changePosY.bind(this))
            this.__element__.find('.width').change(this.changeWidth.bind(this))
            this.__element__.find('.height').change(this.changeHeight.bind(this))
            this.__element__.find('.font-size').change(this.changeFontSize.bind(this))
            this.__element__.find('a[action=zoomin]').click(this.zoomIn.bind(this))
            this.__element__.find('a[action=zoomout]').click(this.zoomOut.bind(this))
            this.__element__.find('a[action=newlabel]').click(this.newLabel.bind(this))
            this.__element__.find('a[action=newfield]').click(this.newField.bind(this))
            this.__element__.find('a[action=newrectangle]').click(this.newRectangle.bind(this))
            this.printSectionElement = this.__element__.find('.print-section')
            this.renderActionBar();
            this.loadDocumentSpec()
            this.bindRecordToDocument(this.document.getRecord())
            this.modeView();
        }

        update(event) {
            var self = this;
            //console.log(event)
            switch (event._meta.name) {
                case "close":
                    self.close()
                    break;
                case "focus":
                    //el action 'open' es en event de clase y no entra por aca. ver final de este archivo.
                    self.focus()
                    break;
                case "edit":
                    self.modeEdit();
                    break;
                case "view":
                    self.modeView();
                    break;
                case "save":
                    self.save();
                    break;
            }
        }

        modeEdit() {
            this.__element__.find(".edit").show();
            this.mode = 'edit'
            _(this.objects).each(o => {
                o.draw()
            })
        }

        modeView() {
            this.__element__.find(".edit").hide();
            this.mode = 'view'
            _(this.objects).each(o => {
                o.draw()
            })
        }

        setViewScale() {
            for (let i = 0; i < DocumentContainer.scales.length; i++) this.__element__.find('.print-section').removeClass(DocumentContainer.scales[i])
            this.__element__.find('.print-section').addClass(DocumentContainer.scales[this.curScale])
        }

        zoomIn() {
            this.curScale = Math.min(DocumentContainer.scales.length - 1, this.curScale + 1)
            this.setViewScale();
        }

        zoomOut() {
            this.curScale = Math.max(0, this.curScale - 1)
            this.setViewScale()
        }

        newLabel() {
            let obj = new Label(this, 'new label')
            this.printSectionElement.append(obj.element)
            this.objects.push(obj);
            obj.select();
        }

        newField() {
            let obj = new Field(this)
            this.printSectionElement.append(obj.element)
            this.objects.push(obj);
            this.fields.push(obj)
            obj.select();

        }

        newRectangle() {
            let obj = new Rectangle(this);
            this.printSectionElement.append(obj.element)
            this.objects.push(obj);
            obj.select()
        }

        selectObject(object) {
            let $e = $('#' + object.id);
            this.__element__.find('.selected').removeClass("selected")
            $e.addClass("selected")
            this.selectedObj = object

            if (!this.selectedObj) {
                this.clearPropertiesToolbox();
                return;
            }

            switch (this.selectedObj.type) {
                case 'label':
                    this.displayLabelProperties(this.selectedObj)
                    break;
                case 'field':
                    this.displayFieldProperties(this.selectedObj)
                    break;
                case 'rectangle':
                    this.displayRectangleProperties(this.selectedObj)
                    break;
            }
        }

        clearPropertiesToolbox() {
            $('.property-group').hide();
        }

        displayLabelProperties(obj) {
            this.__element__.find('.property-group').hide();
            this.__element__.find('.label-properties').show();
            this.__element__.find('.text-properties').show();
            this.__element__.find('.obj-label').val(obj.getText())
            this.__element__.find('.obj-label').focus()
            this.__element__.find('.obj-label').select()
            Materialize.updateTextFields();
        }

        displayFieldProperties(obj) {
            this.__element__.find('.property-group').hide();
            this.__element__.find('.field-properties').show();
            this.__element__.find('.text-properties').show();
            this.__element__.find('.obj-field').val(obj.getField())
            this.__element__.find('.obj-field').focus()
            this.__element__.find('.obj-field').select()
        }

        displayRectangleProperties(obj) {
            this.__element__.find('.property-group').hide();
            this.__element__.find('.rectangle-properties').show();
            this.__element__.find('.width').show();
            this.__element__.find('.height').show();
            this.__element__.find('.width').val(obj.getSize().width);
            this.__element__.find('.height').val(obj.getSize().height);
        }

        changeLabelText(event) {
            if (this.selectedObj) this.selectedObj.setText(event.target.value)
        }

        changeFontSize(event) {
            if (this.selectedObj) this.selectedObj.setFontSize(event.target.value)
        }

        changeFieldName(event) {
            if (this.selectedObj) this.selectedObj.setField(event.target.value)
        }

        changePosX(event) {
            if (this.selectedObj) this.selectedObj.move({left: event.target.value})
        }

        changePosY(event) {
            if (this.selectedObj) this.selectedObj.move({top: event.target.value})
        }
        changeWidth(event) {
            if (this.selectedObj) this.selectedObj.resize({width: event.target.value})
        }

        changeHeight(event) {
            if (this.selectedObj) this.selectedObj.resize({height: event.target.value})
        }

        selectedObjectMoved(left, top) {
            this.__element__.find('.posX').val(left) //esto hay que pasarlo a mm
            this.__element__.find('.posY').val(top) // esto hay que pasarlo amm
            Materialize.updateTextFields();
        }

        bindRecordToDocument(record) {
            let $select = this.__element__.find(".obj-field");
            $select.html('')
            if (record) {
                $select.append(`<option value=''>No field</option>`)
                let fieldnames = record.fieldNames()
                for (let i in fieldnames) {
                    let fn = fieldnames[i];
                    $select.append(`<option value='${fn}'>${fn}</option>`)
                }
                $select.material_select();
            }
        }

        loadDocumentSpec() {
            let docSpec = this.document.getDocumentSpec();
            if (docSpec && docSpec.JSONSpec != null) {
                this.loadFromJSON(JSON.parse(docSpec.JSONSpec))
            }
        }

        toJSON() {
            return {objects: _(this.objects).map(o => {return o.toJSON()})}
        }

        loadFromJSON(json) {
            this.objects = []
            for (let i in json.objects) {
                let obj = DocumentObject.fromJSON(json.objects[i], this);
                this.printSectionElement.append(obj.element)
                this.objects.push(obj);
            }
        }

        async save() {
            this.document.getDocumentSpec().JSONSpec = JSON.stringify(this.toJSON())
            let res = await this.document.getDocumentSpec().save()
            console.log(this.document.getDocumentSpec().JSONSpec)
            if (res) oo.commit();
            if (res) oo.postMessage("saved")
        }
    }

    DocumentContainer.scales = ['scale25', 'scale50', 'scale75', 'scale100', 'scale125', 'scale150', 'scale175', 'scale200']

    $(document).ready(function () {
        //console.log("DOC READY WINDOWMANAGER")
        cm.getClass("Embedded_DocumentView").onAny(function (event) {
            console.log(event)
            if (event._meta.name == 'open') {
                let wm = new DocumentContainer(event.documentView)
                wm.open()
            }
        });
    })

    /*
     $(document).ready(function () {
     Materialize.updateTextFields();
     let d = new DocumentContainer()
     $('#obj-label').change(d.changeLabelText.bind(d))
     $('#obj-field').change(d.changeFieldName.bind(d))
     $('#posX').change(d.changePosX.bind(d))
     $('#posY').change(d.changePosY.bind(d))
     $('a[action=zoomin]').click(d.zoomIn.bind(d))
     $('a[action=zoomout]').click(d.zoomOut.bind(d))
     $('a[action=newlabel]').click(d.newLabel.bind(d))
     $('a[action=newfield]').click(d.newField.bind(d))
     $('a[action=newrectangle]').click(d.newRectangle.bind(d))
     })*/

    window.oo.ui.documentmanager = DocumentContainer
})(jQuery)
