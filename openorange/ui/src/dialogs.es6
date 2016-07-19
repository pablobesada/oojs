"use strict";
(function ($) {

    class Dialogs {

        static async askYesNo(txt) {
            let promise = Promise.pending()
            let id = 'DIALOG_' + Dialogs.element_ids++;
            let html = `
                    <div id="${id}" class="modal bottom-sheet">
                        <div class="modal-content">
                            <h4></h4>
                            <p>${txt}</p>
                        </div>
                        <div class="modal-footer green">
                            <a href="#" onclick="oo.ui.dialogs.resolve('${id}', true)" class=" modal-action modal-close waves-effect waves-green btn-flat">Yes</a>
                            <a href="#" onclick="oo.ui.dialogs.resolve('${id}', false)" class=" modal-action modal-close waves-effect waves-green btn-flat">No</a>
                        </div>
                    </div>`
            let dialogElement = $(html)
            $(document.body).append(dialogElement);
            Dialogs.promises[id] = promise;
            dialogElement.openModal({dismissible:false});
            return promise.promise;
        }

        static async customDialog(title, content, opts) {
            let options = opts || {}
            //let promise = Promise.pending()
            let id = 'DIALOG_' + Dialogs.element_ids++;
            let html = `
                    <div id="${id}" class="modal">
                        <div class="modal-content">
                        </div>
                    </div>`
            let dialogElement = $(html)
            if (title) {
                let t = $('<h4></h4>')
                t.append(title);
                dialogElement.find('.modal-content').append(t)
            }
            if (content) dialogElement.find('.modal-content').append(content)
            $(document.body).append(dialogElement);
            //Dialogs.promises[id] = promise;
            dialogElement.openModal(options);
            return dialogElement;
            //return promise.promise;
        }

        static async alert(txt) {
            alert(txt);
        }

        static async postMessage(txt) {
            Materialize.toast(txt, 4000)
        }

        static async resolve(id, result) {
            $('#' + id).closeModal();
            $('#' + id).remove();
            Dialogs.promises[id].resolve(result);
            //delete Dialogs.promises[id]
        }
    }

    Dialogs.promises = {}
    Dialogs.element_ids = 1;

    window.oo.ui.dialogs = Dialogs
    //window.WindowManager = WindowContainer; //para hacer global la variable WindowManager
})(jQuery);