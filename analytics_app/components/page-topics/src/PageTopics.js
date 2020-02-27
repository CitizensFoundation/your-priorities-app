import { html, css, LitElement } from 'lit-element';

//const ForceGraph3D = require('3d-force-graph');
import '@material/mwc-slider';

export class PageTopics extends LitElement {
  static get styles() {
    return css`
      :host {
        display: grid;
        padding: 16px;
        width: 100%;
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

      .clusters {
      	columns: 250px;
      	column-gap: 16px;
        width: 95vw;
        padding-left: 64px;
        padding-right: 64px;
      }

      .postName {
        font-size: 12px;
        color: #000;
      }

      a {
        color: #000;
      }

      .cluster {
        break-inside: avoid-column;
      	margin-bottom: 1rem;
        color: #111;
        background: white;
        border-radius: 5px;
        padding: 1rem;
        text-decoration: none;
        box-shadow: 0px 1px 1px 1px #ddd;
      }

      .cluster:hover {
        transform: scale(1.007);
      }
    `;
  }

  static get properties() {
    return {
      collectionType: { type: String },
      collectionId: { type: String },
      dataUrl: { type: String },
      weightsFilter: { type: Number },
      nodesHash: { type: Object },
      clusters: { type: Array }
    };
  }

  constructor() {
    super();
    this.logo = html``;
    this.kdtree=null;
    this.nodesIndex = {};
    this.allObjects = [];
    this.allNodes = [];
    this.nodesIdsViewed = {};
    this.positionsCount = 0;
    this.cameraTimeStart = 800;
    this.cameraTime = this.cameraTimeStart;
  }

  connectedCallback() {
    super.connectedCallback();
    this.weightsFilter = 0.70;
    this.clusters = [];
    this.dataUrl ="/api/analytics/"+this.collectionType+"/"+this.collectionId+"/similarities_weights";
  }

  //TODO: Slider for weight minimums - filter client side and update the data
  //TODO: Traverse the ktree and build up position values for a position slider
  //TODO: 2D version also with different weight minimums

  firstUpdated() {
    super.firstUpdated();
    fetch(this.dataUrl, { credentials: 'same-origin' })
    .then(res => res.json())
    .then(response => {
      this.originalData = response;
      this.buildTopClusters();
    })
    .catch(error => {
        console.error('Error:', error);
        this.fire('app-error', error);
      }
    );
  }

  buildTopClusters () {
    console.error("start")
    const clusters = [];
    const nodesLinkCounts = {}
    const searchClusters = (id) => {
      for (let i = 0; i < clusters.length; i++) {
        if (clusters[i].indexOf(id)>-1) {
          return i;
        }
      }
      return -1;
    }

    this.originalData.links.forEach(link => {
     if (link.value>this.weightsFilter) {
       const sourceId = parseInt(link.source);
       const targetId = parseInt(link.target);

       if (!nodesLinkCounts[sourceId]) {
         nodesLinkCounts[sourceId] = 0;
       } else {
         nodesLinkCounts[sourceId] += 1;
       }

      if (!nodesLinkCounts[targetId]) {
        nodesLinkCounts[targetId] = 0;
      } else {
        nodesLinkCounts[targetId] += 1;
      }

      const sourceInClusterId = searchClusters(sourceId);
       const targetInClusterId = searchClusters(targetId);
        if (sourceInClusterId===-1 && targetInClusterId===-1) {
          clusters.push([sourceId,targetId]);
        } else if (sourceInClusterId!==-1 && targetInClusterId!==-1) {
          // Dont do anything
        } else if (sourceInClusterId!==-1) {
          clusters[sourceInClusterId].push(targetId);
        } else if (targetInClusterId!==-1) {
          clusters[targetInClusterId].push(sourceId);
        }
     }
    });

    this.nodesHash = {};
    this.clusters = clusters;

    for (let i = 0; i < this.originalData.nodes.length; i++) {
      const id = parseInt(this.originalData.nodes[i].id);
      this.nodesHash[id]=this.originalData.nodes[i];
      this.nodesHash[id].linkCount = nodesLinkCounts[id];
    }
    console.error("end")
  }

  getPostName(postId) {
    return this.nodesHash[postId].name;
  }

  sliderChange(event) {
    setTimeout(()=>{
      const weightsFilter = event.detail.value;
      if (this.weightsFilter!==weightsFilter) {
        this.weightsFilter = parseFloat(weightsFilter)/100.0;
        this.buildTopClusters();
      }
    });
  }

  render() {
    return html`
     <mwc-slider
            step="2"
            pin
            ?disabled="${!this.clusters || this.clusters.length===0}"
            markers
            @input=${this.sliderChange}
            max="95"
            min="55"
            value="70">
      </mwc-slider>
      <div id="clusters" class="clusters">
        ${this.clusters.map(cluster => {
          return html`
            <div class="cluster" data-span="4">
              ${cluster.map(postId => {
                return html`
                    <div class="post postName layout horizontal">
                      <img width="40" height="22" src="${this.nodesHash[postId].imageUrl}"/>
                      <a href="/post/${postId}" target="_blank">${this.getPostName(postId)}</a>
                    </div>
                `
              })}
            </div>
          `
        })}
      </div>
    `;
  }
}
