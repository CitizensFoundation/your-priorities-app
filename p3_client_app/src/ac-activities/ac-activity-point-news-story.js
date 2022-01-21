import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-point/yp-point.js';
import '../yp-point/yp-point-news-story.js';
import '../yp-magic-text/yp-magic-text.js';
import { ypActivityGroupTitleBehavior } from './yp-activity-group-title-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        width: 100%;
      }

      .newsStoryContainer {
        padding-left: 8px;
        padding-right: 8px;
      }

      .postName {
        cursor: pointer;
        margin-top: 16px;
        padding-left: 8px;
        padding-right: 8px;
        color: #555;
      }

      .groupTitle {
        font-size: 15px;
        color: #777;
        padding-bottom: 16px;
        margin: 0;
        padding-top: 0;
      }

      .hasPointer {
        cursor: pointer;
      }

      .mainContainer {
        width: auto;
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <div class="layout vertical mainContainer">
      <yp-magic-text on-tap="_goToPost" class="postName" hidden\$="[[!activity.Post.name]]" text-only="" text-type="postName" content-language="[[activity.Post.language]]" content="[[activity.Post.name]]" content-id="[[activity.Post.id]]">
      </yp-magic-text>
      <div class="layout vertical center-center newsStoryContainer">
        <yp-point-news-story with-comments="" hide-user="" class="card" point="[[activity.Point]]"></yp-point-news-story>
      </div>
      <template is="dom-if" if="[[hasGroupHeader]]">
        <div class="groupTitle layout horizontal center-center">[[groupTitle]]</div>
      </template>
    </div>
`,

  is: 'ac-activity-point-news-story',

  behaviors: [
    ypLanguageBehavior,
    ypActivityGroupTitleBehavior,
    ypGotoBehavior
  ],

  properties: {

    activity: {
      type: Object
    },

    postId: {
      type: Boolean,
      value: null
    }
  },

  _goToPost: function (){
    this.goToPost(this.activity.Post.id, null, this.activity);
  },

  _hidePostName: function (activity) {
    return (this.postId!=null);
  }
});
