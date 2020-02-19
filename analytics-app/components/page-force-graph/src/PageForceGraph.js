import { html, css, LitElement, supportsAdoptingStyleSheets } from 'lit-element';

//const ForceGraph3D = require('3d-force-graph');

export class PageForceGraph extends LitElement {
  static get styles() {
    return css`
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
    this.title = 'Hello open-wc world!';
    this.logo = html``;
    this.graph = new ForceGraph3D().showNavInfo(false);
  }

  firstUpdated() {
    super.firstUpdated();
    const N = 300;
    const gData = {
      nodes: [...Array(N).keys()].map(i => ({ id: i })),
      links: [...Array(N).keys()]
        .filter(id => id)
        .map(id => ({
          source: id,
          target: Math.round(Math.random() * (id-1))
        }))
    };
    const Graph = ForceGraph3D()
      (this.shadowRoot.getElementById('3d-graph'))
        .showNavInfo(false)
        .graphData(gData);
  }

  render() {
    return html`
      <div id="3d-graph"></div>
    `;
  }
}
