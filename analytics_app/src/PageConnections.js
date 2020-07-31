/* eslint-disable prefer-template */
/* eslint-disable camelcase */
import { html, css } from 'lit-element';
import { YpBaseElement } from './YpBaseElement';
import { ShadowStyles } from './ShadowStyles';

import '@material/mwc-slider';
import '@material/mwc-linear-progress';


//const ForceGraph3D = require('3d-force-graph');

export class PageConnections extends YpBaseElement {
  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
      :host {
        display: block;
        text-align: center;
      }

      .graph {
      }

      .sliderContainer {
        padding: 16px;
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

      [hidden] {
        display: none !important;
      }


      .container {
        background-color: #FFF;
        padding: 24px;
        max-width: 850px;
        width: 850px;
        text-align: left;
        padding-bottom: 0;
        margin-bottom: 16px;
      }

      mwc-slider {
        width: 230px;
        margin-top: 16px;
        margin-right: 64px;
      }

      .similaritiesSlider {
        width: 650px;
      }

      .connectionsHeader {
        margin-bottom: 8px;
        color: var(--mdc-theme-primary);
        font-weight: bold;
      }

      .connectionsInfo {
        margin-right: 24px;
        margin-bottom: 12px;
      }

      mwc-linear-progress {
        width: 800px;
        margin-top: 8px;
        margin-bottom: 24px;
      }

      .similaritiesLabel {
        margin-top: 16px;
        font-weight: bold;
      }

      .infoTableItem {
        margin: 8px;
        padding: 8px;
      }

      .statsInfo {
        padding-left: 8px;
      }
    `];
  }

  static get properties() {
    return {
      collectionType: { type: String },
      collectionId: { type: String },
      dataUrl: { type: String },
      graphData: { type: Object },
      weightsFilter: { type: Number },
      originalGraphData: { type: Object },
      allObjects: { type: Object },
      allNodes: { type: Object },
      finalPositions: { type: Array },
      similaritiesData: { type: Array },
      totalNumberOfPosts: { type: Number },
      numberOfSimilarPosts: { type: Number },
      waitingOnData: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.logo = html``;
    this.kdtree=null;
    this.nodesIndex = {};
    this.allNodes = [];
    this.nodesIdsViewed = {};
    this.positionsCount = 0;
    this.cameraTimeStart = 800;
    this.cameraTime = this.cameraTimeStart;
  }

  connectedCallback() {
    super.connectedCallback();
    this.dataUrl ="/api/"+this.collectionType+"/"+this.collectionId+"/similarities_weights";
    this.weightsFilter = 0.74;
    this.graphData ={
      nodes: [],
      links: []
    };
    this.allObjects = [];
  }

  //TODO: Slider for weight minimums - filter client side and update the data
  //TODO: Traverse the ktree and build up position values for a position slider
  //TODO: 2D version also with different weight minimums

  setGraphData() {
    const links = [];
    this.nodesLinkCounts = {};

    const nodeIds = {};
    for (let i=0; i<this.originalGraphData.nodes.length;i++) {
      nodeIds[parseInt(this.originalGraphData.nodes[i].id)] = true;
    }

    for (let i=0; i<this.originalGraphData.links.length;i++) {
      const sourceId = parseInt(this.originalGraphData.links[i].source);
      const targetId = parseInt(this.originalGraphData.links[i].target);

      if (nodeIds[sourceId] && nodeIds[targetId]) {
        if (!this.nodesLinkCounts[sourceId]) {
          this.nodesLinkCounts[sourceId] = 0;
        }

        if (!this.nodesLinkCounts[targetId]) {
          this.nodesLinkCounts[targetId] = 0;
        }

        if (this.originalGraphData.links[i].value>this.weightsFilter) {
          links.push({...this.originalGraphData.links[i]});
          this.nodesLinkCounts[sourceId] += 1;
          this.nodesLinkCounts[targetId] += 1;
        }
      } else {
        console.warn(`Cant find node id for sourceId: ${sourceId} targetId: ${targetId}`);
      }
    }

     for (let i=0; i<this.allObjects.length;i++) {
      PageConnections.setUpObjectOpacity(this.nodesLinkCounts[parseInt(this.allNodes[i].id)], this.allObjects[i].children[0]);
      PageConnections.setUpObjectOpacity(this.nodesLinkCounts[parseInt(this.allNodes[i].id)], this.allObjects[i].children[1]);
     }

    this.graph.graphData({
      nodes: this.originalGraphData.nodes,
      links
    });
  }

  firstUpdated () {
    super.firstUpdated();
    this.setupForce3D();
    if (this.similaritiesData) {
      this.originalGraphData = this.similaritiesData;
      this.setGraphData();
    } else {
      this.waitingOnData = true;
      fetch(this.dataUrl, { credentials: 'same-origin' })
      .then(res => this.handleNetworkErrors(res))
      .then(res => res.json())
      .then(response => {
        if (!response.nodata) {
          this.originalGraphData = response;
          this.setGraphData();
          this.fire('set-similarities-data', this.originalGraphData);
        }
        this.waitingOnData = false;
      })
      .catch(error => {
        this.fire('app-error', error);
      });
    }
  }

  static setUpObjectOpacity (linkCount, imageSprite) {
    //console.error(`LinkCount: ${linkCount}`)

    if (linkCount && linkCount>0) {
      imageSprite.visible=true;
     } else {
      imageSprite.visible=false;
     }
  }

  setupForce3D() {
    this.graph = ForceGraph3D()
    (this.shadowRoot.getElementById('3d-graph'))
     .graphData(this.graphData)
     .nodeAutoColorBy('group')
     .linkDirectionalParticles("value")
     .linkDirectionalParticleSpeed(d => d.value * 0.001)
     .nodeLabel("lemmatizedContentNOTTT")
     .d3AlphaDecay(0.0120)
     .d3VelocityDecay(0.7)
     .linkOpacity(d => d.value)
     .backgroundColor("#000")
     .onNodeClick(node => {
       // Aim at node from outside it
       const distance = 300;
       const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

       this.graph.cameraPosition(
         { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
         node, // lookAt ({ x, y, z })
         1000  // ms transition duration
       );
     })
     .nodeThreeObject(node => {
       // use a sphere as a drag handle
       let score = node.counter_endorsements_up-node.counter_endorsements_down;
       score = score/30;
       score = 0;
       if (true || node.linkCount>0) {
         const obj = new THREE.Mesh(
         new THREE.SphereGeometry(0.00001*score),
         new THREE.MeshBasicMaterial({  color: 0xffffff, depthWrite: false, transparent: false, opacity: 1 }));

         const loader = new THREE.TextureLoader();
         loader.crossOrigin = "anonymous";
         const spriteMap = loader.load( node.imageUrl+"?intoThreeJs=1" );

         const spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
         const imageSprite = new THREE.Sprite( spriteMaterial );
         //TODO: Make image rounded corners or round
         //TODO: Create glow for text
         imageSprite.scale.set(24, 14);
         imageSprite.position.y=17.0;

         PageConnections.setUpObjectOpacity( this.nodesLinkCounts[parseInt(node.id)], imageSprite);
         obj.add( imageSprite );

         // add text sprite as child
         const sprite = new SpriteText(node.name);
         sprite.color = node.color;
         sprite.textHeight = 7;
         PageConnections.setUpObjectOpacity(this.nodesLinkCounts[parseInt(node.id)], sprite);

         obj.add(sprite);

         this.allObjects.push(obj);
         this.allNodes.push(node);

         return obj;
       }
    });

        // Spread nodes a little wider
       this.graph.d3Force('charge').strength(-200);
/*
        this.maxDistance = Math.pow( 120, 2 );
        const currentPosition = this.graph.cameraPosition();

        const getDistanceFrom = function(object,position) {
          var objectDistance = new THREE.Vector3();
          var target = new THREE.Vector3().copy(position);
          objectDistance.subVectors(object.position, target);
          return objectDistance.length();
        };

        const fastFwdButton = document.getElementById("fastFwdButton");

        fastFwdButton.onmousedown = function() {
          this.cameraTime = 100;
        }

        fastFwdButton.onmouseup = function () {
          this.cameraTime = this.cameraTimeStart;
        }

        document.getElementById("startButton").onclick = function () {
          makeAllTransparent();
          startNearestNodeLoop();
        }

        setTimeout(()=>{
          this.makeAllTransparent();
          this.startNearestNodeLoop();
        }, 30000); */

  }

  distanceFunction( a, b ) {
    return Math.pow( a[ 0 ] - b[ 0 ], 2 ) + Math.pow( a[ 1 ] - b[ 1 ], 2 ) + Math.pow( a[ 2 ] - b[ 2 ], 2 );
  };

  getDistanceFrom (fromPosition,position) {
    var objectDistance = new THREE.Vector3();
    var target = new THREE.Vector3().copy(position);
    objectDistance.subVectors(fromPosition, target);
    return objectDistance.length();
  };

  getNearestNode (position) {
    let nearestObject = null;
    let nearestObjectInView = null;
    let nearestObjectDistance = null;
    let nearestIndex = null;
    let nearestInviewIndex = null;
    let nearestObjectInviewDistance = null;

    for ( var x = 0; x < this.distanceObjects.length; x ++ ) {
      const distance = this.getDistanceFrom(position, this.distanceObjects[x].position);
      if (!nearestObjectDistance || distance<nearestObjectDistance) {
        nearestObjectDistance = distance;
        nearestObject = this.distanceObjects[x];
        nearestIndex = x;
      }
    }

    if (nearestObjectInView!=null) {
      return { node: nearestObjectInView, pos: nearestInviewIndex, nearestObjectDistance:nearestObjectInviewDistance  }
    } else {
      return { node: nearestObject, pos: nearestIndex, nearestObjectDistance: nearestObjectDistance }
    }
  }

  hideLetters () {
    for ( var x = 0; x < this.allObjects.length; x ++ ) {
      this.allObjects[x].children[1].material.transparent = true;
      this.allObjects[x].children[1].material.opacity = 0.0;
    }
  }

   makeAllTransparent() {
    for ( var x = 0; x < allObjects.length; x ++ ) {
      this.allObjects[x].children[0].material.transparent = true;
      this.allObjects[x].children[0].material.opacity = 0.6;
      this.allObjects[x].children[1].material.transparent = true;
      this.allObjects[x].children[1].material.opacity = 0.0;
    }
  }

  makeAllShown() {
    for ( var x = 0; x < this.allObjects.length; x ++ ) {
      this.allObjects[x].children[0].material.transparent = true;
      this.allObjects[x].children[0].material.opacity = 0.6;
      this.allObjects[x].children[1].material.transparent = true;
      this.allObjects[x].children[1].material.opacity = 0.0;
    }
  }

  findAllDistances() {
    if (this.distanceObjects.length>0) {
      const nodeResults = this.getNearestNode(this.lastDistanceObjectPos ? this.lastDistanceObjectPos : this.graph.cameraPosition());
      const spriteNode = nodeResults.node;
      //console.log("Sprite: "+spriteNode.position.x+" "+spriteNode.position.y+" "+spriteNode.position.z);

      const nodeIndex = nodeResults.pos;

      const d3Node = this.distanceNodes[nodeIndex];
      const d3Object = this.distanceObjects[nodeIndex];


      if (nodeResults.nearestObjectDistance<1000) {
        //console.error("Distance: "+nodeResults.nearestObjectDistance);
        //cameraTime = cameraTimeB;
      } else if (nodeResults.nearestObjectDistance>1400) {
        //console.warn("Distance: "+nodeResults.nearestObjectDistance);
        //cameraTime = cameraTimeB;
      } else {
        //console.log("Distance: "+nodeResults.nearestObjectDistance);
      }

      /*
      this.graph.cameraPosition(
          { x: d3Node.x * distRatio, y: d3Node.y * distRatio, z: d3Node.z * distRatio }, // new position
          d3Node, // lookAt ({ x, y, z })
          this.cameraTime  // ms transition duration
      );
      */

      this.allDistancePositions.push({
        pos: d3Object.position,
        node: d3Node,
        object: d3Object
      });
      this.lastDistanceObjectPos = d3Object.position;

      this.distanceObjects.splice(nodeIndex, 1);
      this.distanceNodes.splice(nodeIndex, 1);

      this.findAllDistances();
    } else {
      this.finalPositions = [... this.allDistancePositions];
      console.log("All items viewed");
      this.numberOfSimilarPosts = this.finalPositions.length;
    }
  }

  initNearestCalc() {
    this.distanceObjects = [];
    this.distanceNodes = [];
    for (let i=0;i<this.allObjects.length;i++) {
      if (this.nodesLinkCounts[parseInt(this.allNodes[i].id)]) {
        this.distanceObjects.push({...this.allObjects[i]});
        this.distanceNodes.push({...this.allNodes[i]});
      }
    }
    this.lastDistanceObjectPos = null;
    this.finalPositions = null;
    this.allDistancePositions = [];
    this.findAllDistances();
  }

  calculateNodePositionsKtree() {
    const nodePositions = new Float32Array( this.allObjects.length*3 );

    for (var x = 0; x < this.allObjects.length; x ++ ) {
      nodePositions[ x * 3 + 0 ] = this.allObjects[x].position.x;
      nodePositions[ x * 3 + 1 ] = this.allObjects[x].position.y;
      nodePositions[ x * 3 + 2 ] = this.allObjects[x].position.z;

      console.log(x);
      console.log(this.allObjects[x].position);
    }
    var measureStart = new Date().getTime();

    // creating the kdtree takes a lot of time to execute, in turn the nearest neighbour search will be much faster
    this.kdtree = new THREE.TypedArrayUtils.Kdtree( nodePositions, distanceFunction, 3 );

    console.log( 'TIME building kdtree', new Date().getTime() - measureStart );
  }

  weigthsSliderChange(event) {
    const weightsFilter = event.detail.value;
    if (this.weightsFilter!==weightsFilter) {
      this.weightsFilter = parseFloat(weightsFilter)/100.0;
      this.setGraphData();
    }
    this.allDistancePositions = null;
    this.initNearestCalc();
  }

  static zoomCameraToSelectionBroken( camera, controls, selection, fitOffset = 1.2 ) {

    const box = new THREE.Box3();

    for( const object of selection[3].children) {
      debugger;
      if (object.position && object.position.x!==null && object.position.y!==null && object.position.z!==null) {
        console.log(`${object.position.x} ${object.position.y} ${object.position.z} `)
        box.expandByObject( object );
      }
    }

    const size = box.getSize( new THREE.Vector3() );
    const center = box.getCenter( new THREE.Vector3() );

    const maxSize = Math.max( size.x, size.y, size.z );
    const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );

    const direction = controls.target.clone()
      .sub( camera.position )
      .normalize()
      .multiplyScalar( distance );

    controls.maxDistance = distance * 10;
    controls.target.copy( center );

    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();

    camera.position.copy( controls.target ).sub(direction);

    controls.update();
  }

  forceValueChange (event) {
    const sliderValue = event.detail.value;
   // this.graph.d3Force('link').strength(sliderValue);
    this.graph.d3Force('charge').strength(sliderValue);
    if (!this.reheatOnceAndWait) {
      this.graph.d3ReheatSimulation();
      this.reheatOnceAndWait = true;
      setTimeout(()=>{
        this.reheatOnceAndWait = null;
      }, 10000);
    }

    console.error(sliderValue);
    //this.graph.d3Force('center').strength(sliderValue);
  }

  objectViewSliderChange(event) {
    const sliderIndex = event.detail.value;
    const index = sliderIndex-1;
    if (this.allDistancePositions[index<0 ? 0 : index]) {
      const d3Node = this.allDistancePositions[index<0 ? 0 : index].node;
      const position = this.allDistancePositions[index<0 ? 0 : index].pos;
      const d3Object =this.allDistancePositions[index<0 ? 0 : index].object;

      const distance = 300;

      if (sliderIndex===0) {
        this.graph.cameraPosition(
          { x: 0, y: 0, z: -7500 }, // new position
          { x: 0, y: 0, z: 0}, // lookAt ({ x, y, z })
          this.cameraTime  // ms transition duration
        );
      } else {
        //d3Object.scale.set(2,2,2);
        //d3Object.children[0].material.opacity = 1.0;
        //d3Object.children[1].material.opacity = 1.0;
       // d3Node.children[1].position.y=35.0;

        const distRatio = 1 + distance/Math.hypot(d3Node.x, d3Node.y, d3Node.z);

        this.graph.cameraPosition(
            { x: position.x, y: position.y-75, z: position.z-575}, // new position
            { x: position.x, y: position.y, z: position.z }, // lookAt ({ x, y, z })
            900  // ms transition duration
        );

        console.log(position.x * distRatio);
        console.log(position.y * distRatio);
        console.log(position.x * distRatio);
      }
    } else {
      console.warn(`No this.allDistancePositions for index: ${index}`);
    }
  }

  render() {
    return html`
     <div class="layout vertical center-center">
        <div class="container shadow-animation shadow-elevation-3dp layout vertical ">
          <div class="layout vertical self-start">
            <div class="connectionsHeader layout horizontal">${this.t('introduction')}</div>
            <div class="connectionsInfo">${this.t('connectionsInfo')}</div>
            <div ?hidden="${this.waitingOnData}" class="layout horizontal infoTable">
              <div class="layout horizontal infoTableItem">
                <div class="statsInfo">${this.t('totalNumberOfPosts')}: ${this.totalNumberOfPosts}</div>
                <div class="statsInfo" ?hidden="${!this.finalPositions}">${this.t('numberOfPostsWithHighScore')}: ${this.numberOfSimilarPosts}</div>
                <div class="statsInfo" ?hidden="${!this.finalPositions}">${this.t('postsNotShownHere')}: ${this.totalNumberOfPosts-this.numberOfSimilarPosts}</div>
              </div>
            </div>
          </div>
          <div class="layout horizontal similaritiesSlider self-start">
            <div class="layout vertical">
              <div class="horizontal self-start similaritiesLabel">${this.t('similaritiesSlider')}</div>
              <mwc-slider
                step="2"
                pin
                ?disabled="${!this.originalGraphData}"
                markers
                @change=${this.weigthsSliderChange}
                max="95"
                min="42"
                value="74">
              </mwc-slider>
            </div>
              ${ (this.finalPositions) ? html`
              <div class="layout vertical">
                <div class="layout horizontal self-start similaritiesLabel">${this.t('exploreSlider')}</div>
                <mwc-slider
                  step="1"
                  pin
                  ?disabled="${!this.originalGraphData}"
                  markers
                  @input=${this.objectViewSliderChange}
                  max="${this.finalPositions.length+1}"
                  min="0"
                  value="0">
                </mwc-slider>
              </div>
              <div class="layout vertical">
                <div class="layout horizontal self-start similaritiesLabel">${this.t('forceStrength')}</div>
                <mwc-slider
                  step="1"
                  @input=${this.forceValueChange}
                  max="1500"
                  min="-5000"
                  value="-200">
                </mwc-slider>
              </div>
            ` : html``}
        </div>
        </div>
      </div>
      <div class="layout horizontal center-center">
        <mwc-linear-progress indeterminate ?hidden="${!this.waitingOnData}"></mwc-linear-progress>
      </div>
      <div id="3d-graph" class="graph"></div>
`;
  }
}

window.customElements.define('page-connections', PageConnections);