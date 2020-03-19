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
    var userAgent = window.navigator.userAgent.toLowerCase();

    if(userAgent.indexOf('msie') != -1 ||
            userAgent.indexOf('trident') != -1) {
        console.log('Internet Explorerをお使いですね');
    } else if(userAgent.indexOf('edge') != -1) {
        console.log('Edgeをお使いですね');
    } else if(userAgent.indexOf('chrome') != -1) {
        console.log('Google Chromeをお使いですね');
    } else if(userAgent.indexOf('safari') != -1) {
        console.log('Safariをお使いですね');
    } else if(userAgent.indexOf('firefox') != -1) {
        console.log('FireFoxをお使いですね');
    } else if(userAgent.indexOf('opera') != -1) {
        console.log('Operaをお使いですね');
    } else {
        console.log('そんなブラウザは知らん');
    }


    // const mutationObserverTarget = d.querySelectorAll(".p-contents .p-itemSlideIn-wrap");
    // const mutationObserver = new MutationObserver((mutations) => {
    //     mutations.forEach((mutation) => {
    //         // 何かしたいこと
    //         console.log(mutation.target);
    //     });
    // });
    // const mutationObserverOption = {
    //     attributes:true,
    //     // characterData: true,
    //     // subtree: true,
    //     // childList: true,
    // }
    // for(var i=0; i < mutationObserverTarget.length;i++){
    //     mutationObserver.observe(mutationObserverTarget[i],mutationObserverOption);
    // }
    
    w.addEventListener("DOMContentLoaded",() =>{

        (()=>{

            w.addEventListener("load",()=>{
        
            const intersectionObserverOption = {
                // ルートとして指定するDOM（無ければviewport）
                root: document.querySelector('.root'),
                // 上下100px、左右20px手前で発火
                rootMargin: "0px 0px -200px",
                // 交差領域が50%変化するたびに発火
                threshold: [0, 0.5, 1.0]
            };

            const intersectionObserverTarget = d.querySelectorAll(".p-contents > *");
            const intersectionObserver = new IntersectionObserver(callback,intersectionObserverOption);
        
            for(var i=0; i < intersectionObserverTarget.length;i++){
                intersectionObserver.observe(intersectionObserverTarget[i]);
            }

            const shown=(target)=>{
                // if(!target.classList.contains("p-introduction")){
                    let $children = target.querySelectorAll(".p-introduction_text,.p-itemSlideIn-wrap,.c-imageSlideIn-wrap,.c-textSlideIn-wrap,.c-button");
                    console.log(target);
                    console.log($children);
                    for(let i=0; i<$children.length;i++){
                        $children[i].classList.add("is-shown")
                        console.log("target");
                    // }
                }
            }
        
            function callback(entries, object) {
                console.log(entries,object);
                entries.forEach((entry)=>{
                    // 交差していない
                    if (!entry.isIntersecting) return;
            
                    // ターゲット要素
                    console.log(entry);
                    console.log(entry.target);
        
                    shown(entry.target)
            
                    // 監視の解除
                    //object.unobserve(entry.target);
                });
            };
        });

        })();


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
            const $kvCarousel = d.getElementsByClassName("p-kv_carousel")[0];
            const $bannerCarousel = d.getElementsByClassName("p-photoGallery_wrap")[0];
            const time = 5000;

            let changeImage = ($children) => {
                let current = 0;
                domEach($children,(child) => {
                    child.addEventListener('animationend', () => {
                        child.classList.remove('is-animate');
                    });
                })
                return ()=> {
                current = current === $children.length-1?0:current += 1;
                $children[current].classList.add('is-animate');
                }
            }
            let kvAnimate = changeImage($kvCarousel.children);
            let bannerAnimate = changeImage($bannerCarousel.children);

            kvAnimate();
            setInterval(()=>{kvAnimate()},time);
            bannerAnimate ()
            setInterval(()=>{bannerAnimate()},time);

        })();

        if(!(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1 || userAgent.indexOf('edge') != -1)){
            console.log("IE以外");
        //KV→コンテンツ移動
        (()=>{
            w.addEventListener("load",()=>{
                let mousewheelevent = 'wheel';
                const $kvSec = d.getElementsByClassName("p-kv")[0];
                const $mainSec = d.getElementsByClassName("p-contents")[0];
                $kvSec.style.transform = "translate3d(0px,0px,0px)";
                $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)";

                let startY;

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
                    console.log(window.pageYOffset);
                    console.log(e);
                    console.log(e.deltaY);
                    let kvY = parseTranslate3d($kvSec.style.transform)[1];
                    let mainSecY = parseTranslate3d($mainSec.style.transform)[1];
                    const $intro = d.getElementsByClassName("p-introduction")[0];
                    const $text= d.getElementsByClassName("p-introduction_text")[0];
                    const $button = d.querySelector(".p-introduction .c-button");
                    const $lead = d.querySelector(".p-introduction .c-textSlideIn-wrap");
                    const introArray = [$intro,$text,$button,$lead]

                    // console.log(startY);
                    // console.log(e.changedTouches[0].pageY);

                    if(window.pageYOffset == 0 && e.deltaY <= 0){
                        console.log("上")
                        if(mainSecY  == 0){
                            juggeInvalid();
                            w.addEventListener("resize",resize);
                            $mainSec.addEventListener('transitionend', () => {
                                // scroll.disable();
                                d.addEventListener(mousewheelevent,scrollJudge);
                                d.body.style.position="fixed";
                            },{once: true});
                            $kvSec.style.transform = "translate3d(0px,0px,0px)"
                            $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)"
                        }
                    }else if(e.deltaY > 0 || startY > e.changedTouches[0].pageY){
                        console.log("下")
                        if(kvY  == 0){
                            juggeInvalid();
                            $mainSec.addEventListener('transitionend', () => {
                                // scroll.enable();
                                d.addEventListener(mousewheelevent,scrollJudge);
                                // for(let i=0;i < introArray.length;i++){
                                //     introArray[i].classList.add("is-shown");
                                // }
                                d.body.style.position="static";
                            },{once: true});
                            $kvSec.style.transform = "translate3d(0px,-100%,0px)"
                            $mainSec.style.transform = "translate3d(0px,0px,0px)"
                            w.removeEventListener("resize",resize);
                        };
                    }
                }
                let juggeInvalid = (e) =>{
                    // scroll.disable();
                    d.removeEventListener(mousewheelevent,scrollJudge);
                    d.removeEventListener("touchmove",scrollJudge);
                }

                let startData = (e) =>{
                    e.preventDefault();
                    startY = e.touches[0].pageY;
                }

                d.addEventListener(mousewheelevent,scrollJudge);
                d.addEventListener("click",scrollJudge);
                d.addEventListener("touchmove",scrollJudge);
                d.addEventListener("touchstart",startData);
                w.addEventListener("resize",resize);
            });
        })();
        }

            //IE対応用
            if(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1 || userAgent.indexOf('edge') != -1){
                console.log("IE");
                //KV→コンテンツ移動
                (()=>{
                    var preventScroll={
                        x:0,
                        y:0,
                        setPos(x=window.pageXOffset,y=window.pageYOffset){
                            console.log("setPos")
                            this.x=x;
                            this.y=y;
                        },
                        handleEvent(){
                            window.scrollTo(this.x,this.y);
                        },
                        enable(){
                            this.setPos();
                            window.addEventListener("scroll",this);
                        },
                        disable(){
                            window.removeEventListener("scroll",this);
                        }
                    };
                    preventScroll.enable();
                    w.addEventListener("load",()=>{
                        preventScroll.disable();
                        d.body.style.position="static";
                        const $kvSec = d.getElementsByClassName("p-kv")[0];
                        const $mainSec = d.getElementsByClassName("p-contents")[0];
                        const $crazy = d.getElementsByClassName("crazy")[0];


                        // $kvSec.style.transform = "translate3d(0px,0px,0px)";
                        // $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)";
                        
                        $mainSec.style.display = "none";
                        console.log($crazy);
                        $crazy.style.transform = "translate3d(0px,0px,0px)";
                        $crazy.style.transition = "transform .8s cubic-bezier(1,0,0,1) .1s"
                        // $kvSec.style.transition = "transform .8s cubic-bezier(1,0,0,1) .1s"
                        // $mainSec.style.transition = "transform .8s cubic-bezier(1,0,0,1) .1s"

                        let parseTranslate3d = (string) => {
                            var array = string.replace('translate3d', '').match(/-?[\d\.]+/g);
                            for (var i = 0; i < array.length; i++) {
                                array[i] = Number(array[i]);
                            }
                            return array;
                        }
                        let scrollJudge = (e) =>{
                            console.log(window.pageYOffset);
                            console.log($kvSec.offsetHeight);
                            console.log(window.innerHeight);
                            // let kvY = parseTranslate3d($kvSec.style.transform)[1];
                            // let mainSecY = parseTranslate3d($mainSec.style.transform)[1];

                            if($mainSec.style.display == "none" && $kvSec.offsetHeight == window.pageYOffset + window.innerHeight){
                                console.log("下");
                                juggeInvalid();
                                $mainSec.style.display = "block";
                                $crazy.addEventListener('transitionend', function transitionend(e){
                                    console.log("traen下");
                                    preventScroll.disable();
                                    e.currentTarget.removeEventListener(e.type, transitionend);
                                    d.addEventListener("scroll",scrollJudge);
                                });
                                $crazy.style.transform = "translate3d(0px, - "+ $kvSec.offsetHeight + "px,0px)"
                                // $kvSec.style.transform = "translate3d(0px,-"+ window.innerHeight + "px,0px)";
                                // $mainSec.style.transform = "translate3d(0px,-"+ window.innerHeight + "px,0px)";
                            }else if($mainSec.style.display == "block" && window.pageYOffset==0){
                                console.log("上");
                                juggeInvalid();
                                $crazy.addEventListener('transitionend', function transitionend(e){
                                    console.log("traen上");
                                    $mainSec.style.display = "none";
                                    preventScroll.disable();
                                    e.currentTarget.removeEventListener(e.type, transitionend);
                                    d.addEventListener("scroll",scrollJudge);
                                });
                                $crazy.style.transform = "translate3d(0px,0px,0px)"
                                // $kvSec.style.transform = "translate3d(0px,0px,0px)";
                                // $mainSec.style.transform = "translate3d(0px,0px,0px)";
                            }
                        }
                        let resize = (e) =>{
                            console.log("tes");
                            // $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)";
                        }

                        let juggeInvalid = (e) =>{
                            preventScroll.enable();
                            d.removeEventListener("scroll",scrollJudge);
                        }
        
                        d.addEventListener("scroll",scrollJudge);
                    });
                })();
            }

        // (()=>{
        //     w.addEventListener("load",()=>{
        //         const $outline = d.getElementsByClassName("p-outline")[0];
        //         const $children = $outline.children;

        //         w.addEventListener("scroll",()=>{
        //             // for(let i=0 ; i < $children.length;i++){
        //             //     if($children[i].offsetTop < w.pageYOffset){
        //             //         $children[i].classList.add("is-shown");
        //             //     }
        //             // }
        //             for(let i=0 ; i < $children.length;i++){
        //                 if($children[i].offsetTop + ($outline.offsetHeight/2) < w.pageYOffset + w.innerHeight){
        //                     $children[i].classList.add("is-shown");
        //                     for(let j=0 ; j < $children[i].children.length;j++){
        //                         $children[i].children[j].classList.add("is-shown");
        //                     }
        //                 }
        //             }
        //         });
        //         console.log($outline.offsetTop)
        //         console.log($outline.offsetHeight)
        //         // console.log($outline.style.transform)
        //         console.log(window.innerHeight)
        //         console.log(window.outerHeight)

        //     })
        // })();

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
                // d.addEventListener(mousewheelevent,function(){
                //     console.log("ホイール");
                // });