import { html, css } from 'lit-element';
import { Data } from '../../analytics-app/src/data.js';

import './Grievance.js'
import { BaseElement } from '../../analytics-app/src/baseElement.js';

export class ListOfGrievances extends BaseElement {
  static get styles() {
    return css`
      :host {
        --page-one-text-color: #000;

        padding: 25px;
        color: var(--page-one-text-color);
      }

      .container {
        display: flex;
        flex-direction: column;
        flex-basis: auto;
        width: 100%;
      }
    `;
  }

  static get properties() {
    return {
    };
  }

  constructor() {
    super();
  }

  render() {
    return html`
    <div class="container">
      ${ Data.map((item) => html`
        <one-grievance .grievanceData="${item}"></one-grievance>
      `)}
    </div>
    `;
  }
}
