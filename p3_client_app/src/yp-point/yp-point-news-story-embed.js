import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../yp-app-globals/yp-app-icons.js';
import '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      iron-image {
        width: 550px;
        height: 309px;
      }

      @media (max-width: 600px) {
        iron-image {
          width: 90vw !important;
          height: 51vw !important;
        }
      }

      #embedHtml {
        width: 100%;
        height: 100%;
        border: 1px solid;
        border-color: #999;
        padding: 16px;
      }

      a {
        color: #333;
        text-decoration: none;
      }

      .title {
      }

      .description {
        padding-bottom: 20px;
      }

      .container {
        border-bottom: solid #ddd;
        border-bottom-width: 1px;
        margin-top: 8px;
      }

      [hidden] {
        display: none !important;
      }
    </style>

    <div hidden\$="[[!embedData]]">
      <div class="layout vertical embedContainer">
        <a href\$="[[embedData.url]]" class="container" target="_blank">
          <div class="layout vertical center-center">
            <iron-image sizing="contain" src\$="[[embedData.thumbnail_url]]" hidden\$="[[embedData.html]]"></iron-image>
            <div id="embedHtml" hidden\$="[[!embedData.html]]">
              <div inner-h-t-m-l="{{embedData}}"></div>
            </div>
          </div>
          <div class="layout vertical">
            <div class="title">
              <h2>[[embedData.title]]</h2>
            </div>
            <div class="description">
              [[embedData.description]]
            </div>
          </div>
        </a>
      </div>
    </div>
`,

  is: 'yp-point-news-story-embed',

  properties: {

    embedData: {
      type: Object,
      notify: true
    }
  }
})
