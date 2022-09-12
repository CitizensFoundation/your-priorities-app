import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-card/paper-card.js';
import '../../yp-app-globals/yp-app-icons.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { ypLanguageBehavior } from '../../yp-behaviors/yp-language-behavior.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
      }

      .grid {
        @apply --layout-vertical;
      }

      yp-group-card {
        padding: 8px;
      }

    </style>

    <div class="grid">
      <yp-group-card id="group1"></yp-group-card>
      <yp-group-card id="group2"></yp-group-card>
      <yp-group-card id="group4"></yp-group-card>
      <yp-group-card id="group3"></yp-group-card>
      <yp-group-card id="group5"></yp-group-card>
    </div>
`,

  is: 'test-groups',

  behaviors: [
    ypLanguageBehavior
  ],

  ready: function (e) {
    this.$.group3.group = {id: 368,
      name:'NHS Citizen',
      top_banner_file_name: 'NHScitizen_logo_final2c.png',
      description:'This is a test version of the NHS Citizen Gather space; it helps people identify and discuss the issues that the NHS should be talking about. Posts that generate the most discussion and support or whith the right people.',
      counter_posts: 232,
      counter_points: 1500,
      counter_users: 10000
    };

    this.$.group2.group = {id: 361,
      name:'Iceland top posts',
      top_banner_file_name: 'NHScitizen_logo_final2c.png',
      description:'Your posts and participation will help provide a series of recommendations to the European Commission on the best strategies, policies and funding instruments.',
      counter_posts: 433,
      counter_points: 1500,
      counter_users: 500
    };

    this.$.group1.group = {id: 328,
      name:'Educational priorities',
      top_banner_file_name: 'NHScitizen_logo_final2c.png',
      description:'Learn about transparency and the prioritization of posts. Students are posting what they would like to see happen in the classroom and the posts with many upvotes will be discussed and implemented.',
      counter_posts: 64,
      counter_points: 123,
      counter_users: 123
    };

    this.$.group4.group = {id: 361,
      name:'Iceland top posts',
      top_banner_file_name: 'NHScitizen_logo_final2c.png',
      description:'Your posts and participation will help provide a series of recommendations to the European Commission on the best strategies, policies and funding instruments.',
      counter_posts: 433,
      counter_points: 1500,
      counter_users: 500
    };

    this.$.group5.group = {id: 361,
      name:'Iceland top posts',
      top_banner_file_name: 'NHScitizen_logo_final2c.png',
      description:'Your posts and participation will help provide a series of recommendations to the European Commission on the best strategies, policies and funding instruments.',
      counter_posts: 433,
      counter_points: 1500,
      counter_users: 500
    };
  }
});
