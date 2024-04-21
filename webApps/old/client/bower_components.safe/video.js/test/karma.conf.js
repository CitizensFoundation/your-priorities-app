const generate = require('videojs-generate-karma-config');

module.exports = function(config) {
  const coverageFlag = process.env.npm_config_coverage;
  const reportCoverage = false; // process.env.TRAVIS || coverageFlag || false;

  // see https://github.com/videojs/videojs-generate-karma-config
  // for options
  const options = {
    travisLaunchers(defaults) {
      delete defaults.travisFirefox;
      return defaults;
    },
    serverBrowsers(defaults) {
      return [];
    },
    coverage: reportCoverage,
  };

  config = generate(config, options);

  config.proxies = config.proxies || {};

  // disable warning logs for sourceset tests, by proxing to a remote host
  Object.assign(config.proxies, {
    '/test/relative-one.mp4': 'http://example.com/relative-one.mp4',
    '/test/relative-two.mp4': 'http://example.com/relative-two.mp4',
    '/test/relative-three.mp4': 'http://example.com/relative-three.mp4'
  });

  config.files = [
    'dist/video-js.css',
    'test/globals-shim.js',
    'test/unit/**/*.js',
    'test/dist/browserify.js',
    'test/dist/webpack.js',
    {pattern: 'src/**/*.js', watched: true, included: false, served: false }
  ];

  config.browserStack.project = 'Video.js';

  config.frameworks.push('browserify');
  config.browserify = {
    debug: true,
    plugin: ['proxyquireify/plugin'],
    transform: [
      ['babelify', {"presets": [["@babel/preset-env", {"loose": true}]]}],
    ]
  };

  if (reportCoverage) {
    config.browserify.transform.push('browserify-istanbul');
  }


  config.preprocessors = {
    'test/globals-shim.js': ['browserify'],
    'test/unit/**/*.js': ['browserify'],
  };

};
