var crypto = require('crypto');

var uid = function(len) {
  return crypto.randomBytes(Math.ceil(len * 3 / 4))
    .toString('base64')
    .slice(0, len);
};

/**
 * Creates an instance of `MultiSessionStore`.
 *
 * This state store supports multiple concurrent authorization requests by
 * storing state objects in `req.session[options.key].states`, keyed by handle.
 *
 * Options:
 *   - `key`  The key in the session under which to store state
 *
 * @constructor
 * @param {Object} options
 * @api public
 */
function MultiSessionStore(options) {
  if (!options.key) { throw new TypeError('Session-based state store requires a session key'); }
  this._key = options.key;
}

/**
 * Store request state.
 *
 * The provided `appState`, if specified, is used as the handle.  Otherwise,
 * a handle is generated using a uid.
 *
 * @param {Object} req
 * @param {Object} ctx
 * @param {String} appState
 * @param {Object} meta
 * @param {Function} cb
 * @api protected
 */
MultiSessionStore.prototype.store = function(req, ctx, appState, meta, cb) {
  if (!req.session) { return cb(new Error('OpenID Connect requires session support. Did you forget to use `express-session` middleware?')); }

  var key = this._key;
  var handle = appState || uid(24);

  var state = { handle: handle };
  if (ctx.maxAge) { state.maxAge = ctx.maxAge; }
  if (ctx.nonce) { state.nonce = ctx.nonce; }
  if (ctx.issued) { state.issued = ctx.issued; }
  if (appState) { state.state = appState; }

  if (!req.session[key]) { req.session[key] = {}; }
  if (!req.session[key].states) { req.session[key].states = {}; }
  req.session[key].states[handle] = state;

  cb(null, handle);
};


/**
 * Verify request state.
 *
 * @param {Object} req
 * @param {String} handle
 * @param {Function} cb
 * @api protected
 */
MultiSessionStore.prototype.verify = function(req, handle, cb) {
  if (!req.session) { return cb(new Error('OpenID Connect requires session support. Did you forget to use `express-session` middleware?')); }

  var key = this._key;
  if (!req.session[key] || !req.session[key].states) {
    return cb(null, false, { message: 'Unable to verify authorization request state.' });
  }

  var state = req.session[key].states[handle];
  if (!state) {
    return cb(null, false, { message: 'Invalid authorization request state.' });
  }

  delete req.session[key].states[handle];
  if (Object.keys(req.session[key].states).length === 0) {
    delete req.session[key].states;
  }
  if (Object.keys(req.session[key]).length === 0) {
    delete req.session[key];
  }

  var ctx = {
    maxAge: state.maxAge,
    nonce: state.nonce,
    issued: state.issued
  };
  if (typeof ctx.issued === 'string') {
    ctx.issued = new Date(ctx.issued);
  }

  return cb(null, ctx, state.state);
};

module.exports = MultiSessionStore;