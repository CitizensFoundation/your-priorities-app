import { html, css, LitElement } from 'lit-element';
import { YpBaseElement } from './YpBaseElement';
//import "core-js";

import '@material/mwc-linear-progress';

//const ForceGraph3D = require('3d-force-graph');
//import * as am4core from "@amcharts/amcharts4/core";
//import * as am4charts from "@amcharts/amcharts4/charts";
//import * as am4plugins_wordCloud from "@amcharts/amcharts4/plugins/wordCloud";

export class YpWordCloud extends YpBaseElement {
  static get styles() {
    return css`
      :host {
        display: block;
        text-align: center;
      }

      #wordCloud {
        width: 100%;
        height: 100%;
        min-height: 500px;
      }

      [hidden] {
        display: none;
      }
    `;
  }

  static get properties() {
    return {
      dataUrl: { type: String },
      noData: { type: Boolean },
      waitingOnData: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.waitingOnData = true;
  }

  firstUpdated() {
    super.firstUpdated();
    this.chart = am4core.create(this.shadowRoot.getElementById("wordCloud"), am4plugins_wordCloud.WordCloud);
    this.series = this.chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
    this.series.dataFields.word = "word";
    this.series.dataFields.value = "value";
    this.chart.minWordLength = 3;
    this.chart.minFontSize = "14px";
    this.chart.maxFontSize = "25px";
    this.series.colors = new am4core.ColorSet();
    this.series.colors.passOptions = {};
    fetch(this.dataUrl, { credentials: 'same-origin' })
    .then(res => this.handleNetworkErrors(res))
    .then(res => res.json())
    .then(response => {
      if (!response.nodata) {
        this.series.data = JSON.parse(response.body).map((item)=>{
          return { word: item[0], value: item[1]};
        });
      }
      this.waitingOnData=false;
    })
    .catch(error => {
      this.fire('app-error', error);
    });
  }

  render() {
    return html`
      <mwc-linear-progress indeterminate ?hidden="${!this.waitingOnData}"></mwc-linear-progress>
      <div id="wordCloud"></div>
    `;
  }
}

window.customElements.define('yp-word-cloud', YpWordCloud);
