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
            if (e.offsetX < 10 || e.offsetX > $(this).width() - 10) return true;
            if (opt.handle === "") {
                var $drag = $(this).addClass('oo_draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('oo_draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
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

    class DocumentViewer {

        constructor()
        {
            this.objects = []
            this.selectedObj = null;
            this.curScale = 3;
        }

        static genId() {
            return "ID_" + DocumentViewer.ID++;
        }

        setViewScale() {
            for (let i = 0; i < DocumentViewer.scales.length; i++) $('#print-section').removeClass(DocumentViewer.scales[i])
            $('#print-section').addClass(DocumentViewer.scales[this.curScale])
        }

        zoomIn() {
            this.curScale = Math.min(DocumentViewer.scales.length - 1, this.curScale + 1)
            this.setViewScale();
        }

        zoomOut() {
            this.curScale = Math.max(0, this.curScale - 1)
            this.setViewScale()
        }

        newComponent(type) {
            let id = DocumentViewer.genId();
            let $comp = $('<span id="' + id + '" class="' + type + '"></span>')
            this.processElement($comp)
            $comp.drags()
            $('#print-section').append($comp)
            let obj = Object.create(null);
            obj.id = id;
            obj.type = type;
            obj.element = $comp;
            obj.setPosX = function setPosX(x) {
                this.element.css({left: x})
            }
            obj.setPosY = function setPosY(y) {
                this.element.css({top: y})
            }
            this.objects[id] = obj
            return obj
        }

        newLabel() {
            let obj = this.newComponent('label');
            obj.setLabel = function setLabel(label) {
                this.label = label;
                this.element.html(label)
            }
            obj.getLabel = function getLabel() {
                return this.label
            }
            obj.setLabel('new label')
            this.selectObject(obj.id)

        }

        newField() {
            let obj = this.newComponent('field');
            obj.setField = function setField(field) {
                this.field = field;
                if (field) {
                    this.element.html('{field: ' + field + '}')
                } else {
                    this.element.html('{field: (empty)}')
                }
            }
            obj.getField = function getField() {
                return this.field
            }
            obj.setField('CustName')
            this.selectObject(obj.id)
        }

        newRectangle() {
            let obj = this.newComponent('rectangle');
            this.selectObject(obj.id)
        }

        processElement($el) {
            let self = this;
            $el.mousemove(this.changeComponentPosition);
            $el.mousedown(function (event) {
                self.selectObject($(event.target).attr('id'))
            })
            $el.mouseover(function (event) {
                $(event.target).addClass("mouseover")
            })
            $el.mouseout(function (event) {
                $(event.target).removeClass("mouseover")
            })
        }

        selectObject(id) {
            let $e = $('#' + id);
            $('.selected').removeClass("selected")
            $e.addClass("selected")
            this.selectedObj = this.objects[$e.attr('id')];

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
            $('.property-group').hide();
            $('#label-properties').show();
            $('#obj-label').val(obj.getLabel())
            $('#obj-label').focus()
            $('#obj-label').select()
            Materialize.updateTextFields();
        }

        displayFieldProperties(obj) {
            $('.property-group').hide();
            $('#field-properties').show();
        }

        displayRectangleProperties(obj) {
            $('.property-group').hide();
            $('#rectangle-properties').show();
        }

        changeLabelText(event) {
            if (this.selectedObj) this.selectedObj.setLabel(event.target.value)
        }

        changeFieldName(event) {
            if (this.selectedObj) this.selectedObj.setField(event.target.value)
        }

        changePosX(event) {
            if (this.selectedObj) this.selectedObj.setPosX(event.target.value)
        }

        changePosY(event) {
            if (this.selectedObj) this.selectedObj.setPosY(event.target.value)
        }

        changeComponentPosition(event) {
            if (this.selectedObj) {
                $('#posX').val(event.currentTarget.offsetLeft) //esto hay que pasarlo a mm
                $('#posY').val(event.currentTarget.offsetTop) // esto hay que pasarlo amm
                Materialize.updateTextFields();
            }
        }
    }

    DocumentViewer.scales = ['scale25', 'scale50', 'scale75', 'scale100', 'scale125', 'scale150', 'scale175', 'scale200']
    DocumentViewer.ID = 1

    $(document).ready(function () {
        Materialize.updateTextFields();
        let d = new DocumentViewer()
        $('#obj-label').change(d.changeLabelText.bind(d))
        $('#obj-field').change(d.changeFieldName.bind(d))
        $('#posX').change(d.changePosX.bind(d))
        $('#posY').change(d.changePosY.bind(d))
        $('a[action=zoomin]').click(d.zoomIn.bind(d))
        $('a[action=zoomout]').click(d.zoomOut.bind(d))
        $('a[action=newlabel]').click(d.newLabel.bind(d))
        $('a[action=newfield]').click(d.newField.bind(d))
        $('a[action=newrectangle]').click(d.newRectangle.bind(d))
    })

})(jQuery)