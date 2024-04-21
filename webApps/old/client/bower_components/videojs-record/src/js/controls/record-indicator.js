/**
 * @file record-indicator.js
 * @since 2.0.0
 */

const Component = videojs.getComponent('Component');

/**
 * Icon indicating recording is active.
 *
 * @class
 * @augments videojs.Component
*/
class RecordIndicator extends Component {
    /**
     * The constructor function for the class.
     *
     * @private
     * @param {(videojs.Player|Object)} player - Video.js player instance.
     * @param {Object} options - Player options.
     */
    constructor(player, options) {
        super(player, options);

        this.enable();
    }

    /**
     * Create the `RecordIndicator`s DOM element.
     *
     * @return {Element}
     *         The dom element that gets created.
     */
    createEl() {
        return super.createEl('div', {
            className: 'vjs-record-indicator vjs-control',
            dir: 'ltr'
        });
    }

    /**
     * Enable event handlers.
     */
    enable() {
        this.on(this.player_, 'startRecord', this.show);
        this.on(this.player_, 'stopRecord', this.hide);
    }

    /**
     * Disable event handlers.
     */
    disable() {
        this.off(this.player_, 'startRecord', this.show);
        this.off(this.player_, 'stopRecord', this.hide);
    }
}

Component.registerComponent('RecordIndicator', RecordIndicator);

export default RecordIndicator;
