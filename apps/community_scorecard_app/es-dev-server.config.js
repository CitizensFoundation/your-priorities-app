const commonjs = require('@rollup/plugin-commonjs');

const proxy = require('koa-proxies');
const { wrapRollupPlugin } = require('es-dev-server-rollup');

module.exports = {
  port: 9000,
  middlewares: [
    proxy('/api', {
      target: 'http://localhost:4242/',
    }),
  ],
  plugins: [
    wrapRollupPlugin(
      commonjs()
    )
  ]
};
