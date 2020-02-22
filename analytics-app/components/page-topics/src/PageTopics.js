import { html, css, LitElement } from 'lit-element';

//const ForceGraph3D = require('3d-force-graph');

export class PageTopics extends LitElement {
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

      .cluster {
        margin: 32px;
      }
    `;
  }

  static get properties() {
    return {
      collectionType: { type: String },
      collectionId: { type: String },
      dataUrl: { type: String },
      minimumLinkWeight: { type: Number },
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
    this.minimumLinkWeight = 0.75;
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
      this.buildTopClusters(response);
    })
    .catch(error => {
        console.error('Error:', error);
        this.fire('app-error', error);
      }
    );
  }

  buildTopClusters (data) {
    const clusters = [];
    const searchClusters = (id) => {
      for (let i = 0; i < clusters.length; i++) {
        if (clusters[i].indexOf(id)>-1) {
          return i;
        }
      }
      return -1;
    }

    data.links.forEach(link => {
     if (link.value>this.minimumLinkWeight) {
       const sourceId = parseInt(link.source);
       const targetId = parseInt(link.target);

       const sourceInClusterId = searchClusters(sourceId);
       const targetInClusterId = searchClusters(targetId);
        // Check if source is in a cluster
        // Check if target is in a cluster

        if (sourceInClusterId===-1 && targetInClusterId===-1) {
          clusters.push([sourceId,targetId]);
        }

        if (sourceInClusterId!==-1) {
          clusters[sourceInClusterId].push(targetId);

        } else if (targetInClusterId!==-1) {
          clusters[targetInClusterId].push(sourceId);
        }
     }
    });

    this.nodesHash = {};
    this.clusters = clusters;

    for (let i = 0; i < data.nodes.length; i++) {
      this.nodesHash[parseInt(data.nodes[i].id)]=data.nodes[i];
    }
  }

 getPostName(postId) {
   return this.nodesHash[postId].name;
 }

  render() {
    return html`
      <div id="clusters">
        ${this.clusters.map(cluster=>{
          return html`
            <div class="cluster">
              ${cluster.map(postId=>{
                return html`
                  <div class="post">
                    <div class="postName">
                    ${this.getPostName(postId)}
                    </div>
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
