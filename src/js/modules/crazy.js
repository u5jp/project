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

((w,d) =>{
    d.body.style.position="fixed";
    d.body.scrollTop = d.documentElement.scrollTop = 0;

    const domEach = ( elements , callback ) => {
		Array.prototype.forEach.call( elements ,(element) => {
			callback( element );
		});
    }
    
    w.addEventListener("DOMContentLoaded",() =>{

        //nav
        (()=>{
            const $hambuger = d.getElementsByClassName("c-nav_hamburger")[0];
            const $popup = d.getElementsByClassName("c-nav_popup")[0];
            const $logo = d.getElementsByClassName("c-nav_logo")[0];
            const navsArray = [$hambuger,$popup,$logo]
            
            $hambuger.addEventListener("click",() =>{
                if(!$popup.classList.contains("is-opened")){
                    for(let i=0;i < navsArray.length;i++){
                        navsArray[i].classList.add("is-opened")
                    }
                }else{
                    for(let i=0;i < navsArray.length;i++){
                        navsArray[i].classList.remove("is-opened")
                    }
                }
            });
        })();

        //KVtext
        (()=>{
            const $lead = d.getElementsByClassName("p-kv_textBox_lead")[0];
            w.addEventListener("load",function(){
                $lead.classList.add("is-active");
                console.log($lead.children);
                domEach($lead.children,(child) => {
                    child.addEventListener('transitionend', () => {
                        child.classList.add("is-show")
                    },{once: true});
                })
            });
        })();

        //KVcarousel
        (()=>{
            const $carousel = d.getElementsByClassName("p-kv_carousel")[0];
            const $children = $carousel.children;
            const time = 5000;

            let changeImage = () => {
                let current = 0;
                return ()=> {
                current = current === $children.length-1?0:current += 1;
                $children[current].classList.add('is-animate');
                }
            }
            let kvAnimate = changeImage();

            kvAnimate();
            setInterval(()=>{kvAnimate()},time);

            domEach($children,(child) => {
                child.addEventListener('animationend', () => {
                    child.classList.remove('is-animate');
                });
            })

        })();

        //KV→コンテンツ移動
        (()=>{
            w.addEventListener("load",()=>{
                const $kvSec = d.getElementsByClassName("p-kv")[0];
                const $mainSec = d.getElementsByClassName("p-contents")[0];
                $kvSec.style.transform = "translate3d(0px,0px,0px)";
                $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)";
                //デバッグ用
                // $kvSec.style.transform = "translate3d(0px,-100%,0px)"
                // $mainSec.style.transform = "translate3d(0px,0px,0px)"
                // console.log($kvSec.offsetHeight)
                // console.log($kvSec.style.transform)
                // console.log(window.innerHeight)
                // console.log(window.outerHeight)
                //
                let parseTranslate3d = (string) => {
                    $mainSec.style.transition = "transform .8s cubic-bezier(1,0,0,1) .1s"
                    var array = string.replace('translate3d', '').match(/-?[\d\.]+/g);
                    for (var i = 0; i < array.length; i++) {
                        array[i] = Number(array[i]);
                    }
                    return array;
                }

                let resize = (e) =>{
                    console.log("tes");
                    $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)";
                }
                // scroll.disable();
                let scrollJudge = (e) =>{
                    let kvY = parseTranslate3d($kvSec.style.transform)[1];
                    let mainSecY = parseTranslate3d($mainSec.style.transform)[1];
                    const $intro = d.getElementsByClassName("p-introduction")[0];
                    const $text= d.getElementsByClassName("p-introduction_text")[0];
                    const $button = d.querySelector(".p-introduction .c-button");
                    const $lead = d.querySelector(".p-introduction .c-textSlideIn-wrap");
                    const introArray = [$intro,$text,$button,$lead]

                    if(window.pageYOffset == 0 && e.deltaY <= 0){
                        // console.log("上")
                        if(mainSecY  == 0){
                            juggeInvalid();
                            w.addEventListener("resize",resize);
                            d.body.style.position="fixed";
                            $kvSec.style.transform = "translate3d(0px,0px,0px)"
                            $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)"
                            $mainSec.addEventListener('transitionend', () => {
                                // scroll.disable();
                                d.addEventListener("mousewheel",scrollJudge);
                            },{once: true});
                        }
                    }else if(e.deltaY > 0){
                        // console.log("下")
                        if(kvY  == 0){
                            juggeInvalid();
                            $kvSec.style.transform = "translate3d(0px,-100%,0px)"
                            $mainSec.style.transform = "translate3d(0px,0px,0px)"
                            w.removeEventListener("resize",resize);
                            $mainSec.addEventListener('transitionend', () => {
                                // scroll.enable();
                                d.addEventListener("mousewheel",scrollJudge);
                                // $intro.classList.add("is-shown");
                                // $button.classList.add("is-shown");
                                for(let i=0;i < introArray.length;i++){
                                    introArray[i].classList.add("is-shown");
                                }
                                d.body.style.position="static";
                            },{once: true});
                        };
                    }
                }
                let juggeInvalid = (e) =>{
                    // scroll.disable();
                    d.removeEventListener("mousewheel",scrollJudge);
                    d.removeEventListener("touchmove",scrollJudge);
                }
                d.addEventListener("mousewheel",scrollJudge);
                d.addEventListener("touchmove",scrollJudge);
                w.addEventListener("resize",resize);
            });
        })();

        (()=>{
            w.addEventListener("load",()=>{
                const $outline = d.getElementsByClassName("p-outline")[0];
                const $children = $outline.children;

                w.addEventListener("scroll",()=>{
                    // for(let i=0 ; i < $children.length;i++){
                    //     if($children[i].offsetTop < w.pageYOffset){
                    //         $children[i].classList.add("is-shown");
                    //     }
                    // }
                    for(let i=0 ; i < $children.length;i++){
                        if($children[i].offsetTop - ($outline.offsetHeight/2) < w.pageYOffset){
                            $children[i].classList.add("is-shown");
                            for(let j=0 ; j < $children[i].children.length;j++){
                                $children[i].children[j].classList.add("is-shown");
                            }
                        }
                    }
                });
                console.log($outline.offsetTop)
                console.log($outline.offsetHeight)
                // console.log($outline.style.transform)
                console.log(window.innerHeight)
                console.log(window.outerHeight)

            })
        })();

    });
})(window,document);

                        // if(sc()){
                    //     console.log("up");
                    //     if(mainSecY  == 0){
                    //         $kvSec.style.transform = "translate3d(0px,0px,0px)"
                    //         $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)"
                    //     }
                    // }else{
                    //     console.log("down");
                    //     if(kvY  == 0){
                    //         $kvSec.style.transform = "translate3d(0px,-100%,0px)"
                    //         $mainSec.style.transform = "translate3d(0px,0px,0px)"
                    //     };
                    // }

                                    //使用方法
                // w.addEventListener("scroll",()=>{
                //         let kvY = parseTranslate3d($kvSec.style.transform)[1];
                //         let mainSecY = parseTranslate3d($mainSec.style.transform)[1];
                //         console.log(kvY)
                //         if(sc()){
                //             console.log("up");
                //             if(mainSecY  == 0){
                //                 $kvSec.style.transform = "translate3d(0px,0px,0px)"
                //                 $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)"
                //             }
                //         }else{
                //             console.log("down");
                //             if(kvY  == 0){
                //                 $kvSec.style.transform = "translate3d(0px,-100%,0px)"
                //                 $mainSec.style.transform = "translate3d(0px,0px,0px)"
                //             };
                //         }
                // });

                                // var preventScroll={
                //     x:0,
                //     y:0,
                //     setPos(x=window.pageXOffset,y=window.pageYOffset){
                //         console.log("setPos")
                //         this.x=x;
                //         this.y=y;
                //     },
                //     handleEvent(){
                //         window.scrollTo(this.x,this.y);
                //     },
                //     enable(){
                //         this.setPos();
                //         window.addEventListener("scroll",this);
                //     },
                //     disable(){
                //         window.removeEventListener("scroll",this);
                //     }
                // };
                // preventScroll.enable();
                // d.addEventListener("mousewheel",function(){
                //     console.log("ホイール");
                // });