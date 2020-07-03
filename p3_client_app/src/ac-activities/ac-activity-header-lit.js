import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

import '../yp-user/yp-user-with-organization.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class AcActivityHeaderLit extends YpBaseElement {
  static get properties() {
    return {
      activity: {
        type: Object,
        observer: '_activityChanged'
      }
    }
  }

  static get styles() {
    return [
      css`

      yp-user-with-organization {
        padding-top: 0;
        padding-bottom: 0;
        margin: 0;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <yp-user-with-organization .user="${this.activity.User}" inverted></yp-user-with-organization>
`
  }

  _activityChanged(newValue) {
  }
}

window.customElements.define('ac-activity-header-lit', AcActivityHeaderLit)
