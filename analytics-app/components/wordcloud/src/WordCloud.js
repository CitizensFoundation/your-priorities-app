import { html, css, LitElement, supportsAdoptingStyleSheets } from 'lit-element';

//const ForceGraph3D = require('3d-force-graph');
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_wordCloud from "@amcharts/amcharts4/plugins/wordCloud";

export class WordCloud extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        text-align: center;
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      logo: { type: Function },
    };
  }

  constructor() {
    super();
    this.url ="";
  }

  firstUpdated() {
    super.firstUpdated();
    this.chart = am4core.create("wordCloud", am4plugins_wordCloud.WordCloud);
    this.series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
    this.series.dataFields.word = "1";
    this.series.dataFields.value = "2";
    fetch(this.url, { credentials: 'same-origin' })
    .then(res => res.json())
    .then(response => {
      debugger;
      this.series.data = response;
    })
    .catch(error => {
        console.error('Error:', error);
        this.fire('app-error', error);
      }
    );
  }

  render() {
    return html`
      <div id="wordCloud"></div>
    `;
  }
}
