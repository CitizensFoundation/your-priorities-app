/**
 * @file video.js
 * @module videojs
 */
import {version} from '../../package.json';
import window from 'global/window';
import document from 'global/document';
import * as setup from './setup';
import * as stylesheet from './utils/stylesheet.js';
import Component from './component';
import EventTarget from './event-target';
import * as Events from './utils/events.js';
import Player from './player';
import Plugin from './plugin';
import mergeOptions from './utils/merge-options.js';
import * as Fn from './utils/fn.js';
import TextTrack from './tracks/text-track.js';
import AudioTrack from './tracks/audio-track.js';
import VideoTrack from './tracks/video-track.js';

import { createTimeRanges } from './utils/time-ranges.js';
import formatTime, { setFormatTime, resetFormatTime } from './utils/format-time.js';
import log, { createLogger } from './utils/log.js';
import * as Dom from './utils/dom.js';
import * as browser from './utils/browser.js';
import * as Url from './utils/url.js';
import {isObject} from './utils/obj';
import computedStyle from './utils/computed-style.js';
import extend from './extend.js';
import xhr from 'xhr';

// Include the built-in techs
import Tech from './tech/tech.js';
import { use as middlewareUse, TERMINATOR } from './tech/middleware.js';

/**
 * Normalize an `id` value by trimming off a leading `#`
 *
 * @private
 * @param   {string} id
 *          A string, maybe with a leading `#`.
 *
 * @return {string}
 *          The string, without any leading `#`.
 */
const normalizeId = (id) => id.indexOf('#') === 0 ? id.slice(1) : id;

/**
 * The `videojs()` function doubles as the main function for users to create a
 * {@link Player} instance as well as the main library namespace.
 *
 * It can also be used as a getter for a pre-existing {@link Player} instance.
 * However, we _strongly_ recommend using `videojs.getPlayer()` for this
 * purpose because it avoids any potential for unintended initialization.
 *
 * Due to [limitations](https://github.com/jsdoc3/jsdoc/issues/955#issuecomment-313829149)
 * of our JSDoc template, we cannot properly document this as both a function
 * and a namespace, so its function signature is documented here.
 *
 * #### Arguments
 * ##### id
 * string|Element, **required**
 *
 * Video element or video element ID.
 *
 * ##### options
 * Object, optional
 *
 * Options object for providing settings.
 * See: [Options Guide](https://docs.videojs.com/tutorial-options.html).
 *
 * ##### ready
 * {@link Component~ReadyCallback}, optional
 *
 * A function to be called when the {@link Player} and {@link Tech} are ready.
 *
 * #### Return Value
 *
 * The `videojs()` function returns a {@link Player} instance.
 *
 * @namespace
 *
 * @borrows AudioTrack as AudioTrack
 * @borrows Component.getComponent as getComponent
 * @borrows module:computed-style~computedStyle as computedStyle
 * @borrows module:events.on as on
 * @borrows module:events.one as one
 * @borrows module:events.off as off
 * @borrows module:events.trigger as trigger
 * @borrows EventTarget as EventTarget
 * @borrows module:extend~extend as extend
 * @borrows module:fn.bind as bind
 * @borrows module:format-time.formatTime as formatTime
 * @borrows module:format-time.resetFormatTime as resetFormatTime
 * @borrows module:format-time.setFormatTime as setFormatTime
 * @borrows module:merge-options.mergeOptions as mergeOptions
 * @borrows module:middleware.use as use
 * @borrows Player.players as players
 * @borrows Plugin.registerPlugin as registerPlugin
 * @borrows Plugin.deregisterPlugin as deregisterPlugin
 * @borrows Plugin.getPlugins as getPlugins
 * @borrows Plugin.getPlugin as getPlugin
 * @borrows Plugin.getPluginVersion as getPluginVersion
 * @borrows Tech.getTech as getTech
 * @borrows Tech.registerTech as registerTech
 * @borrows TextTrack as TextTrack
 * @borrows module:time-ranges.createTimeRanges as createTimeRange
 * @borrows module:time-ranges.createTimeRanges as createTimeRanges
 * @borrows module:url.isCrossOrigin as isCrossOrigin
 * @borrows module:url.parseUrl as parseUrl
 * @borrows VideoTrack as VideoTrack
 *
 * @param  {string|Element} id
 *         Video element or video element ID.
 *
 * @param  {Object} [options]
 *         Options object for providing settings.
 *         See: [Options Guide](https://docs.videojs.com/tutorial-options.html).
 *
 * @param  {Component~ReadyCallback} [ready]
 *         A function to be called when the {@link Player} and {@link Tech} are
 *         ready.
 *
 * @return {Player}
 *         The `videojs()` function returns a {@link Player|Player} instance.
 */
