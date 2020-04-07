import '../polyfill//object-fit-images-master/dist/ofi.min.js';
import '../polyfill/IntersectionObserver-master/polyfill/intersection-observer.js';

((w,d) =>{
    //d.body.style.position="fixed";
    //d.body.scrollTop = d.documentElement.scrollTop = 0;

     // HTMLcollectionやNodeListをforEachで回すための関数
    const domEach = ( elements , callback ) => {
        Array.prototype.forEach.call( elements ,(element ,index) => {
            callback( element,index );
        });
    }
    var userAgent = window.navigator.userAgent.toLowerCase();
    
    w.addEventListener("DOMContentLoaded",() =>{
        
        (()=>{
            
            const $kvCarousel = d.getElementsByClassName("p-kv_carousel")[0];
            const $kv_pager = d.getElementsByClassName("p-kv_pager")[0];
            const $bannerCarousel = d.getElementsByClassName("p-photoGallery_wrap_in")[0];
            const kvTime = 5000;
            const bannerTime = 4000;

            //フォトカルーセル
            const changeImage = ($children,$pager) => {
                let current = -1;
                domEach($children,(child) => {
                    child.addEventListener('animationend', () => {
                        child.classList.remove('is-animate');
                    });
                })
                return ()=> {
                    current = current === $children.length-1?0:current += 1;
                    $children[current].classList.add('is-animate');

                    //pager付きのみpage送り
                    if($pager){
                        for(var i=0;i < $pager.children.length;i++){
                            $pager.children[i].classList.remove('is-active');
                        }
                        $pager.children[current].classList.add('is-active');
                    }
                }
            }
            const kvAnimate = changeImage($kvCarousel.children,$kv_pager );
            const bannerAnimate = changeImage($bannerCarousel.children);

            //KVtext
            (()=>{
                const $lead = d.getElementsByClassName("p-kv_textBox_lead")[0];
                w.addEventListener("load",function(){
                    $lead.classList.add("is-active");
                    domEach($lead.children,(child) => {
                        child.addEventListener('transitionend', function textTransitionend(e){
                            e.currentTarget.removeEventListener(e.type, textTransitionend);
                            child.classList.add("is-show")
                            //全てのテキストアニメーションが終了したら、KVスライダーを始動
                            if(child == $lead.lastElementChild){
                                kvAnimate();
                                setInterval(()=>{kvAnimate()},kvTime);
                            }
                        });
                    })
                });
            })();

            w.addEventListener("load",()=>{
                const $mainSec = d.getElementsByClassName("p-contents")[0];

                //intersectionObserで各セクション交差を判定
                const intersectionObserverOption = {
                    // ルートとして指定するDOM（無ければviewport）
                    root:null,
                    // 上下100px、左右20px手前で発火
                    rootMargin: "0px 0px -100px",
                    // 交差領域が50%変化するたびに発火
                    threshold: [0, 0.5, 1.0]
                };

                const intersectionObserverTarget = d.querySelectorAll(".p-contents > * , .l-footer");
                const intersectionObserver = new IntersectionObserver(callback,intersectionObserverOption);
            
                for(var i=0; i < intersectionObserverTarget.length;i++){
                    intersectionObserver.observe(intersectionObserverTarget[i]);
                }

                // 交差したセクションがshown関数実行
                const shown=(target)=>{
                        let $children = target.querySelectorAll(".p-introduction_text,.p-itemSlideIn,.c-imageSlideIn,.c-textSlideIn,.c-button_in");

                        //kvからの移動後すぐに交差するセクションのみkvアニメ終了を待機
                        if($mainSec.classList.contains('is-animate')){
                            $mainSec.addEventListener('transitionend', function textTransitionend(e){
                                e.currentTarget.removeEventListener(e.type, textTransitionend);
                                for(let i=0; i<$children.length;i++){
                                        $children[i].classList.add("is-shown")
                                }
                            });
                        }else{
                            for(let i=0; i<$children.length;i++){
                                $children[i].classList.add("is-shown")
                            }
                        }
                        //photogalleryセクションに交差した際にフォトスライダーを始動
                        if(target.classList.contains("p-photoGallery")){
                            bannerAnimate ()
                            setInterval(()=>{bannerAnimate()},bannerTime);
                        }
                }

                function callback(entries, object) {
                    entries.forEach((entry)=>{
                        // 交差していない
                        if (!entry.isIntersecting) return;
                        // ターゲット要素
                        shown(entry.target)
                        // 監視の解除
                        object.unobserve(entry.target);
                    });
                };
            });

        })();


        //nav
        (()=>{
            const $hambuger = d.getElementsByClassName("l-nav_hamburger")[0];
            const $popup = d.getElementsByClassName("l-nav_popup")[0];
            const $logo = d.getElementsByClassName("l-nav_logo")[0];
            const navsArray = [$hambuger,$popup,$logo]
            
            const $navLink = d.querySelectorAll(".l-nav_popup_items span");
            const $navChildren = d.getElementsByClassName("l-nav_popup_children");
            const $popupList = d.getElementsByClassName("l-nav_popup_list")[0];
            const $popupBg = d.getElementsByClassName("l-nav_popup_bg")[0];

            let preIndex = null;
            let preChild =null;

            const openChild = (child,index) => {
                child.classList.add('is-opened');
                $navChildren[index].classList.add("is-opened");
                $popupList.classList.add("is-openedChild");
                $popupBg.classList.add("is-openedChild");
                preIndex = index;
                preChild = child;
            }

            const closeChild = (child,index) => {
                child.classList.remove('is-opened');
                $navChildren[index].classList.remove("is-opened");
                $popupList.classList.remove("is-openedChild");
                $popupBg.classList.remove("is-openedChild");
                preIndex = null;
                preChild = null;
            }

            $hambuger.addEventListener("click",() =>{
                if(!$popup.classList.contains("is-opened")){
                    for(let i=0;i < navsArray.length;i++){
                        navsArray[i].classList.add("is-opened")
                    }
                }else{
                    for(let i=0;i < navsArray.length;i++){
                        navsArray[i].classList.remove("is-opened")
                    }
                    closeChild(preChild,preIndex)
                }
            });
            domEach($navLink,(child,index) => {
                child.addEventListener("click", () => {
                    if(preIndex === null){
                        openChild(child,index);
                    }else if(preIndex != index){
                        $navChildren[preIndex].classList.remove("is-opened");
                        $navLink[preIndex].classList.remove("is-opened")
                        openChild(child,index);
                    }else{
                        closeChild(child,index)
                    }
                });
            })

        })();

        (()=>{
            //KV→コンテンツ移動
            if(!(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1 || userAgent.indexOf('edge') != -1)){
                //console.log("IE以外");
                w.addEventListener("load",()=>{
                    let mousewheelevent = 'wheel';
                    const $kvSec = d.getElementsByClassName("p-kv")[0];
                    const $mainSec = d.getElementsByClassName("p-contents")[0];
                    $kvSec.style.transform = "translate3d(0px,0px,0px)";
                    $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)";

                    let kvY,mainSecY
                    let startY;

                    //transdorm:translste3dの値を返す関数
                    let parseTranslate3d = (string) => {
                        var array = string.replace('translate3d', '').match(/-?[\d\.]+/g);
                        for (var i = 0; i < array.length; i++) {
                            array[i] = Number(array[i]);
                        }
                        return array;
                    }
                    //デスクトップ・マウス端末の場合にイベントリスナで使用するオブジェクト
                    let wheel = {
                        name:'wheel',
                        up:(e)=>{
                            if(window.pageYOffset <= 0 && e.deltaY <= 0){
                                return true;
                            }else{
                                return false;
                            }
                        },
                        down:(e)=>{
                            if(e.deltaY > 0){
                                return true;
                            } else{
                                return false;
                            }
                        }
                    }
                    //モバイル・タッチ端末の場合にイベントリスナで使用するオブジェクト
                    let touch = {
                        name:'touchmove',
                        up:(e)=>{
                            if(window.pageYOffset <= 0 && startY < e.changedTouches[0].pageY){
                                return true;
                            }else{
                                return false;
                            }
                        },
                        down:(e)=>{
                            if(startY > e.changedTouches[0].pageY){
                                return true;
                            } else{
                                return false;
                            }
                        }
                    }
                    //モバイルの場合のスワイプ方向を取るためのスタート位置を測定
                    let startData = (e) =>{
                        e.preventDefault();
                        startY = e.touches[0].pageY;
                    }
                    //whellした際のメイン処理
                    let scrollJudge = function(e){

                        kvY = parseTranslate3d($kvSec.style.transform)[1];
                        mainSecY = parseTranslate3d($mainSec.style.transform)[1];
                        $mainSec.style.transition = "transform .8s cubic-bezier(1,0,0,1) .1s"

                        console.log('testtt')
                        if(this.event.up(e)){
                            // console.log("上")
                            if(mainSecY  == 0){
                                e.currentTarget.removeEventListener(this.event.name,this);
                                d.body.style.overflow="hidden";
                                $mainSec.addEventListener('transitionend', () => {
                                    w.addEventListener(this.event.name,{handleEvent: this.handleEvent,event:this.event});
                                    d.body.style.position="fixed";
                                    d.body.style.overflow="auto";
                                },{once: true});
                                $kvSec.style.transform = "translate3d(0px,0px,0px)"
                                $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)"
                            }
                        }else if(this.event.down(e)){
                            // console.log("下")
                            if(kvY  == 0){
                                e.currentTarget.removeEventListener(this.event.name,this);
                                $mainSec.classList.add('is-animate');
                                $mainSec.addEventListener('transitionend', () => {
                                    w.addEventListener(this.event.name,{handleEvent: this.handleEvent,event:this.event});
                                    $mainSec.classList.remove('is-animate');
                                    d.body.style.position="static";
                                },{once: true});
                                $kvSec.style.transform = "translate3d(0px,-100%,0px)"
                                $mainSec.style.transform = "translate3d(0px,0px,0px)"
                            };
                        }
                    }

                    const resize = ()=>{
                        kvY = parseTranslate3d($kvSec.style.transform)[1];
                        if(kvY  == 0){
                            $mainSec.style.transform = "translate3d(0px,"+ window.innerHeight +"px,0px)";
                        }
                    }

                    w.addEventListener("resize",resize);
                    w.addEventListener("touchstart",startData);
                    w.addEventListener(mousewheelevent,{handleEvent: scrollJudge,event:wheel});
                    w.addEventListener("touchmove",{handleEvent: scrollJudge,event:touch});
                });
            }
        })();



        (()=>{
            //KV→コンテンツ移動
            //IE・edge対応用　whellイベントリスナでのタッチパッドの値が取れないので、scrollで代用
            if(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1 || userAgent.indexOf('edge') != -1){
                //console.log("ie,edge");
                window.addEventListener('beforeunload', function(e){
                    d.body.scrollTop = d.documentElement.scrollTop = 0;
                    window.location.reload(false);
                });
                //scroll抑制用オブジェクト
                var preventScroll={
                    x:0,
                    y:0,
                    setPos(x=window.pageXOffset,y=window.pageYOffset){
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
                    const $footer = d.getElementsByClassName("l-footer")[0];

                    $kvSec.style.transform = "translate3d(0px,0px,0px)";
                    $mainSec.style.transform = "translate3d(0px,100%,0px)";

                    let parseTranslate3d = (string) => {
                        var array = string.replace('translate3d', '').match(/-?[\d\.]+/g);
                        for (var i = 0; i < array.length; i++) {
                            array[i] = Number(array[i]);
                        }
                        return array;
                    }

                    let kvY = parseTranslate3d($kvSec.style.transform)[1];
                    let mainSecY = parseTranslate3d($mainSec.style.transform)[1];

                    let scrollJudgeUp = (e) =>{
                        kvY = parseTranslate3d($kvSec.style.transform)[1];
                        mainSecY = parseTranslate3d($mainSec.style.transform)[1];
                        console.log(kvY)
                        console.log(mainSecY)
                        if(window.pageYOffset==0){
                            if(kvY == '-100'){
                                w.removeEventListener("scroll",scrollJudgeUp);
                                //console.log("上");
                                preventScroll.enable();
                                $kvSec.addEventListener('transitionend', function transitionendUp(e){
                                    e.currentTarget.removeEventListener(e.type, transitionendUp);
                                    w.addEventListener("scroll",scrollJudge);
                                    preventScroll.disable();
                                });
                                $kvSec.style.transform = "translate3d(0px,0px,0px)";
                                $mainSec.style.transform = "translate3d(0px,100%,0px)";
                            }
                        }
                    }
                    
                    let scrollJudge = (e) =>{
                        $kvSec.style.transition = "transform .8s cubic-bezier(1,0,0,1) .1s"
                        $mainSec.style.transition = "transform .8s cubic-bezier(1,0,0,1) .1s"
                        kvY = parseTranslate3d($kvSec.style.transform)[1];
                        if($kvSec.offsetHeight + 10 <= window.pageYOffset + window.innerHeight){
                            if(kvY == '0'){
                                $mainSec.classList.add('is-animate');
                                w.removeEventListener("scroll",scrollJudge);
                                //console.log("下");
                                preventScroll.enable();
                                $mainSec.addEventListener('transitionend', function transitionendDown(e){
                                    e.currentTarget.removeEventListener(e.type, transitionendDown);
                                    preventScroll.disable();
                                    w.addEventListener("scroll",scrollJudgeUp);
                                    $mainSec.classList.remove('is-animate');
                                });
                                $kvSec.style.transform = "translate3d(0px,-100%,0px)";
                                $mainSec.style.transform = "translate3d(0px,"+ window.pageYOffset + "px,0px)";
                                $footer.style.transform = "translate3d(0px," + window.pageYOffset + "px,0px)";
                            }
                        }
                    }

                    w.addEventListener("scroll",scrollJudge);
                });
            }
        })();

    });
})(window,document);