"use strict";
$(function () {

    $(window).load(function () {
        setTimeout(function () {
            $("body").addClass("loaded")
        }, 50)

    })
    $(document).ready(function () {
        $("#password").change(function () {
            //alert($("#password").val())
            $("#md5pass").val(md5($("#password").val()))
        })
    });
});