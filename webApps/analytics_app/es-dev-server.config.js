const proxy = require('koa-proxies');

module.exports = {
  port: 9000,
  middlewares: [
    proxy('/api', {
      target: 'http://localhost:4242/',
    }),
  ],
};