function videojs(id, options, ready) {
  let player = videojs.getPlayer(id);

  if (player) {
    if (options) {
      log.warn(`Player "${id}" is already initialised. Options will not be applied.`);
    }
    if (ready) {
      player.ready(ready);
    }
    return player;
  }

  const el = (typeof id === 'string') ? Dom.$('#' + normalizeId(id)) : id;

  if (!Dom.isEl(el)) {
    throw new TypeError('The element or ID supplied is not valid. (videojs)');
  }

  if (!document.body.contains(el)) {
    log.warn('The element supplied is not included in the DOM');
  }

  options = options || {};

  videojs.hooks('beforesetup').forEach((hookFunction) => {
    const opts = hookFunction(el, mergeOptions(options));

    if (!isObject(opts) || Array.isArray(opts)) {
      log.error('please return an object in beforesetup hooks');
      return;
    }

    options = mergeOptions(options, opts);
  });

  // We get the current "Player" component here in case an integration has
  // replaced it with a custom player.
  const PlayerComponent = Component.getComponent('Player');

  player = new PlayerComponent(el, options, ready);

  videojs.hooks('setup').forEach((hookFunction) => hookFunction(player));

  return player;
}

/**
 * An Object that contains lifecycle hooks as keys which point to an array
 * of functions that are run when a lifecycle is triggered
 *
 * @private
 */
videojs.hooks_ = {};

/**
 * Get a list of hooks for a specific lifecycle
 *
 * @param  {string} type
 *         the lifecyle to get hooks from
 *
 * @param  {Function|Function[]} [fn]
 *         Optionally add a hook (or hooks) to the lifecycle that your are getting.
 *
 * @return {Array}
 *         an array of hooks, or an empty array if there are none.
 */
videojs.hooks = function(type, fn) {
  videojs.hooks_[type] = videojs.hooks_[type] || [];
  if (fn) {
    videojs.hooks_[type] = videojs.hooks_[type].concat(fn);
  }
  return videojs.hooks_[type];
};

/**
 * Add a function hook to a specific videojs lifecycle.
 *
 * @param {string} type
 *        the lifecycle to hook the function to.
 *
 * @param {Function|Function[]}
 *        The function or array of functions to attach.
 */
videojs.hook = function(type, fn) {
  videojs.hooks(type, fn);
};

/**
 * Add a function hook that will only run once to a specific videojs lifecycle.
 *
 * @param {string} type
 *        the lifecycle to hook the function to.
 *
 * @param {Function|Function[]}
 *        The function or array of functions to attach.
 */
videojs.hookOnce = function(type, fn) {
  videojs.hooks(type, [].concat(fn).map(original => {
    const wrapper = (...args) => {
      videojs.removeHook(type, wrapper);
      return original(...args);
    };

    return wrapper;
  }));
};

/**
 * Remove a hook from a specific videojs lifecycle.
 *
 * @param  {string} type
 *         the lifecycle that the function hooked to
 *
 * @param  {Function} fn
 *         The hooked function to remove
 *
 * @return {boolean}
 *         The function that was removed or undef
 */
videojs.removeHook = function(type, fn) {
  const index = videojs.hooks(type).indexOf(fn);

  if (index <= -1) {
    return false;
  }

  videojs.hooks_[type] = videojs.hooks_[type].slice();
  videojs.hooks_[type].splice(index, 1);

  return true;
};

