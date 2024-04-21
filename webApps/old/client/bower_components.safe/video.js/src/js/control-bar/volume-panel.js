/**
 * @file volume-control.js
 */
import Component from '../component.js';
import {isPlain} from '../utils/obj';

// Required children
import './volume-control/volume-control.js';
import './mute-toggle.js';

/**
 * A Component to contain the MuteToggle and VolumeControl so that
 * they can work together.
 *
 * @extends Component
 */
class VolumePanel extends Component {

  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options={}]
   *        The key/value store of player options.
   */
  constructor(player, options = {}) {
    if (typeof options.inline !== 'undefined') {
      options.inline = options.inline;
    } else {
      options.inline = true;
    }

    // pass the inline option down to the VolumeControl as vertical if
    // the VolumeControl is on.
    if (typeof options.volumeControl === 'undefined' || isPlain(options.volumeControl)) {
      options.volumeControl = options.volumeControl || {};
      options.volumeControl.vertical = !options.inline;
    }

    super(player, options);

    this.on(player, ['loadstart'], this.volumePanelState_);

    // while the slider is active (the mouse has been pressed down and
    // is dragging) we do not want to hide the VolumeBar
    this.on(this.volumeControl, ['slideractive'], this.sliderActive_);

    this.on(this.volumeControl, ['sliderinactive'], this.sliderInactive_);
  }

  /**
   * Add vjs-slider-active class to the VolumePanel
   *
   * @listens VolumeControl#slideractive
   * @private
   */
  sliderActive_() {
    this.addClass('vjs-slider-active');
  }

  /**
   * Removes vjs-slider-active class to the VolumePanel
   *
   * @listens VolumeControl#sliderinactive
   * @private
   */
  sliderInactive_() {
    this.removeClass('vjs-slider-active');
  }

  /**
   * Adds vjs-hidden or vjs-mute-toggle-only to the VolumePanel
   * depending on MuteToggle and VolumeControl state
   *
   * @listens Player#loadstart
   * @private
   */
  volumePanelState_() {
    // hide volume panel if neither volume control or mute toggle
    // are displayed
    if (this.volumeControl.hasClass('vjs-hidden') && this.muteToggle.hasClass('vjs-hidden')) {
      this.addClass('vjs-hidden');
    }

    // if only mute toggle is visible we don't want
    // volume panel expanding when hovered or active
    if (this.volumeControl.hasClass('vjs-hidden') && !this.muteToggle.hasClass('vjs-hidden')) {
      this.addClass('vjs-mute-toggle-only');
    }
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    let orientationClass = 'vjs-volume-panel-horizontal';

    if (!this.options_.inline) {
      orientationClass = 'vjs-volume-panel-vertical';
    }

    return super.createEl('div', {
      className: `vjs-volume-panel vjs-control ${orientationClass}`
    });
  }

}

/**
 * Default options for the `VolumeControl`
 *
 * @type {Object}
 * @private
 */
VolumePanel.prototype.options_ = {
  children: [
    'muteToggle',
    'volumeControl'
  ]
};

Component.registerComponent('VolumePanel', VolumePanel);
export default VolumePanel;
