module.exports = function(config) {
    config.set({

      // base path that will be used to resolve all patterns (eg. files, exclude)
      basePath: '',
  
      // frameworks to use
      // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
      frameworks: ['qunit', 'jquery-3.4.0'],
  
      // list of files / patterns to load in the browser
      files: [
        'node_modules/jquery/dist/jquery.min.js',
        'jquery.inputNumber.js',
        'test/**/*.js'
      ],
  
      // list of files / patterns to exclude
      exclude: [
      ],
  
      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
        'jquery.inputNumber.js': ['coverage']
      },
  
      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ['progress', 'coverage'],
  
      // web server port
      port: 9876,
  
      // enable / disable colors in the output (reporters and logs)
      colors: true,
  
      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_INFO,
  
      // enable / disable watching file and running tests whenever any file changes
      autoWatch: false,
  
      // start these browsers
      // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
      browsers: ['ChromeHeadless'],
  
      // Continuous Integration mode
      // if true, Karma captures browsers, runs the tests and exits
      singleRun: true,
  
      // Concurrency level
      // how many browser should be started simultaneous
      concurrency: Infinity,

      client: {
        clearContext: false,
        captureConsole: true
      },
  
      // Coverage configuration
      coverageReporter: {
        type: 'lcov',
        dir: 'coverage/',
        subdir: '.'
      },

      plugins: [
        'karma-chrome-launcher',
        'karma-jquery',
        'karma-qunit',
        'karma-coverage'
     ],
    })
  }