// Add default styles
if (window.VIDEOJS_NO_DYNAMIC_STYLE !== true && Dom.isReal()) {
  let style = Dom.$('.vjs-styles-defaults');

  if (!style) {
    style = stylesheet.createStyleElement('vjs-styles-defaults');
    const head = Dom.$('head');

    if (head) {
      head.insertBefore(style, head.firstChild);
    }
    stylesheet.setTextContent(style, `
      .video-js {
        width: 300px;
        height: 150px;
      }

      .vjs-fluid {
        padding-top: 56.25%
      }
    `);
  }
}

// Run Auto-load players
// You have to wait at least once in case this script is loaded after your
// video in the DOM (weird behavior only with minified version)
setup.autoSetupTimeout(1, videojs);

/**
 * Current Video.js version. Follows [semantic versioning](https://semver.org/).
 *
 * @type {string}
 */
videojs.VERSION = version;

/**
 * The global options object. These are the settings that take effect
 * if no overrides are specified when the player is created.
 *
 * @type {Object}
 */
videojs.options = Player.prototype.options_;

/**
 * Get an object with the currently created players, keyed by player ID
 *
 * @return {Object}
 *         The created players
 */
videojs.getPlayers = () => Player.players;

/**
 * Get a single player based on an ID or DOM element.
 *
 * This is useful if you want to check if an element or ID has an associated
 * Video.js player, but not create one if it doesn't.
 *
 * @param   {string|Element} id
 *          An HTML element - `<video>`, `<audio>`, or `<video-js>` -
 *          or a string matching the `id` of such an element.
 *
 * @return {Player|undefined}
 *          A player instance or `undefined` if there is no player instance
 *          matching the argument.
 */
videojs.getPlayer = (id) => {
  const players = Player.players;
  let tag;

  if (typeof id === 'string') {
    const nId = normalizeId(id);
    const player = players[nId];

    if (player) {
      return player;
    }

    tag = Dom.$('#' + nId);
  } else {
    tag = id;
  }

  if (Dom.isEl(tag)) {
    const {player, playerId} = tag;

    // Element may have a `player` property referring to an already created
    // player instance. If so, return that.
    if (player || players[playerId]) {
      return player || players[playerId];
    }
  }
};

/**
 * Returns an array of all current players.
 *
 * @return {Array}
 *         An array of all players. The array will be in the order that
 *         `Object.keys` provides, which could potentially vary between
 *         JavaScript engines.
 *
 */
videojs.getAllPlayers = () =>

  // Disposed players leave a key with a `null` value, so we need to make sure
  // we filter those out.
  Object.keys(Player.players).map(k => Player.players[k]).filter(Boolean);

videojs.players = Player.players;
videojs.getComponent = Component.getComponent;

/**
 * Register a component so it can referred to by name. Used when adding to other
 * components, either through addChild `component.addChild('myComponent')` or through
 * default children options  `{ children: ['myComponent'] }`.
 *
 * > NOTE: You could also just initialize the component before adding.
 * `component.addChild(new MyComponent());`
 *
 * @param {string} name
 *        The class name of the component
 *
 * @param {Component} comp
 *        The component class
 *
 * @return {Component}
 *         The newly registered component
 */
videojs.registerComponent = (name, comp) => {
  if (Tech.isTech(comp)) {
    log.warn(`The ${name} tech was registered as a component. It should instead be registered using videojs.registerTech(name, tech)`);
  }

  Component.registerComponent.call(Component, name, comp);
};

videojs.getTech = Tech.getTech;
videojs.registerTech = Tech.registerTech;
videojs.use = middlewareUse;

/**
 * An object that can be returned by a middleware to signify
 * that the middleware is being terminated.
 *
 * @type {object}
 * @property {object} middleware.TERMINATOR
 */
Object.defineProperty(videojs, 'middleware', {
  value: {},
  writeable: false,
  enumerable: true
});

Object.defineProperty(videojs.middleware, 'TERMINATOR', {
  value: TERMINATOR,
  writeable: false,
  enumerable: true
});

