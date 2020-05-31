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
        display: flex;
        flex-direction: column;
        flex-basis: auto;
        background-color: #FFF;
        padding: 8px;
        width: 100%;
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
      collection: { type: Object }
    };
  }

  getStatsData(url, data) {
    fetch(url, { credentials: 'same-origin' })
    .then(res => res.json())
    .then(response => {
      const lineChartElement = this.shadowRoot.getElementById("line-chart");
      //console.log(JSON.stringify(response));
      if (!this.haveSetData) {
        this.chart = new Chart(lineChartElement, {
          type: 'bar',
          data:  { datasets: [
            {
              label: "By day",
              backgroundColor: "#F00",
              fill: false,
              data: response.finalDays
            }
          ] },
          options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                      unit: 'day'
                  }

                }]
            }
        }
        });
        this.haveSetdata = true;
      }
    })
    .catch(error => {
        console.error('Error:', error);
        this.fire('app-error', error);
      }
    );
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.collectionStatsPostsURL = `/api/${this.collectionType}/${this.collectionId}/stats_posts`;
    this.collectionStatsPointsURL = `/api/${this.collectionType}/${this.collectionId}/stats_points`;
    this.collectionStatsVotesURL = `/api/${this.collectionType}/${this.collectionId}/stats_votes`;
 //   this.getStatsData(this.collectionStatsPostsURL, this.statsPosts);
  //  this.getStatsData(this.collectionStatsPointsURL, this.statsPoints);
    this.getStatsData(this.collectionStatsVotesURL, this.statsVotes);
    this.wordCloudURL ="/api/"+this.collectionType+"/"+this.collectionId+"/wordcloud";
    this.collectionURL ="/api/"+this.collectionType+"/"+this.collectionId;

    fetch(this.collectionURL, { credentials: 'same-origin' })
    .then(res => res.json())
    .then(response => {
      this.collection = response;
    })
    .catch(error => {
        console.error('Error:', error);
        this.fire('app-error', error);
      }
    );
  }

  firstUpdated() {
    super.firstUpdated();
  }

  render() {
    return html`
    <div class="container shadow-animation shadow-elevation-3dp">
      <div class="layout vertical center-center">
        <mwc-select outlined id="cornerSelect">
          <mwc-list-item selected value="posts">${this.t('posts')}</mwc-list-item>
          <mwc-list-item value="points">${this.t('points')}</mwc-list-item>
          <mwc-list-item value="votes">${this.t('votes')}</mwc-list-item>
        </mwc-select>
        <canvas id="line-chart" width="800" height="450"></canvas>
        <div class="layout horizontal">
          <mwc-button .label="${this.t('day')}"></mwc-button>
          <mwc-button .label="${this.t('month')}"></mwc-button>
          <mwc-button .label="${this.t('year')}"></mwc-button>
        </div>
      </div>
    </div>
    <div class="container shadow-animation shadow-elevation-3dp">
      <yp-word-cloud .dataUrl="${this.wordCloudURL}"></yp-word-cloud>
    </div>
    `;
  }
}

window.customElements.define('page-trends', PageTrends);

