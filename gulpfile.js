const del = require('del');
const gulp = require('gulp');
const gulpHelp = require('gulp-help');
const jasmine = require('gulp-jasmine');
const reporters = require('jasmine-reporters');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

const Service = require('restitup');
const options = require('./options');

const JASMINE_CONFIG = {
  verbose:true,
  timeout: 2000,
  reporter: [
    new reporters.JUnitXmlReporter({
      savePath: './api-results'
    }),
    new SpecReporter()
  ]
};

let specsPaths = [
  `spec/**/*.spec.js`
];

gulpHelp(gulp);

gulp.task('clean', 'Clean all api results', function() {
  return del(['api-results']);
});

gulp.task('restitup', 'Initializes Restitup module', function() {
  gulp.src('')
    .pipe(Service.Gulp(options));
});

gulp.task('api-test', 'Run unit tests using Jasmine', ['clean', 'restitup'], function() {
  return gulp.src(specsPaths)
    .pipe(jasmine(JASMINE_CONFIG));
});
