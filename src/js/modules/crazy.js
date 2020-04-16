import '../polyfill//object-fit-images-master/dist/ofi.min.js';
import '../polyfill/IntersectionObserver-master/polyfill/intersection-observer.js';

((w,d) =>{
     // HTMLcollectionやNodeListをforEachで回すための関数
    const domEach = ( elements , callback ) => {
        Array.prototype.forEach.call( elements ,(element ,index) => {
            callback( element,index );
        });
    }
    const userAgent = navigator.userAgent.toLowerCase();
    const isIeEdge = userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1 || userAgent.indexOf('edge') != -1;

    w.addEventListener('DOMContentLoaded',() =>{

        (()=>{
            //desktopスタイル時のfloat回り込み防止
            w.addEventListener('load',function(){
                const pcWidth = window.matchMedia('(orientation: landscape) , (min-width: 768px)');
                const list = d.getElementsByClassName('js-setSize');

                const removeSize = ()=>{
                    for(let i=0; i < list.length;i++){
                        list[i].children[0].setAttribute("style","");
                    }
                }
                const setSize = ()=>{
                    removeSize();
                    for(let i=0; i < list.length;i++){
                        console.log(list[i].clientHeight)
                        list[i].children[0].style.height = list[i].clientHeight + 'px';
                    }
                }
                
                const checkBP = ()=> {
                    if (pcWidth.matches) {
                    //PCの処理
                        w.addEventListener('resize', setSize);
                    } else {
                    //SPの処理
                        removeSize();
                        w.removeEventListener('resize', setSize);
                    }
                }
                pcWidth.addListener(checkBP)
                checkBP();
            });
        })();

        (()=>{
            const kvCarousel = d.getElementById('js-kv_carousel');
            const kv_pager = d.getElementById('js-kv_pager');
            const bannerCarousel = d.getElementById('js-photoGallery_carousel');
            const kvTime = 5000;
            const bannerTime = 4000;

            //フォトカルーセル
            const changeImage = (children,pager) => {
                let current = -1;
                const isAnimate = 'is-animate';
                domEach(children,(child) => {
                    child.addEventListener('animationend', () => {
                        child.classList.remove(isAnimate);
                    });
                })
                return ()=> {
                    current = current === children.length-1?0:current += 1;
                    children[current].classList.add(isAnimate);

                    //pager付きのみpage送り
                    if(pager){
                        for(let i=0;i < pager.children.length;i++){
                            pager.children[i].classList[ current === i ? 'add' : 'remove' ]('is-active');
                        }
                    }
                }
            }
            const kvAnimate = changeImage(kvCarousel.children,kv_pager );
            const bannerAnimate = changeImage(bannerCarousel.children);

            //KVtext
            (()=>{
                const lead = d.getElementById('js-kv_textBox_lead');
                const isActive = 'is-active'
                const isShow = 'is-show'
                w.addEventListener('load',()=>{
                    lead.classList.add(isActive);
                    domEach(lead.children,(child) => {
                        child.addEventListener('transitionend', function textTransitionend(e){
                            e.currentTarget.removeEventListener(e.type, textTransitionend);
                            child.classList.add(isShow)
                            //全てのテキストアニメーションが終了したら、KVスライダーを始動
                            if(child == lead.lastElementChild){
                                kvAnimate();
                                setInterval(()=>{kvAnimate()},kvTime);
                            }
                        });
                    })
                });
            })();

            w.addEventListener('load',()=>{
                const mainSec = d.getElementById('js-contents');

                //intersectionObserで各セクション交差を判定
                const intersectionObserverOption = {
                    // ルートとして指定するDOM（無ければviewport）
                    root:null,
                    // 上下100px、左右20px手前で発火
                    rootMargin: '0px 0px -100px',
                    // 交差領域が50%変化するたびに発火
                    threshold: [0, 0.5, 1.0]
                };

                const intersectionObserverTarget = d.getElementsByClassName('js-intersection');
                const intersectionObserver = new IntersectionObserver(callback,intersectionObserverOption);
            
                for(let i=0; i < intersectionObserverTarget.length;i++){
                    intersectionObserver.observe(intersectionObserverTarget[i]);
                }

                // 交差したセクションがshown関数実行
                const shown=(target)=>{
                        const children = target.getElementsByClassName('js-shown');
                        const isShown = 'is-shown';
                        const isAnimate = 'is-animate';

                        //kvからの移動後すぐに交差するセクションのみkvアニメ終了を待機
                        if(mainSec.classList.contains(isAnimate)){
                            mainSec.addEventListener('transitionend', function textTransitionend(e){
                                e.currentTarget.removeEventListener(e.type, textTransitionend);
                                for(let i=0; i<children.length;i++){
                                        children[i].classList.add(isShown)
                                }
                            });
                        }else{
                            for(let i=0; i<children.length;i++){
                                children[i].classList.add(isShown)
                            }
                        }
                        //photogalleryセクションに交差した際にフォトスライダーを始動
                        if(target.classList.contains('p-photoGallery')){
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
            const hambuger = d.getElementById('js-nav_hamburger');
            const popup = d.getElementById('js-nav_popup');
            const logo = d.getElementById('js-nav_logo');
            const navsArray = [hambuger,popup,logo]
            
            const navLink = d.getElementsByClassName('js-openChild');
            const navChildren = d.getElementsByClassName('js-nav_popup_children');
            const popupList = popup.children[0];
            const popupBg = popup.children[1];

            const isOpened = 'is-opened';
            const isOpenedChild = 'is-openedChild';

            let preIndex = null;
            let preChild =null;

            const openChild = (child,index) => {
                child.classList.add(isOpened);
                navChildren[index].classList.add(isOpened);
                popupList.classList.add(isOpenedChild );
                popupBg.classList.add(isOpenedChild );
                preIndex = index;
                preChild = child;
            }

            const closeChild = (child,index) => {
                child.classList.remove('is-opened');
                navChildren[index].classList.remove(isOpened);
                popupList.classList.remove(isOpenedChild );
                popupBg.classList.remove(isOpenedChild );
                preIndex = null;
                preChild = null;
            }

            hambuger.addEventListener('click',() =>{
                if(!popup.classList.contains(isOpened)){
                    for(let i=0;i < navsArray.length;i++){
                        navsArray[i].classList.add(isOpened)
                    }
                }else{
                    for(let i=0;i < navsArray.length;i++){
                        navsArray[i].classList.remove(isOpened)
                    }
                    closeChild(preChild,preIndex)
                }
            });
            domEach(navLink,(child,index) => {
                child.addEventListener('click', () => {
                    if(preIndex === null){
                        openChild(child,index);
                    }else if(preIndex != index){
                        navChildren[preIndex].classList.remove(isOpened);
                        navLink[preIndex].classList.remove(isOpened)
                        openChild(child,index);
                    }else{
                        closeChild(child,index)
                    }
                });
            })

        })();

        (()=>{
            const kvSec = d.getElementById('js-kv');
            const mainSec = d.getElementById('js-contents');
            const transition = 'transform .8s cubic-bezier(1,0,0,1) .1s'
            //transdorm:translste3dの値を返す関数
            const parseTranslate3d = string => {
                return string.replace('translate3d', '').match(/-?[\d\.]+/g).map( value =>{ return Number( value ) });
            }
            
            //KV→コンテンツ移動
            if(!isIeEdge){
                //console.log('ie/edge以外');
                w.addEventListener('load',()=>{
                    let kvY,mainSecY;
                    let startY;

                    kvSec.style.transform = 'translate3d(0px,0px,0px)';
                    mainSec.style.transform = 'translate3d(0px,'+ w.innerHeight +'px,0px)';

                    //デスクトップ・マウス端末の場合にイベントリスナで使用するオブジェクト
                    const wheel = {
                        name:'wheel',
                        up:(e)=>{return (w.pageYOffset <= 0 && e.deltaY <= 0)?true:false;},
                        down:(e)=>{return (e.deltaY > 0)?true:false;}
                    }
                    //モバイル・タッチ端末の場合にイベントリスナで使用するオブジェクト
                    const touch = {
                        name:'touchmove',
                        up:(e)=>{return (w.pageYOffset <= 0 && startY < e.changedTouches[0].pageY)?true:false;},
                        down:(e)=>{return (startY > e.changedTouches[0].pageY)?true:false;}
                    }
                    //モバイルの場合のスワイプ方向を取るためのスタート位置を測定
                    const startData = (e) =>{
                        e.preventDefault();
                        startY = e.touches[0].pageY;
                    }
                    //whellした際のメイン処理
                    const scrollJudge = function(e){
                        const self = this;
                        kvY = parseTranslate3d(kvSec.style.transform)[1];
                        mainSecY = parseTranslate3d(mainSec.style.transform)[1];
                        mainSec.style.transition = transition;

                        if(self.event.up(e)){
                            // console.log('上へのスクロール')
                            if(mainSecY  == 0){
                                e.currentTarget.removeEventListener(self.event.name,self);
                                d.body.style.overflow='hidden';
                                mainSec.addEventListener('transitionend', () => {
                                    w.addEventListener(self.event.name,{handleEvent: self.handleEvent,event:self.event});
                                    d.body.style.position='fixed';
                                    d.body.style.overflow='auto';
                                },{once: true});
                                kvSec.style.transform = 'translate3d(0px,0px,0px)'
                                mainSec.style.transform = `translate3d(0px,${ innerHeight }px,0px)`
                            }
                        }else if(self.event.down(e)){
                            // console.log('下へのスクロール')
                            if(kvY  == 0){
                                e.currentTarget.removeEventListener(self.event.name,self);
                                mainSec.classList.add('is-animate');
                                mainSec.addEventListener('transitionend', () => {
                                    w.addEventListener(self.event.name,{handleEvent: self.handleEvent,event:self.event});
                                    mainSec.classList.remove('is-animate');
                                    d.body.style.position='static';
                                },{once: true});
                                kvSec.style.transform = 'translate3d(0px,-100%,0px)'
                                mainSec.style.transform = 'translate3d(0px,0px,0px)'
                            };
                        }
                    }

                    const resize = ()=>{
                        kvY = parseTranslate3d(kvSec.style.transform)[1];
                        if(kvY  == 0){
                            mainSec.style.transform = `translate3d(0px,${ innerHeight }px,0px)`
                        }
                    }

                    w.addEventListener('resize',resize);
                    w.addEventListener('touchstart',startData);
                    w.addEventListener('wheel',{handleEvent: scrollJudge,event:wheel});
                    w.addEventListener('touchmove',{handleEvent: scrollJudge,event:touch});
                });
            }else{
                //console.log('ie,edge');
                w.addEventListener('beforeunload', () => {
                    d.body.scrollTop = d.documentElement.scrollTop = 0;
                    w.location.reload(false);
                });
                //scroll抑制用オブジェクト
                const preventScroll={
                    x:0,
                    y:0,
                    setPos(x=w.pageXOffset,y=w.pageYOffset){
                        this.x=x;
                        this.y=y;
                    },
                    handleEvent(){
                        w.scrollTo(this.x,this.y);
                    },
                    enable(){
                        this.setPos();
                        w.addEventListener('scroll',this);
                    },
                    disable(){
                        w.removeEventListener('scroll',this);
                    }
                };
                preventScroll.enable();

                w.addEventListener('load',()=>{
                    const footer = d.getElementById('js-footer');
                    let kvY;

                    preventScroll.disable();
                    kvSec.style.transform = 'translate3d(0px,0px,0px)';
                    mainSec.style.transform = `translate3d(0px,${ innerHeight }px,0px)`
                    
                    const scrollJudge = () =>{
                        kvSec.style.transition = transition
                        mainSec.style.transition = transition
                        kvY = parseTranslate3d(kvSec.style.transform)[1];

                        if(kvSec.offsetHeight + 10 <= w.pageYOffset + w.innerHeight){
                            if(kvY == '0'){
                                // console.log('下へのスクロール')
                                mainSec.classList.add('is-animate');
                                w.removeEventListener('scroll',scrollJudge);
                                preventScroll.enable();
                                mainSec.addEventListener('transitionend', function transitionendDown(e){
                                    e.currentTarget.removeEventListener(e.type, transitionendDown);
                                    preventScroll.disable();
                                    w.addEventListener('scroll',scrollJudge);
                                    mainSec.classList.remove('is-animate');
                                });
                                kvSec.style.transform = 'translate3d(0px,-100%,0px)';
                                mainSec.style.transform = `translate3d(0px,${w.pageYOffset}px,0px)`;
                                footer.style.transform = `translate3d(0px,${w.pageYOffset}px,0px)`;
                            }
                        }else if(w.pageYOffset==0){
                            if(kvY == '-100'){
                                // console.log('上へのスクロール')
                                w.removeEventListener('scroll',scrollJudge);
                                preventScroll.enable();
                                kvSec.addEventListener('transitionend', function transitionendUp(e){
                                    e.currentTarget.removeEventListener(e.type, transitionendUp);
                                    w.addEventListener('scroll',scrollJudge);
                                    preventScroll.disable();
                                });
                                kvSec.style.transform = 'translate3d(0px,0px,0px)';
                                mainSec.style.transform = `translate3d(0px,${w.innerHeight}px,0px)`;
                            }
                        }
                    }

                    const resize = ()=>{
                        kvY = parseTranslate3d(kvSec.style.transform)[1];
                        if(kvY  == 0){
                            mainSec.style.transform = `translate3d(0px,${ innerHeight }px,0px)`
                        }
                    }

                    w.addEventListener('resize',resize);
                    w.addEventListener('scroll',scrollJudge);
                });
            }
        })();

    });
})(window,document);