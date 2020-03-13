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
    let scroll = {
        disable : () =>{
            d.addEventListener("mousewheel",scroll.control,{passive:false});
            d.addEventListener("touchmove",scroll.control,{passive:false});
        },
        enable:() =>{
            d.removeEventListener("mousewheel",scroll.control,{passive:false});
            d.removeEventListener("touchmove",scroll.control,{passive:false});
        },
        control: (event) =>{
            event.preventDefault();
        }
    };

    const domEach = ( elements , callback ) => {
		Array.prototype.forEach.call( elements ,(element) => {
			callback( element );
		});
    }

    const sc = (() =>{
        const scrollElement = 'scrollingElement' in document ? document.scrollingElement : document.documentElement;
        let flag,curPos;
        let prePos = 10000;

        return ()=>{
            curPos = scrollElement.scrollTop;
            flag = prePos>=curPos?true:false;
            console.log(prePos)
            console.log(curPos)
            prePos = curPos;
            console.log(flag);
            return flag
        }
    })();
    
    w.addEventListener("DOMContentLoaded",() =>{



        //nav
        (()=>{
            const $hambuger = d.getElementsByClassName("c-nav_hamburger")[0];
            const $popup = d.getElementsByClassName("c-nav_popup")[0];
            const $logo = d.getElementsByClassName("c-nav_logo")[0];
            
            $hambuger.addEventListener("click",() =>{
                console.log("test");
                if(!$popup.classList.contains("is-opened")){
                    $popup.classList.add("is-opened");
                    $hambuger.classList.add("is-opened");
                    $logo.classList.add("is-opened");
                }else{
                    $popup.classList.remove("is-opened");
                    $hambuger.classList.remove("is-opened");
                    $logo.classList.remove("is-opened");
                }
            
            });
        })();

        //KVtext
        (()=>{
            const $lead = d.getElementsByClassName("p-kv_textaBox_lead")[0];
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

        w.addEventListener("load",()=>{
            setTimeout(function () {
                window.scrollTo(0, 0);
            }, 0);
        //KV→コンテンツ移動
            (()=>{
                const $kvSec = d.getElementsByClassName("p-kv")[0];
                const $mainSec = d.getElementsByClassName("p-contents")[0];
                $kvSec.style.transform = "translate3d(0px,0px,0px)";
                $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)";


                //デバッグ用
                $kvSec.style.transform = "translate3d(0px,-100%,0px)"
                $mainSec.style.transform = "translate3d(0px,0px,0px)"
                console.log($kvSec.offsetHeight)
                console.log($kvSec.style.transform)
                console.log(window.innerHeight)
                console.log(window.outerHeight)
                //

                let parseTranslate3d = (string) => {
                    $mainSec.style.transition = "transform .8s cubic-bezier(1,0,0,1) .1s"
                    var array = string.replace('translate3d', '').match(/-?[\d\.]+/g);
                    for (var i = 0; i < array.length; i++) {
                        array[i] = Number(array[i]);
                    }
                    return array;
                }

                scroll.disable();

                let scrollJudge = (e) =>{
                    let kvY = parseTranslate3d($kvSec.style.transform)[1];
                    let mainSecY = parseTranslate3d($mainSec.style.transform)[1];
                    if(window.pageYOffset == 0 && e.deltaY <= 0){
                        console.log("上")
                        if(mainSecY  == 0){
                            juggeInvalid();
                            $kvSec.style.transform = "translate3d(0px,0px,0px)"
                            $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)"
                            $mainSec.addEventListener('transitionend', () => {
                                scroll.disable();
                                d.addEventListener("mousewheel",scrollJudge);
                            },{once: true});
                        }
                    }else if(e.deltaY > 0){
                        console.log("下")
                        if(kvY  == 0){
                            juggeInvalid();
                            $kvSec.style.transform = "translate3d(0px,-100%,0px)"
                            $mainSec.style.transform = "translate3d(0px,0px,0px)"
                            $mainSec.addEventListener('transitionend', () => {
                                scroll.enable();
                                d.addEventListener("mousewheel",scrollJudge);
                            },{once: true});
                        };
                    }
                }

                let juggeInvalid = (e) =>{
                    scroll.disable();
                    d.removeEventListener("mousewheel",scrollJudge);
                    d.removeEventListener("touchmove",scrollJudge);
                }

                d.addEventListener("mousewheel",scrollJudge);
                d.addEventListener("touchmove",scrollJudge);

            })();

        });


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