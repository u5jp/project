// gulpプラグインの読み込み
const gulp = require("gulp");

const sass = require("gulp-sass");
const sassGlob = require("gulp-sass-glob");

const rename = require("gulp-rename");

const postcss = require("gulp-postcss");
const flexBugsFixes = require("postcss-flexbugs-fixes");
const cssWring = require("csswring");

const mqpacker = require("css-mqpacker");

const autoprefixer = require("autoprefixer");
const autoprefixerOption = {
  grid:true
}

const postcssOption = [ 
  flexBugsFixes,
  autoprefixer(autoprefixerOption) ,
  cssWring,
  mqpacker()
]

const browserSync = require("browser-sync").create()
const browserSyncOption = {
  server:"./dist"
}

const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

const fs = require("fs")
const ejs = require("gulp-ejs")
const htmlmin = require('gulp-htmlmin')

// JSONファイルの読み込みと変換
const configJsonData = fs.readFileSync('./src/config.json')
const configObj = JSON.parse(configJsonData)

const ejsDataOption = {
  config: configObj
}
//多分効いてないからなしでもOK?
const ejsSettingOption = {
  ext:'.html'
}
//

// htmlminの設定
const htmlminOption = {
  collapseWhitespace: true
}

//ejs path用
const data = require('gulp-data');
const src = {
  root: 'src/',
  ejs: ['src/**/*.ejs', '!src/**/_*.ejs'],
  data: 'src/_data/',
};

//image圧縮
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')

const imageminOption = [
  imageminPngquant({ quality: [.7, .85] }),
  imagemin.mozjpeg({ quality: [90] }),
  imagemin.gifsicle(),
  imagemin.optipng(),
  imagemin.svgo()
]

// style.scssをタスクを作成する
gulp.task("sass",() => {
  return gulp.src("./src/**/*.scss")
  .pipe(sassGlob())
  .pipe(sass())
  .pipe(postcss(postcssOption))
  .pipe(rename(function(path){
    path.dirname = path.dirname.replace( "sass", "css");
  }))
  .pipe(gulp.dest("./dist"))
});

gulp.task("html",() => {
  return gulp.src("./src/**/*.html")
  .pipe(gulp.dest("./dist"))
});

gulp.task("bundle",() =>{
  return webpackStream(webpackConfig,webpack)
  .on('error', (e) => {this.emit('end');})
  .pipe(gulp.dest("./dist"))
})

gulp.task("watch",() => {
  // gulp.watch('./src/sass/**/*.scss', gulp.series('sass'))
  // gulp.watch('./src/html/**/*.ejs', gulp.series('ejs'))
  // gulp.watch('./src/html/**/*.html', gulp.series('html'))
  // gulp.watch('./src/js/**/*.js', gulp.series('bundle'))
  return gulp.watch('./src/**/*', gulp.series("sass","ejs","bundle","html"))
})

gulp.task("serve",(done) =>{
  browserSync.init(browserSyncOption)
  done()
})

gulp.task("browsersync",() =>{
  const browserReload = (done) =>{
    browserSync.reload()
    done()
  }
  gulp.watch("./dist/**/*",browserReload)
})

gulp.task("default",gulp.series("serve","browsersync"))


gulp.task("ejs",() => {
  return gulp
    .src(["./src/**/*.ejs","!./src/**/_*.ejs"])
    .pipe(
      data(file => {
        const absolutePath = `/${file.path
          .split(src.root)
          [file.path.split(src.root).length - 1].replace('.ejs', '.html')
          .replace(/index\.html$/, '')}`;
        const relativePath = '../'.repeat([absolutePath.split('/').length - 2]);
        return {
          absolutePath,
          relativePath,
        };
      }),
    )
    .pipe(ejs(ejsDataOption, {},ejsSettingOption))
    .pipe(rename({ extname: ".html" }))
    .pipe(htmlmin(htmlminOption))
    .pipe(gulp.dest("./dist"))
})

gulp.task('imagemin', () => {
  return gulp
    .src('src/**/images/**')
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest('./dist'))
})