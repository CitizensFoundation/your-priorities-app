import { html, css } from 'lit-element';
import { YpBaseElement } from './YpBaseElement.js';
import { ShadowStyles } from './ShadowStyles.js';

import '@material/mwc-slider';
import '@material/mwc-linear-progress';

export class PageTopics extends YpBaseElement {
  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
      :host {
        display: grid;
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
        margin-top: 24px;
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

      .container {
        background-color: #FFF;
        padding: 24px;
        max-width: 850px;
        width: 850px;
      }

      mwc-slider {
        width: 230px;
        margin-top: 40px;
      }

      .similaritiesSlider {
        width: 650px;
      }

      .topicsHeader {
        margin-bottom: 8px;
        color: var(--mdc-theme-primary);
        font-weight: bold;
      }

      .topicsInfo {
        margin-right: 24px;
        margin-bottom: 12px;
      }

      .post {
        padding: 4px;
      }

      .postImage {
        margin-right: 6px;
      }

      .postNameLink {
        margin-top: -2px;
      }

      a {
        text-decoration: none;
      }

      #clusters {
        margin-bottom: 48px;
      }

      mwc-linear-progress {
        width: 800px;
        margin-top: 24px;
      }

      .similaritiesLabel {
        font-style: italic;
        color: #555;
      }

      .infoTableItem {
        margin-left: 8px;
        color: #333;
      }
    `];
  }

  static get properties() {
    return {
      collectionType: { type: String },
      collectionId: { type: String },
      dataUrl: { type: String },
      weightsFilter: { type: Number },
      nodesHash: { type: Object },
      clusters: { type: Array },
      totalNumberOfPosts: { type: Number },
      numberOfSimilarPosts: { type: Number },
      numberOfClusters: { type: Number },
      similaritiesData: { type: Array },
      waitingOnData: { type: Boolean }
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
    this.dataUrl ="/api/"+this.collectionType+"/"+this.collectionId+"/similarities_weights";
  }

  //TODO: Slider for weight minimums - filter client side and update the data
  //TODO: Traverse the ktree and build up position values for a position slider
  //TODO: 2D version also with different weight minimums

  firstUpdated() {
    super.firstUpdated();
    if (this.similaritiesData) {
      this.originalData = this.similaritiesData;
      this.buildTopClusters();
    } else {
      this.waitingOnData = true;
      fetch(this.dataUrl, { credentials: 'same-origin' })
      .then(res => this.handleNetworkErrors(res))
      .then(res => res.json())
      .then(response => {
        if (!response.nodata) {
          this.originalData = response;
          this.buildTopClusters();
          this.fire('set-similarities-data', this.originalData);
        }
        this.waitingOnData = false;
      })
      .catch(error => {
        this.fire('app-error', error);
      });
    }
  }

  countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            count+=prop.length;
    }

    return count;
  }

  buildTopClusters () {
//    console.error("start");
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
    this.numberOfSimilarPosts = this.countProperties(this.clusters);
    this.numberOfClusters = this.clusters.length;
//    console.error("end");
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
      <div class="layout vertical center-center">
        <div class="container shadow-animation shadow-elevation-3dp layout horizontal self-start">
          <div class="layout vertical self-start">
            <div class="topicsHeader layout horizontal">${this.t('introduction')}</div>
            <div class="topicsInfo">${this.t('topicsInfo')}</div>
            <div ?hidden="${this.waitingOnData}" class="layout horizontal infoTable">
              <div class="layout vertical infoTableItem">
                <div class="statsInfo">${this.t('totalNumberOfPosts')}: ${this.totalNumberOfPosts}</div>
                <div class="statsInfo">${this.t('numberOfPostsWithHighScore')}: ${this.numberOfSimilarPosts}</div>
              </div>
              <div class="layout vertical infoTableItem">
                <div class="statsInfo">${this.t('currentNumberOfClusters')}: ${this.numberOfClusters}</div>
                <div class="statsInfo">${this.t('postsNotShownHere')}: ${this.totalNumberOfPosts-this.numberOfSimilarPosts}</div>
              </div>
            </div>
          </div>
          <div class="layout center-center similaritiesSlider self-start">
            <div class="topicsHeader self-start">${this.t('controls')}</div>
            <mwc-slider
                  step="2"
                  pin
                  ?disabled="${!this.clusters || this.clusters.length===0}"
                  markers
                  @input=${this.sliderChange}
                  max="98"
                  min="42"
                  value="70">
            </mwc-slider>
            <div class="layout horizontal self-start similaritiesLabel">${this.t('similaritiesSlider')}</div>
          </div>
        </div>
      </div>
      <div class="layout horizontal center-center">
        <mwc-linear-progress indeterminate ?hidden="${!this.waitingOnData}"></mwc-linear-progress>
      </div>
      <div id="clusters" class="clusters">
        ${this.clusters.map(cluster => {
          return html`
            <div class="cluster" data-span="4">
              ${cluster.map(postId => {
                return this.nodesHash[postId] ?
                html`
                    <div class="post postName layout horizontal">
                      <img width="40" class="postImage" height="22" src="${this.nodesHash[postId].imageUrl}"/>
                       <a href="/post/${postId}" class="postNameLink" target="_blank">${this.getPostName(postId)}</a>
                    </div>
                ` : html``;
              })}
            </div>
          `
        })}
      </div>
    `;
  }
}

window.customElements.define('page-topics', PageTopics);
