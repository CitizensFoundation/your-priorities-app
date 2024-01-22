import{n as t,t as a,Y as i,i as s,x as e,b as l,T as r}from"./C7qipqwV.js";import{C as n}from"./da63nve-.js";var o=function(t,a,i,s){for(var e,l=arguments.length,r=l<3?a:null===s?s=Object.getOwnPropertyDescriptor(a,i):s,n=t.length-1;n>=0;n--)(e=t[n])&&(r=(l<3?e(r):l>3?e(a,i,r):e(a,i))||r);return l>3&&r&&Object.defineProperty(a,i,r),r};let d=class extends i{static get styles(){return[super.styles,s`
        :host {
          margin-top: 16px;
        }

        canvas {
        }

        .wrapper {
          position: relative;
          display: inline-block;
          margin-left: 16px;
          margin-right: 16px;
        }

        .wrapper[small] {
          padding: 0;
          margin-left: 14px;
          margin-right: 14px;
        }

        .wrapper[small-screen] {
          padding: 0;
          margin-left: 14px;
          margin-right: 14px;
        }

        .text {
          position: absolute;
          text-align: center;
          width: 100%;
          line-height: 190px;
          font-size: 28px;
          color: #000;
        }

        .text[small] {
          line-height: 135px;
          font-size: 20px;
        }

        .text[small-screen] {
          line-height: 135px;
          font-size: 20px;
        }

        canvas {
          position: relative;
          z-index: 1;
        }

        .header {
          font-size: 28px;
          margin-bottom: 8px;
          margin-top: 16px;
        }

        .groupName {
          font-size: 28px;
          margin: 8px;
          padding: 8px;
          color: #222;
          margin-top: 0;
          padding-top: 0;
        }

        .groupName[small-screen] {
          font-size: 20px;
          margin-bottom: 16px;
        }

        .topHeader {
          font-size: 22px;
          margin: 8px;
          margin-top: 0;
          color: #111;
        }

        .firstTopHeader {
          color: #333;
        }

        .targetText {
          margin-top: 8px;
          margin-bottom: 8px;
          font-size: 22px;
          text-align: center;
          color: #111;
        }

        .targetText[small] {
          font-size: 18px;
        }

        .targetText[small-screen] {
          font-size: 18px;
        }

        .stage[not-small] {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        .stage {
          background-color: #fefefe;
          padding: 16px;
          padding-top: 24px;
          width: 520px;
          margin: 16px;
          margin-bottom: 8px;
        }

        .stage[small] {
          width: 400px;
          margin: 0;
          padding: 8px;
          padding-top: 32px;
          padding-bottom: 16px;
        }

        .stage[small-screen] {
          width: 300px;
          padding: 8px;
          padding-top: 32px;
          padding-bottom: 16px;
        }

        .stageTop {
          background-color: #fefefe;
          padding: 16px;
          width: 520px;
          margin: 16px;
          margin-bottom: 8px;
          padding-top: 8px;
        }

        [hidden] {
          display: none !important;
        }
      `]}get canvasSize(){return this.wide?135:190}firstUpdated(t){super.firstUpdated(t),this._drawCharts()}formatAmount(t){return`$${t}m`}_drawCharts(){const t=this.group.configuration.dataForVisualizationJson;this._drawChart("#overallTarget",t.overallTargetPercent,this.t("overall"),t.overallColor?t.overallColor:"#5bac51"),this._drawChart("#overallActual",t.overallActualPercent,this.t("actual"),t.overallColor?t.overallColor:"#5bac51"),this._drawChart("#yearTarget",t.yearTargetPercent,this.t("overall"),t.yearColor?t.yearColor:"#004f77"),this._drawChart("#yearActual",t.yearActualPercent,this.t("actual"),t.yearColor?t.yearColor:"#004f77")}_drawChart(t,a,i,s,e=!1){new n(this.$$(t).getContext("2d"),{type:"doughnut",data:{labels:[i,i],datasets:[{data:[a,a-100],borderColor:[e?"transparent":"#FFF",e?"transparent":"#FFF"],backgroundColor:[s,e?"transparent":"rgb(220,220,220)"]}]},options:{tooltips:!1,legend:{display:!1},toolstips:{callbacks:{label:t=>t.yLabel}}}})}render(){const t=this.group.configuration.dataForVisualizationJson;return e`
      <div class="layout vertical center-center">
        <div
          class="layout vertical stage shadow-elevation-2dp center-center"
          ?small-screen="${!this.wide}"
          ?small="${!this.wide}"
          ?not-small="${this.wide}"
        >
          <div class="layout vertical" ?hidden="${!this.wide}">
            <yp-magic-text
              id="groupName"
              class="groupName"
              ?small-screen="${!this.wide}"
              text-type="groupName"
              .contentLanguage="${this.group.language}"
              .disableTanslation="${this.group.configuration.disableNameAutoTranslation}"
              textOnly
              .content="${this.group.name}"
              .contentId="${this.group.id}"
            >
            </yp-magic-text>
          </div>
          <div class="topHeader firstTopHeader" ?hidden="${!this.wide}">
            ${this.t("overall")}
          </div>
          <div class="layout horizontal center-center">
            <div>
              <div
                id="breakdownWrap"
                class="wrapper"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                <div
                  class="text"
                  ?small-screen="${!this.wide}"
                  ?small="${!this.wide}"
                >
                  ${t.overallTargetPercent}%
                </div>
                <canvas
                  id="overallTarget"
                  width="${this.canvasSize}"
                  height="${this.canvasSize}"
                ></canvas>
              </div>
              <div
                class="layout vertical targetText"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                ${this.t("target")}:
                ${this.formatAmount(t.overallTargetAmount)}
              </div>
            </div>
            <div>
              <div
                id="breakdownWrapTwo"
                class="wrapper"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                <div
                  class="text"
                  ?small-screen="${!this.wide}"
                  ?small="${!this.wide}"
                >
                  ${t.overallActualPercent}%
                </div>
                <canvas
                  id="overallActual"
                  width="${this.canvasSize}"
                  height="${this.canvasSize}"
                ></canvas>
              </div>
              <div
                class="layout vertical targetText"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                ${this.t("actual")}:
                ${this.formatAmount(t.overallActualAmount)}
              </div>
            </div>
          </div>
        </div>

        <div
          class="layout vertical stage shadow-elevation-2dp center-center"
          ?small-screen="${!this.wide}"
          ?small="${!this.wide}"
          ?not-small="${this.wide}"
        >
          <div class="layout vertical topHeader">${t.currentYear}</div>
          <div class="layout horizontal center-center">
            <div>
              <div
                id="breakdownWrapA"
                class="wrapper"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                <div
                  class="text"
                  ?small-screen="${!this.wide}"
                  ?small="${!this.wide}"
                >
                  ${t.yearTargetPercent}%
                </div>
                <canvas
                  id="yearTarget"
                  width="${this.canvasSize}"
                  height="${this.canvasSize}"
                ></canvas>
              </div>
              <div
                class="layout vertical targetText"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                ${this.t("target")}: ${this.formatAmount(t.yearTargetAmount)}
              </div>
            </div>
            <div>
              <div
                id="breakdownWrapTwoA"
                class="wrapper"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                <div
                  class="text"
                  ?small-screen="${!this.wide}"
                  ?small="${!this.wide}"
                >
                  ${t.yearActualPercent}%
                </div>
                <canvas
                  id="yearActual"
                  width="${this.canvasSize}"
                  height="${this.canvasSize}"
                ></canvas>
              </div>
              <div
                class="layout vertical targetText"
                ?small-screen="${!this.wide}"
                ?small="${!this.wide}"
              >
                ${this.t("actual")}: ${this.formatAmount(t.yearActualAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `}};o([t({type:Object})],d.prototype,"group",void 0),d=o([a("yp-data-visualization")],d);var p=function(t,a,i,s){for(var e,l=arguments.length,r=l<3?a:null===s?s=Object.getOwnPropertyDescriptor(a,i):s,n=t.length-1;n>=0;n--)(e=t[n])&&(r=(l<3?e(r):l>3?e(a,i,r):e(a,i))||r);return l>3&&r&&Object.defineProperty(a,i,r),r};let c=class extends l{render(){return e`
      ${this.renderHeader()}
      ${this.collection?e`
            <yp-data-visualization
              .group="${this.collection}"
            ></yp-data-visualization>
          `:r}
    `}};c=p([a("yp-group-data-viz")],c);
