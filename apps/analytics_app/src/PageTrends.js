import 'chart.js';
import { html, css } from 'lit-element';
import './YpWordCloud.js';
import { YpBaseElement } from './YpBaseElement';
import { ShadowStyles } from './ShadowStyles';
import '@material/mwc-select';
import '@material/mwc-button';
import '@material/mwc-list/mwc-list-item';

export class PageTrends extends YpBaseElement {
  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
      :host {
        max-width: 960px;
        width: 960px;
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
        background-color: #FFF;
        padding: 16px;
      }

      #mainSelect {
        text-align: right;
        margin-right: 22px;
        margin-top: 8px;
      }

      .wordCloudContainer {
        margin-top: 24px;
        margin-bottom: 64px;
      }

      mwc-linear-progress {
        margin-bottom: 8px;
      }

      .timeButtons {
        margin-top: 8px;
      }
    `];
  }

  static get properties() {
    return {
      collectionType: { type: String },
      collectionId: { type: String },
      statsPosts: { type: Object },
      statsPoints: { type: Object },
      statsVotes: { type: Object},
      wordCloudURL: { type: String },
      collection: { type: Object },
      statsTimePeriod: { type: String },
      statsType: { type: String },
      waitingOnData: { type: Boolean }
    };
  }

  updateStatsChart () {
    if (this.statsResponse) {
      const lineChartElement = this.shadowRoot.getElementById("line-chart");
      const chartLabel = this.t('by'+this.statsTimePeriod);
      let data;
      if (this.statsTimePeriod==='day')
        data = this.statsResponse.finalDays;
      else if (this.statsTimePeriod==='month')
        data = this.statsResponse.finalMonths;
      else if (this.statsTimePeriod==='year')
        data = this.statsResponse.finalYears;

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(lineChartElement, {
        type: 'bar',
        data:  { datasets: [
          {
            label: `${this.t(this.statsType)} ${chartLabel}`,
            backgroundColor: "#1c96bd",
            fill: false,
            data
          }
        ] },
        options: {
          scales: {
              xAxes: [{
                  type: 'time',
                  time: {
                    unit: this.statsTimePeriod
                }
              }],
              yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
          }
      }
      });
    } else {
      console.error("Trying to update chart with a response");
    }
  }

  getStatsData(url) {
    fetch(url, { credentials: 'same-origin' })
    .then(res => this.handleNetworkErrors(res))
    .then(res => res.json())
    .then(response => {
      this.statsResponse = response;
      this.waitingOnData = false;
      this.updateStatsChart();
      let totalPosts = 0;
      if (this.statsResponse.finalYears) {
        this.statsResponse.finalYears.forEach(postCount=>{
          totalPosts+=postCount.y;
        });
      }
      this.fire('set-total-posts', totalPosts);
    })
    .catch(error => {
      this.fire('app-error', error);
    });
  }

  constructor() {
    super();
    this.waitingOnData = true;
  }

  getStats() {
    this.collectionStatsUrl = `/api/${this.collectionType}/${this.collectionId}/${this.statsType}`;
    this.getStatsData(this.collectionStatsUrl);
  }

  connectedCallback() {
    super.connectedCallback();
    this.wordCloudURL ="/api/"+this.collectionType+"/"+this.collectionId+"/wordcloud";

    this.statsType = "stats_posts";
    this.statsTimePeriod = "day";
    this.getStats();
  }

  firstUpdated() {
    super.firstUpdated();
  }

  selectStatsType (event) {
    if (event.target && event.target.value) {
      this.statsType = event.target.value;
      this.getStats();
    }
  }

  setDay() {
    this.statsTimePeriod = "day";
    this.updateStatsChart();
  }

  setMonth() {
    this.statsTimePeriod = "month";
    this.updateStatsChart();
  }

  setYear() {
    this.statsTimePeriod = "year";
    this.updateStatsChart();
  }

  render() {
    return html`
      <div class="container shadow-animation shadow-elevation-3dp">
        <mwc-linear-progress indeterminate ?hidden="${!this.waitingOnData}"></mwc-linear-progress>
        <div class="layout vertical">
          <div class="layout vertical endAligned">
          <mwc-select outlined id="mainSelect" class="layout selfEnd" @selected="${this.selectStatsType}">
            <mwc-list-item selected value="stats_posts">${this.t('posts')}</mwc-list-item>
            <mwc-list-item value="stats_points">${this.t('points')}</mwc-list-item>
            <mwc-list-item value="stats_votes">${this.t('votes')}</mwc-list-item>
          </mwc-select>
          </div>
          <canvas id="line-chart" width="800" height="410"></canvas>
          <div class="layout horizontal center-center timeButtons">
            <mwc-button focused .label="${this.t('day')}" @click="${this.setDay}"></mwc-button>
            <mwc-button .label="${this.t('month')}" @click="${this.setMonth}"></mwc-button>
            <mwc-button .label="${this.t('year')}" @click="${this.setYear}"></mwc-button>
          </div>
        </div>
      </div>
      <div class="container shadow-animation shadow-elevation-3dp wordCloudContainer">
        <yp-word-cloud .dataUrl="${this.wordCloudURL}"></yp-word-cloud>
      </div>
    `;
  }
}

window.customElements.define('page-trends', PageTrends);

