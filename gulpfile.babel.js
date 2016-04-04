import gulp from 'gulp'
import symlink from  'gulp-sym'
import babel from 'gulp-babel'
import concat from 'gulp-concat'
import cleanCSS from 'gulp-clean-css'
import htmlmin from 'gulp-htmlmin'
import uglify from 'gulp-uglify'
import rimraf from 'gulp-rimraf'
import install from 'gulp-install'
import zip from 'gulp-zip'
import imagemin from 'gulp-imagemin'
import pngquant from 'imagemin-pngquant'
import runSequence from 'run-sequence'

/* Build Tasks */

gulp.task('build-js', () => gulp.src('src/**/*.js')
          .pipe(babel())
          .pipe(uglify())
          .pipe(gulp.dest('build')))

gulp.task('build-html', () => gulp.src('src/**/*.html')
          .pipe(htmlmin({ collapseWhitespace: true, removeComments: true}))
          .pipe(gulp.dest('build'))
          .pipe(symlink('build/splash.html', {relative: true}))
)

gulp.task('build-styles', () => {
    gulp.src('src/css/**/*.css')
        .pipe(cleanCSS())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('build/css'))

    return gulp.src('src/vendor/**/*.css')
        .pipe(cleanCSS())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('build/css'))
})

gulp.task('build-static-assets', () => {
  gulp.src('src/img/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('build/img'))
})

gulp.task('clean-build', () => gulp.src(['build', 'release'], { read: false }).pipe(rimraf()))

gulp.task('zip-release', () => gulp.src('build/**/*')
    .pipe(zip('bundle.zip'))
    .pipe(gulp.dest('release')))

/* npm tasks */

gulp.task('build', callback => runSequence('clean-build', 'build-js', 'build-html', 'build-styles', 'build-static-assets','zip-release', callback))
