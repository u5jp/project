// const $ = require("jquery"); //他の記述法
import $ from "jquery"
// import "slick-carousel"
// import "../../node_modules/slick-carousel/slick/slick.css"
// import "../../node_modules/slick-carousel/slick/slick-theme.css"
//import '../../dist/css/crazy/index.css';
import crazy from './modules/crazy.js';

const babel = () => {
    console.log("hello World")
    console.dir($);
}

babel()
