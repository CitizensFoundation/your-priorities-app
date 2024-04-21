/**
 * @file progress-control.js
 */
import Component from '../../component.js';
import * as Dom from '../../utils/dom.js';
import {throttle, bind} from '../../utils/fn.js';

import './seek-bar.js';

/**
 * The Progress Control component contains the seek bar, load progress,
 * and play progress.
 *
 * @extends Component
 */
class ProgressControl extends Component {

  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   */
  constructor(player, options) {
    super(player, options);
    this.handleMouseMove = throttle(bind(this, this.handleMouseMove), 25);
    this.throttledHandleMouseSeek = throttle(bind(this, this.handleMouseSeek), 25);

    this.enable();
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    return super.createEl('div', {
      className: 'vjs-progress-control vjs-control'
    });
  }

  /**
   * When the mouse moves over the `ProgressControl`, the pointer position
   * gets passed down to the `MouseTimeDisplay` component.
   *
   * @param {EventTarget~Event} event
   *        The `mousemove` event that caused this function to run.
   *
   * @listen mousemove
   */
  handleMouseMove(event) {
    const seekBar = this.getChild('seekBar');

    if (seekBar) {
      const mouseTimeDisplay = seekBar.getChild('mouseTimeDisplay');
      const seekBarEl = seekBar.el();
      const seekBarRect = Dom.getBoundingClientRect(seekBarEl);
      let seekBarPoint = Dom.getPointerPosition(seekBarEl, event).x;

      // The default skin has a gap on either side of the `SeekBar`. This means
      // that it's possible to trigger this behavior outside the boundaries of
      // the `SeekBar`. This ensures we stay within it at all times.
      if (seekBarPoint > 1) {
        seekBarPoint = 1;
      } else if (seekBarPoint < 0) {
        seekBarPoint = 0;
      }

      if (mouseTimeDisplay) {
        mouseTimeDisplay.update(seekBarRect, seekBarPoint);
      }
    }
  }

  /**
   * A throttled version of the {@link ProgressControl#handleMouseSeek} listener.
   *
   * @method ProgressControl#throttledHandleMouseSeek
   * @param {EventTarget~Event} event
   *        The `mousemove` event that caused this function to run.
   *
   * @listen mousemove
   * @listen touchmove
   */

  /**
   * Handle `mousemove` or `touchmove` events on the `ProgressControl`.
   *
   * @param {EventTarget~Event} event
   *        `mousedown` or `touchstart` event that triggered this function
   *
   * @listens mousemove
   * @listens touchmove
   */
  handleMouseSeek(event) {
    const seekBar = this.getChild('seekBar');

    if (seekBar) {
      seekBar.handleMouseMove(event);
    }
  }

  /**
   * Are controls are currently enabled for this progress control.
   *
   * @return {boolean}
   *         true if controls are enabled, false otherwise
   */
  enabled() {
    return this.enabled_;
  }

  /**
   * Disable all controls on the progress control and its children
   */
  disable() {
    this.children().forEach((child) => child.disable && child.disable());

    if (!this.enabled()) {
      return;
    }

    this.off(['mousedown', 'touchstart'], this.handleMouseDown);
    this.off(this.el_, 'mousemove', this.handleMouseMove);
    this.handleMouseUp();

    this.addClass('disabled');

    this.enabled_ = false;
  }

  /**
   * Enable all controls on the progress control and its children
   */
  enable() {
    this.children().forEach((child) => child.enable && child.enable());

    if (this.enabled()) {
      return;
    }

    this.on(['mousedown', 'touchstart'], this.handleMouseDown);
    this.on(this.el_, 'mousemove', this.handleMouseMove);
    this.removeClass('disabled');

    this.enabled_ = true;
  }

  /**
   * Handle `mousedown` or `touchstart` events on the `ProgressControl`.
   *
   * @param {EventTarget~Event} event
   *        `mousedown` or `touchstart` event that triggered this function
   *
   * @listens mousedown
   * @listens touchstart
   */
  handleMouseDown(event) {
    const doc = this.el_.ownerDocument;
    const seekBar = this.getChild('seekBar');

    if (seekBar) {
      seekBar.handleMouseDown(event);
    }

    this.on(doc, 'mousemove', this.throttledHandleMouseSeek);
    this.on(doc, 'touchmove', this.throttledHandleMouseSeek);
    this.on(doc, 'mouseup', this.handleMouseUp);
    this.on(doc, 'touchend', this.handleMouseUp);
  }

  /**
   * Handle `mouseup` or `touchend` events on the `ProgressControl`.
   *
   * @param {EventTarget~Event} event
   *        `mouseup` or `touchend` event that triggered this function.
   *
   * @listens touchend
   * @listens mouseup
   */
  handleMouseUp(event) {
    const doc = this.el_.ownerDocument;
    const seekBar = this.getChild('seekBar');

    if (seekBar) {
      seekBar.handleMouseUp(event);
    }

    this.off(doc, 'mousemove', this.throttledHandleMouseSeek);
    this.off(doc, 'touchmove', this.throttledHandleMouseSeek);
    this.off(doc, 'mouseup', this.handleMouseUp);
    this.off(doc, 'touchend', this.handleMouseUp);
  }
}

/**
 * Default options for `ProgressControl`
 *
 * @type {Object}
 * @private
 */
ProgressControl.prototype.options_ = {
  children: [
    'seekBar'
  ]
};

Component.registerComponent('ProgressControl', ProgressControl);
export default ProgressControl;
