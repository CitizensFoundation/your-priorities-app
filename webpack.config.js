'use strict';

const { resolve, join } = require('path');
const merge = require('webpack-merge');
const { BabelMultiTargetPlugin } = require('webpack-babel-multi-target-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { InjectManifest } = require('workbox-webpack-plugin');
const helperWhitelist = require('./helper-whitelist');

const ENV = process.argv.find(arg => arg.includes('production'))
  ? 'production'
  : 'development';
const ANALYZE = process.argv.find(arg => arg.includes('--analyze'));
const OUTPUT_PATH = ENV === 'production' ? resolve('dist') : resolve('p3_client_app');
const INDEX_TEMPLATE = resolve('./p3_client_app/index.html');

const webcomponentsjs = './node_modules/@webcomponents/webcomponentsjs';

const polyfills = [
  {
    from: resolve(`${webcomponentsjs}/webcomponents-*.{js,map}`),
    to: join(OUTPUT_PATH, 'vendor'),
    flatten: true
  },
  {
    from: resolve(`${webcomponentsjs}/bundles/*.{js,map}`),
    to: join(OUTPUT_PATH, 'vendor', 'bundles'),
    flatten: true
  }
];

const helpers = [
  {
    from: resolve('./src/vendor/babel-helpers.min.js'),
    to: join(OUTPUT_PATH, 'vendor')
  },
  {
    from: resolve('./src/vendor/regenerator-runtime.min.js'),
    to: join(OUTPUT_PATH, 'vendor')
  }
];

const assets = [
  {
    from: resolve('./src/assets'),
    to: join(OUTPUT_PATH, 'assets')
  },
  {
    from: resolve('./src/favicon.ico'),
    to: OUTPUT_PATH
  },
  {
    from: resolve('./src/api/employees.json'),
    to: join(OUTPUT_PATH, 'api')
  },
  {
    from: resolve('./src/manifest.json'),
    to: OUTPUT_PATH
  }
];

const commonConfig = merge([
  {
    resolve: {
      modules: ['./p3_client_app/node_modules','./node_modules']
      // configuration options
    },
    entry: './p3_client_app/src/yp-app/yp-app.js',
    output: {
      path: OUTPUT_PATH,
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            BabelMultiTargetPlugin.loader(),
            'uglify-template-string-loader'
          ]
        }
      ]
    },
    plugins: [
      // Babel configuration for multiple output bundles targeting different sets
      // of browsers
      new BabelMultiTargetPlugin({
        babel: {
          plugins: [
            [
              require('@babel/plugin-external-helpers'),
              {
                whitelist: helperWhitelist
              }
            ],

            // Minify HTML and CSS in tagged template literals
            [
              require('babel-plugin-template-html-minifier'),
              {
                modules: {
                  '@polymer/polymer/lib/utils/html-tag.js': ['html']
                },
                htmlMinifier: {
                  collapseWhitespace: true,
                  minifyCSS: true,
                  removeComments: true
                }
              }
            ]
          ],

          // @babel/preset-env options common for all bundles
          presetOptions: {
            // Don’t add polyfills, they are provided from webcomponents-loader.js
            useBuiltIns: false
          }
        },

        // Modules excluded from targeting into different bundles
        doNotTarget: [
          // Array of RegExp patterns
        ],

        // Modules that should not be transpiled
        exclude: [
          // Array of RegExp patterns
        ],

        // Fix for `nomodule` attribute to work correctly in Safari 10.1
        safari10NoModuleFix: 'inline-data-base64',

        // Target browsers with and without ES modules support
        targets: {
          es6: {
            browsers: [
              'last 2 Chrome major versions',
              'last 2 ChromeAndroid major versions',
              'last 2 Edge major versions',
              'last 2 Firefox major versions',
              'last 3 Safari major versions',
              'last 3 iOS major versions'
            ],
            tagAssetsWithKey: false, // don’t append a suffix to the file name
            esModule: true // marks the bundle used with <script type="module">
          },
          es5: {
            browsers: ['ie 11'],
            tagAssetsWithKey: true, // append a suffix to the file name
            noModule: true // marks the bundle included without `type="module"`
          }
        }
      })
    ]
  }
]);

const developmentConfig = merge([
  {
    devtool: 'cheap-eval-source-map',
    plugins: [
      new CopyWebpackPlugin(polyfills),
      new HtmlWebpackPlugin({
        template: INDEX_TEMPLATE
      })
    ],
    devServer: {
      contentBase: OUTPUT_PATH,
      compress: true,
      overlay: true,
      port: 3072,
      host: '0.0.0.0',
      historyApiFallback: true,
      proxy: {
        '/api': 'http://localhost:4242'
      }
    }
  }
]);

const analyzeConfig = ANALYZE ? [new BundleAnalyzerPlugin()] : [];

const productionConfig = merge([
  {
    devtool: 'nosources-source-map',
    optimization: {
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            output: {
              comments: false
            }
          },
          sourceMap: true,
          parallel: true
        })
      ]
    },
    plugins: [
      new CleanWebpackPlugin({ verbose: true }),
      new CopyWebpackPlugin([...polyfills, ...helpers, ...assets]),
      new HtmlWebpackPlugin({
        template: INDEX_TEMPLATE,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true
        }
      }),
      new InjectManifest({
        swSrc: resolve('src', 'service-worker.js'),
        swDest: resolve(OUTPUT_PATH, 'sw.js'),
        exclude: [
          /.*\.map$/,
          /.*\/webcomponents-(?!loader).*\.js$/,
          /.*\.es5\..*\.js$/
        ]
      }),
      new CompressionPlugin({ test: /\.js(\.map)?$/i }),
      new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.js(\.map)?$/i,
        threshold: 20,
        minRatio: 0.8,
        mode: 1
      }),
      ...analyzeConfig
    ]
  }
]);

// 7

module.exports = mode => {
  if (mode === 'production') {
    return merge(commonConfig, productionConfig, { mode });
  }

  return merge(commonConfig, developmentConfig, { mode });
};
