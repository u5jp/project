import $ from "jquery"

console.log("crazytdst");

// $(function() {
//     $("#btn").click(function() {
//         $(this).after('<div>テスト</div>');
//     });
//     $("div").click(function() {
//         $(this).css('background', 'red');
//     });
//     $(".test").on("click", () =>{
//         console.log("test");
//         window.alert("hello world");
//     })

// });

(function(w,d){
const $hambuger = d.getElementsByClassName("c-nav_hamburger")[0];
const $popup = d.getElementsByClassName("c-nav_popup")[0];
const $test = d.getElementsByClassName("test")[0];

$hambuger.addEventListener("click",function(){
    console.log("test");
    if(!$popup.classList.contains("is-opened")){
        $popup.classList.add("is-opened")
    }else{
        $popup.classList.remove("is-opened")
    }

})
console.log($hambuger)
})(window,document);