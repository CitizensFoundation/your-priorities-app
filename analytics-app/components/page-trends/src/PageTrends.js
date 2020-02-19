import { html, css, LitElement } from 'lit-element';
import { Data, DataLabels } from '../../analytics-app/src/data.js';
import { ShadowStyles } from '../../analytics-app/src/shadow-styles.js';

export class PageTrends extends LitElement {
  static get styles() {
    return [ShadowStyles, css`
      :host {
        display: block;
        padding: 25px;
        text-align: center;
      }

      svg {
        animation: app-logo-spin infinite 20s linear;
      }

      @keyframes app-logo-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .container {
        margin-top: 5px;
        background-color: #FFF;
        padding: 32px;
      }
    `];
  }

  static get properties() {
    return {
      title: { type: String },
      logo: { type: Function },
    };
  }

  constructor() {
    super();
    this.title = 'Hello open-wc world!';
    this.logo = html``;
  }

  firstUpdated() {
    super.firstUpdated();
    const lineChartElement = this.shadowRoot.getElementById("line-chart");
    new Chart(lineChartElement, {
      type: 'bar',
      data: {
        labels: DataLabels,
        datasets: Data.map((item) => item.dataSet)
      },
      options: {
        title: {
          display: true,
          text: 'Trends (in millions)'
        }
      }
    })
  }

  render() {
    return html`
    <div class="container shadow-animation shadow-elevation-3dp">
      <canvas id="line-chart" width="800" height="450"></canvas>
    </div>
    `;
  }
}
