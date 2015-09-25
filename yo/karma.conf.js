// Karma configuration
// Generated on Sun Oct 27 2013 01:56:27 GMT+0200 (CEST)

module.exports = function (config) {
  config.set({

      // base path, that will be used to resolve files and exclude
      basePath: '.',


      // frameworks to use
      frameworks: ['requirejs', 'jasmine'],


      // list of files / patterns to load in the browser
      files: [
        'app/config.js',
        {pattern: 'app/**/*.js', included: false},
        {pattern: 'test/**/*Spec.js', included: false},
        'test/test-main.js'
      ],


      // list of files to exclude

      exclude: [
        //'app/config.js',
        'app/bower_components/jasmine/**/*.js'
      ],

      preprocessors: {
//        'app/**/*.js': 'coverage'
      },


      // test results reporter to use
      // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
      reporters: ['progress'],


      // web server port
      port: 9876,


      // enable / disable colors in the output (reporters and logs)
      colors: true,


      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_INFO,


      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: true,


      // Start these browsers, currently available:
      // - Chrome
      // - ChromeCanary
      // - Firefox
      // - Opera (has to be installed with `npm install karma-opera-launcher`)
      // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
      // - PhantomJS
      // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
      browsers: ['PhantomJS'],


      // If browser does not capture in given timeout [ms], kill it
      captureTimeout: 60000,


      // Continuous Integration mode
      // if true, it capture browsers, run tests and exit
      singleRun: true
    }
  )
  ;
}
;
