import gulp from 'gulp';
import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import sassdoc from 'sassdoc';
import stylish from 'tslint-stylish';
import stripAnsi from 'strip-ansi';
import webpackStream from 'webpack-stream';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import del from 'del';
import { Server as KarmaServer } from 'karma';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

function lint(files, emitError = true) {
  return gulp.src(files)
    .pipe($.tslint())
    .pipe($.tslint.report(stylish, {
      emitError
    }));
}

function runKarma(singleRun, cb = null, configFile = './karma.unit.conf.js') {
  new KarmaServer({
    configFile: path.resolve(__dirname, configFile),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, cb).start()
}

function sassCompile(output = './.tmp/styles', outputStyle = 'nested') {
  return gulp.src(['./src/styles/**/*.scss'])
    .pipe($.scssLint({ 'bundleExec': true }))
    .pipe(sassdoc())
    .pipe($.sourcemaps.init())
    .pipe($.sass({ includePaths: './bower_components', outputStyle }).on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(output));
}

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('tslint:src', lint.bind(null, './src/scripts/**/*.ts'));

gulp.task('tslint:test', lint.bind(null, './test/**/*.ts'));

gulp.task('webpack:src', ['tslint:src'], () => gulp.src('./src/scripts/main.ts')
  .pipe(webpackStream(require('./webpack.dev.config')))
  .pipe(gulp.dest('./.tmp/scripts')));

gulp.task('webpack:serve', () => gulp.src(['./src/scripts/main.ts', './test/*/main.ts'])
  .pipe(webpackStream(require('./webpack.serve.config')))
  .pipe(gulp.dest('./.tmp/scripts')));

gulp.task('sass:dev', () => sassCompile());

gulp.task('sass:watch', () => sassCompile().pipe(reload({ stream: true })));

gulp.task('test:unit', (done) => runKarma(true, done));

gulp.task('test:e2e', (done) => runKarma(true, done, './karma.e2e.conf.js'));

gulp.task('test', ['tslint:src', 'tslint:test', 'test:unit', 'test:e2e']);

gulp.task('watch', ['sass:dev'], () => {
  runKarma(false);

  gulp.watch('./src/scripts/**/*.ts', ['tslint:src']);
  gulp.watch('./test/**/*.ts', ['tslint:test']);
  gulp.watch('./src/styles/**/*.scss', ['sass:watch']);
});

gulp.task('serve', ['clean', 'test', 'webpack:serve', 'sass:dev'], () => {
  let webpackConfig = require('./webpack.serve.config');
  let bundler = webpack(webpackConfig);

  runKarma(false);

  bundler.plugin('done', function (stats) {
    if (stats.hasErrors() || stats.hasWarnings()) {
      return browserSync.sockets.emit('fullscreen:message', {
        title: "Webpack Error:",
        body:  stripAnsi(stats.toString()),
        timeout: 100000
      });
    }
    reload();
  });

  gulp.watch('./src/scripts/**/*.ts', ['tslint:src']);
  gulp.watch('./test/**/*.ts', ['tslint:test']);
  gulp.watch('./src/styles/**/*.scss', ['sass:watch']);
  gulp.watch(['./examples/*.html']).on('change', reload);

  browserSync({
    server: {
      baseDir: ['.tmp', 'examples'],
      routes: {
        '/bower_components': 'bower_components',
        '/test': 'test',
        '/docs': 'docs'
      }
    },
    open: true,
    logFileChanges: false,
    middleware: [
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {colors: true},
        quiet: true
      })
    ],
    plugins: ['bs-fullscreen-message'],
    files: [
      'app/css/*.css',
      'app/*.html'
    ]
  });
});
