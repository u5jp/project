// gulpプラグインの読み込み
const gulp = require("gulp");

const sass = require("gulp-sass");

const postcss = require("gulp-postcss");
const flexBugsFixes = require("postcss-flexbugs-fixes");
const cssWring = require("csswring");

const autoprefixer = require("autoprefixer");
const autoprefixerOption = {
  grid:true
}

const postcssOption = [ 
  flexBugsFixes,
  autoprefixer(autoprefixerOption) ,
  cssWring
]

const browserSync = require("browser-sync").create()
const browserSyncOption = {
  server:"./dist"
}

// style.scssをタスクを作成する
gulp.task("sass", function() {
  return gulp.src("./src/**/*.scss")
  .pipe(sass())
  .pipe(postcss(postcssOption))
  .pipe(gulp.dest("./dist"))
});

gulp.task("watch",() => {
  return gulp.watch("./src/**/*.scss",gulp.series("sass"))
})

gulp.task("serve",(done) =>{
  browserSync.init(browserSyncOption)
  done()
})

gulp.task("browsersync",(=>{
  const browserReload = (done) =>{
    browserSync.reload()
    done()
  }
  gulp.watch("./dist/**/*",browserReload)
})

gulp.task("default",gulp.series("serve","browsersync"))


// // style.scssをタスクを作成する
// gulp.task("default", function() {
//   // style.scssファイルを取得
//   return (
//     gulp
//       .src("css/style.scss")
//       // Sassのコンパイルを実行
//       .pipe(sass())
//       // cssフォルダー以下に保存
//       .pipe(gulp.dest("css"))
//   );
// });