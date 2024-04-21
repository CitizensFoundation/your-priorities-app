/**
 * @file time-divider.js
 */
import Component from '../../component.js';

/**
 * The separator between the current time and duration.
 * Can be hidden if it's not needed in the design.
 *
 * @extends Component
 */
class TimeDivider extends Component {

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    return super.createEl('div', {
      className: 'vjs-time-control vjs-time-divider',
      innerHTML: '<div><span>/</span></div>'
    }, {
      // this element and its contents can be hidden from assistive techs since
      // it is made extraneous by the announcement of the control text
      // for the current time and duration displays
      'aria-hidden': true
    });
  }

}

Component.registerComponent('TimeDivider', TimeDivider);
export default TimeDivider;