/**
 * A reference to the {@link module:browser|browser utility module} as an object.
 *
 * @type {Object}
 * @see  {@link module:browser|browser}
 */
videojs.browser = browser;

/**
 * Use {@link module:browser.TOUCH_ENABLED|browser.TOUCH_ENABLED} instead; only
 * included for backward-compatibility with 4.x.
 *
 * @deprecated Since version 5.0, use {@link module:browser.TOUCH_ENABLED|browser.TOUCH_ENABLED instead.
 * @type {boolean}
 */
videojs.TOUCH_ENABLED = browser.TOUCH_ENABLED;

videojs.extend = extend;
videojs.mergeOptions = mergeOptions;
videojs.bind = Fn.bind;
videojs.registerPlugin = Plugin.registerPlugin;
videojs.deregisterPlugin = Plugin.deregisterPlugin;

/**
 * Deprecated method to register a plugin with Video.js
 *
 * @deprecated videojs.plugin() is deprecated; use videojs.registerPlugin() instead
 *
 * @param {string} name
 *        The plugin name
 *
 * @param {Plugin|Function} plugin
 *         The plugin sub-class or function
 */
videojs.plugin = (name, plugin) => {
  log.warn('videojs.plugin() is deprecated; use videojs.registerPlugin() instead');
  return Plugin.registerPlugin(name, plugin);
};

videojs.getPlugins = Plugin.getPlugins;
videojs.getPlugin = Plugin.getPlugin;
videojs.getPluginVersion = Plugin.getPluginVersion;

/**
 * Adding languages so that they're available to all players.
 * Example: `videojs.addLanguage('es', { 'Hello': 'Hola' });`
 *
 * @param {string} code
 *        The language code or dictionary property
 *
 * @param {Object} data
 *        The data values to be translated
 *
 * @return {Object}
 *         The resulting language dictionary object
 */
videojs.addLanguage = function(code, data) {
  code = ('' + code).toLowerCase();

  videojs.options.languages = mergeOptions(
    videojs.options.languages,
    {[code]: data}
  );

  return videojs.options.languages[code];
};

/**
 * A reference to the {@link module:log|log utility module} as an object.
 *
 * @type {Function}
 * @see  {@link module:log|log}
 */
videojs.log = log;
videojs.createLogger = createLogger;

videojs.createTimeRange = videojs.createTimeRanges = createTimeRanges;
videojs.formatTime = formatTime;
videojs.setFormatTime = setFormatTime;
videojs.resetFormatTime = resetFormatTime;
videojs.parseUrl = Url.parseUrl;
videojs.isCrossOrigin = Url.isCrossOrigin;
videojs.EventTarget = EventTarget;
videojs.on = Events.on;
videojs.one = Events.one;
videojs.off = Events.off;
videojs.trigger = Events.trigger;

/**
 * A cross-browser XMLHttpRequest wrapper.
 *
 * @function
 * @param    {Object} options
 *           Settings for the request.
 *
 * @return   {XMLHttpRequest|XDomainRequest}
 *           The request object.
 *
 * @see      https://github.com/Raynos/xhr
 */
videojs.xhr = xhr;

videojs.TextTrack = TextTrack;
videojs.AudioTrack = AudioTrack;
videojs.VideoTrack = VideoTrack;

[
  'isEl',
  'isTextNode',
  'createEl',
  'hasClass',
  'addClass',
  'removeClass',
  'toggleClass',
  'setAttributes',
  'getAttributes',
  'emptyEl',
  'appendContent',
  'insertContent'
].forEach(k => {
  videojs[k] = function() {
    log.warn(`videojs.${k}() is deprecated; use videojs.dom.${k}() instead`);
    return Dom[k].apply(null, arguments);
  };
});

videojs.computedStyle = computedStyle;

/**
 * A reference to the {@link module:dom|DOM utility module} as an object.
 *
 * @type {Object}
 * @see  {@link module:dom|dom}
 */
videojs.dom = Dom;

/**
 * A reference to the {@link module:url|URL utility module} as an object.
 *
 * @type {Object}
 * @see  {@link module:url|url}
 */
videojs.url = Url;

export default videojs;

