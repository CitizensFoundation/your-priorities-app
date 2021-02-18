/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import 'chart.js';
import * as d3 from 'd3';
import { html, css } from 'lit-element';
import './YpWordCloud.js';
import { YpBaseElement } from './YpBaseElement';
import { ShadowStyles } from './ShadowStyles';
import '@material/mwc-select';
import '@material/mwc-button';
import '@material/mwc-list/mwc-list-item';

export class PageMap extends YpBaseElement {
  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
      :host {
        width: 4000px;
        height: 100%;
      }

      #map {
        width: 4000px;
        height: 100%;
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

  getMapData(url) {
    fetch(url, { credentials: 'same-origin' })
    .then(res => this.handleNetworkErrors(res))
    .then(res => res.json())
    .then(response => {
      this.waitingOnData = false;
      this.$$("#map").append(this.getTidyTree(response))
    })
    .catch(error => {
      this.fire('app-error', error);
    });
  }

  constructor() {
    super();
    this.waitingOnData = true;
  }

  getMap() {
    this.collectionStatsUrl = `/api/communities/${this.collectionId}/recursiveMap`;
    this.getMapData(this.collectionStatsUrl);
  }

  connectedCallback() {
    super.connectedCallback();
    this.getMap();
  }

  firstUpdated() {
    super.firstUpdated();
  }

  getTreeData(data, width) {
    const root = d3.hierarchy(data);
    root.dx = 10;
    root.dy = width / (root.height + 1);
    return d3.tree().nodeSize([root.dx, root.dy])(root);
  }

  getTidyTree(data) {
    const width = 5000;

    const root = this.getTreeData(data, width);

    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2]);

    const g = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

    const link = g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
    .selectAll("path")
      .data(root.links())
      .join("path")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    const node = g.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);

    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
      .clone(true).lower()
        .attr("stroke", "white");

    return svg.node();
  }

  getCollapsableChart(data) {
    const width = 100;
    const dx = 10;
    const dy = width / 6;
    const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
    const margin = ({top: 10, right: 120, bottom: 10, left: 40})

    const root = d3.hierarchy(data);

    const tree = d3.tree().nodeSize([dx, dy])

    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    const svg = d3.create("svg")
        .attr("viewBox", [-margin.left, -margin.top, width, dx])
        .style("font", "10px sans-serif")
        .style("user-select", "none");

    const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

    function update(source) {
      const duration = d3.event && d3.event.altKey ? 2500 : 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Compute the new tree layout.
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + margin.top + margin.bottom;

      const transition = svg.transition()
          .duration(duration)
          .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
          .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

      // Update the nodes…
      const node = gNode.selectAll("g")
        .data(nodes, d => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append("g")
          .attr("transform", d => `translate(${source.y0},${source.x0})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0)
          .on("click", (event, d) => {
            d.children = d.children ? null : d._children;
            update(d);
          });

      nodeEnter.append("circle")
          .attr("r", 2.5)
          .attr("fill", d => d._children ? "#555" : "#999")
          .attr("stroke-width", 10);

      nodeEnter.append("text")
          .attr("dy", "0.31em")
          .attr("x", d => d._children ? -6 : 6)
          .attr("text-anchor", d => d._children ? "end" : "start")
          .text(d => d.data.name)
        .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .attr("stroke", "white");

      // Transition nodes to their new position.
      const nodeUpdate = node.merge(nodeEnter).transition(transition)
          .attr("transform", d => `translate(${d.y},${d.x})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition(transition).remove()
          .attr("transform", d => `translate(${source.y},${source.x})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);

      // Update the links…
      const link = gLink.selectAll("path")
        .data(links, d => d.target.id);

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append("path")
          .attr("d", d => {
            const o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

      // Transition links to their new position.
      link.merge(linkEnter).transition(transition)
          .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
          .attr("d", d => {
            const o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          });

      // Stash the old positions for transition.
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);

    return svg.node();
  }

  render() {
    return html`
      <div class="container shadow-animation shadow-elevation-3dp">
        <mwc-linear-progress indeterminate ?hidden="${!this.waitingOnData}"></mwc-linear-progress>
      </div>
      <div  id="map">
      </div>

    `;
  }
}

window.customElements.define('page-map', PageMap);

