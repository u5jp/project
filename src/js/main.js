const $ = require("jquery")
// import $ from "jquery"

const babel = () => {
    console.log("hello World")
    console.dir($);
}

$(function() {
    $("#btn").click(function() {
        $(this).after('<div>テスト</div>');
    });
    $("div").click(function() {
        $(this).css('background', 'red');
    });
    $(".test").on("click", () =>{
        console.log("test");
        window.alert("hello world");
    })
});

babel()