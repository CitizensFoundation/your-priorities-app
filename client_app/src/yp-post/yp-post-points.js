import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-material/paper-material.js';
import '../../../../@polymer/paper-radio-button/paper-radio-button.js';
import '../../../../@polymer/paper-radio-group/paper-radio-group.js';
import '../../../../@polymer/paper-input/paper-textarea.js';
import '../../../../@polymer/paper-toast/paper-toast.js';
import '../yp-app-globals/yp-app-icons.js';
import '../yp-behaviors/yp-iron-list-behavior.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-behaviors/emoji-selector.js';
import '../yp-point/yp-point.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">

      :host {
        display: block;
      }

      .item {
        @apply --layout-horizontal;
      }

      .main-container {
        @apply --layout-horizontal;
        background-color: var(--primary-background-color);
      }

      .point {
        padding-top: 32px;
        padding-bottom: 32px;
        padding-left: 24px;
        padding-right: 24px;
        @apply --layout-vertical;
        width: 398px;
      }

      .pointInputMaterial {
        padding-top: 24px;
        padding-bottom: 16px;
        padding-left: 16px;
        padding-right: 16px;
        margin-bottom: 16px;
        background-color: #FFF;
      }

      paper-toast {
        z-index: 9999;
      }

      paper-material {
        background-color: #fff;
      }

      yp-point {
        padding-top: 8px;
      }

      .pointMaterial {
        padding-top: 8px;
        background-color: #FFF;
        padding-left: 0;
        padding-right: 0;
        width: 430px;
        margin-bottom: 12px;
      }

      .thumbIcon {
        height: 64px;
        width: 64px;
        padding-bottom: 16px;
        color: var(--primary-color);
      }

      .editIcon {
        height: 28px;
        width: 28px;
        padding-bottom: 16px;
        color: var(--primary-color);
      }

      .addPointFab {
        width: 100%;
        color: #FFF;
      }

      paper-textarea {
        --paper-input-container-label: {
          font-size: 26px;
          height: 42px;
          overflow: visible;
          color: #AAAAAA;
        }
      }

      .howToWriteInfoText {
        padding-top: 4px;
        color: var(--primary-color);
      }

      .point .main-container .topContainer {
        background-color: var(--primary-background-color) !important;
      }

      .penContainer {
        margin-top: 42px;
      }

      .upOrDown {
        margin-top: 72px;
      }

      paper-radio-button {
        --paper-radio-button-checked-color: var(--accent-color) !important;
        font-size: 16px;
      }

      #pointUpOrDownMaterial {
        margin-top: 16px;
      }

      .mobileFab {
        margin-top: 8px;
      }

      paper-button {
        color: #FFF;
        background-color: var(--accent-color);
      }

      @media (max-width: 985px) {
        .pointInputMaterial {
          width: 420px;
          font-size: 30px;
        }
      }

      @media (max-width: 600px) {
        .pointInputMaterial {
          width: 268px;
          font-size: 10px;
          padding-top: 4px;
        }

        .pointMaterial {
          width: 300px;
        }

        .main-container {
          width: 310px;
        }

        iron-list {
          width: 300px;
        }
      }

      .mobilePaperTextArea {
        --paper-input-container-label: {
          font-size: 19px;
        };
      }

      .pointMainHeader {
        font-size: 26px;
        margin-bottom: 16px;
        color: #555;
      }

      #pointUpMaterialNotUsed {
        border-top: solid 2px;
        border-top-color:  var(--master-point-up-color);
      }

      #pointDownMaterialNotUsed {
        border-top: solid 2px;
        border-top-color: var(--master-point-down-color);
      }

      .pointElement {
        margin-bottom: 18px;
      }

      [hidden] {
        display: none !important;
      }

      iron-list {
        height: 100vh;
      }

      iron-list {
        --iron-list-items-container: {
        };
      }

      :focus {
        outline: none;
      }

      #ironListMobile[debate-disabled] {
        margin-top: 16px;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-yp-update-points-for-post="_loadNewPointsIfNeeded"></lite-signal>

    <iron-media-query query="(min-width: 985px)" query-matches="{{largeMode}}"></iron-media-query>

    <template is="dom-if" if="[[largeMode]]">
      <div class="layout vertical topContainer">
        <div class="main-container">
          <div class="point">
            <template is="dom-if" if="[[!post.Group.configuration.alternativePointForHeader]]">
              <div class="pointMainHeader layout horizontal center-center">
                [[t('pointsFor')]]
              </div>
            </template>

            <template is="dom-if" if="[[post.Group.configuration.alternativePointForHeader]]">
              <div class="pointMainHeader layout horizontal center-center">
                [[post.Group.configuration.alternativePointForHeader]]
              </div>
            </template>

            <paper-material id="pointUpMaterial" elevation="1" class="pointInputMaterial layout vertical" animated="" hidden\$="[[post.Group.configuration.disableDebate]]">

              <paper-textarea id="up_point" on-tap="focusUpPoint" on-focus="focusTextArea" on-blur="blurTextArea" value="{{textValueUp}}" label\$="[[labelUp]]" char-counter="" rows="2" max-rows="3" maxlength="500">
              </paper-textarea>

              <div class="horizontal end-justified layout" hidden\$="[[post.Group.configuration.hideEmoji]]">
                <emoji-selector id="pointUpEmojiSelector"></emoji-selector>
              </div>

              <div hidden="[[!ifLengthUpIsRight]]">
                <div class="addPointFab layout horizontal center-center">
                  <paper-button disabled\$="[[addPointDisabled]]" icon="add" mini="" elevation="3" on-tap="addPointUp" title="[[t('point.add_up')]]">[[t('point.postComment')]]</paper-button>
                </div>
              </div>
            </paper-material>

            <div id="allUpPoints">
              <iron-list items="[[upPoints]]" as="point" scroll-target="document" scroll-offset="550">
                <template>
                  <div class="item" tabindex\$="[[tabIndex]]">
                    <paper-material id="point[[point.id]]" elevation="1" animated="" class="pointMaterial">
                      <yp-point point="[[point]]"></yp-point>
                    </paper-material>
                  </div>
                </template>
              </iron-list>
            </div>
          </div>

          <div class="point">
            <template is="dom-if" if="[[!post.Group.configuration.alternativePointAgainstHeader]]">
              <div class="pointMainHeader layout horizontal center-center">
                [[t('pointsAgainst')]]
              </div>
            </template>

            <template is="dom-if" if="[[post.Group.configuration.alternativePointAgainstHeader]]">
              <div class="pointMainHeader layout horizontal center-center">
                [[post.Group.configuration.alternativePointAgainstHeader]]
              </div>
            </template>


            <paper-material id="pointDownMaterial" elevation="1" class="pointInputMaterial layout vertical" animated="" hidden\$="[[post.Group.configuration.disableDebate]]">

              <paper-textarea id="down_point" on-tap="focusDownPoint" on-focus="focusTextArea" on-blur="blurTextArea" value="{{textValueDown}}" label\$="[[labelDown]]" char-counter="" rows="2" max-rows="5" maxlength="500">
              </paper-textarea>

              <div class="horizontal end-justified layout" hidden\$="[[post.Group.configuration.hideEmoji]]">
                <emoji-selector id="pointDownEmojiSelector"></emoji-selector>
              </div>

              <div hidden="[[!ifLengthDownIsRight]]">
                <div class="addPointFab layout horizontal center-center">
                  <paper-button disabled\$="[[addPointDisabled]]" icon="add" elevation="3" on-tap="addPointDown" title="[[t('point.add_down')]]">[[t('point.postComment')]]</paper-button>
                </div>
              </div>
            </paper-material>

            <div id="allDownPoints">
              <iron-list id="ironListDown" items="[[downPoints]]" as="point" scroll-target="document" scroll-offset="550">
                <template>
                  <div class="item" tabindex\$="[[tabIndex]]">
                    <paper-material id="point[[point.id]]" elevation="1" animated="" class="pointMaterial">
                      <yp-point point="[[point]]"></yp-point>
                    </paper-material>
                  </div>
                </template>
              </iron-list>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template is="dom-if" if="[[!largeMode]]">
      <paper-material id="pointUpOrDownMaterial" elevation="1" class="pointInputMaterial layout vertical" animated="" hidden\$="[[post.Group.configuration.disableDebate]]">
        <paper-textarea id="mobileUpOrDownPoint" class="mobilePaperTextArea" on-tap="focusDownPoint" on-focus="focusTextArea" on-blur="blurTextArea" value="{{textValueMobileUpOrDown}}" label="[[labelMobileUpOrDown]]" char-counter="" rows="2" max-rows="3" maxlength="500"></paper-textarea>
        <div class="horizontal end-justified layout">
          <div class="layout horizontal">
            <paper-radio-group id="upOrDown" attribute-for-selected="name" class="layout horizontal" selected="{{pointUpOrDownSelected}}">
              <paper-radio-button name="pointFor">[[t('pointForShort')]]</paper-radio-button>
              <paper-radio-button name="pointAgainst">[[t('pointAgainstShort')]]</paper-radio-button>
            </paper-radio-group>
          </div>
          <div class="flex"></div>
          <emoji-selector id="pointUpDownEmojiSelector" hidden\$="[[post.Group.configuration.hideEmoji]]"></emoji-selector>
        </div>
        <div hidden="[[!ifLengthMobileRight]]">
          <div class="addPointFab layout horizontal center-center mobileFab">
            <paper-button disabled\$="[[addPointDisabled]]" icon="add" z="3" on-tap="addMobilePointUpOrDown" title="[[t('point.postComment')]]">[[t('point.postComment')]]</paper-button>
          </div>
        </div>
      </paper-material>
      <div class="layout vertical center-center">
        <iron-list id="ironListMobile" debate-disabled\$="[[post.Group.configuration.disableDebate]]" items="[[points]]" as="point" scroll-target="document" scroll-offset="[[mobileScrollOffset]]">
          <template>
            <div class="item" tabindex\$="[[tabIndex]]">
              <paper-material id="point[[point.id]]" elevation="1" animated="" class="pointMaterial">
                <yp-point point="[[point]]"></yp-point>
              </paper-material>
            </div>
          </template>
        </iron-list>
      </div>
    </template>

    <div hidden="" class="layout horizontal center-center">
      <yp-ajax id="ajax" on-response="_response"></yp-ajax>
      <yp-ajax id="newPointsAjax" on-response="_newPointsResponse"></yp-ajax>
      <yp-ajax id="newPointAjax" on-error="_newPointError" method="POST" url="/api/points" on-response="_newPointResponse"></yp-ajax>
    </div>

    <paper-toast id="newPointToast" text="[[newPointTextCombined]]"></paper-toast>
`,

  is: 'yp-post-points',

  behaviors: [
    ypLanguageBehavior,
    ypTruncateBehavior
  ],

  properties: {

    host: String,

    downPoints: {
      type: Array,
      value: []
    },

    upPoints: {
      type: Array,
      value: []
    },

    textValueUp: {
      type: String,
      notify: true,
      value: ""
    },

    textValueDown: {
      type: String,
      notify: true,
      value: ""
    },

    newPointTextCombined: {
      type: String
    },

    post: {
      type: Object,
      observer: "_postChanged"
    },

    points: {
      type: Array,
      value: null,
      observer: '_pointsChanged'
    },

    largeMode: {
      type: Boolean,
      value: false,
      observer: '_updateEmojiBindings'
    },

    textValueMobileUpOrDown: String,

    labelMobileUpOrDown: String,

    labelUp: String,

    labelDown: String,

    pointUpOrDownSelected: {
      type: String,
      observer: '_pointUpOrDownSelectedChanged',
      value: 'pointFor'
    },

    latestPointCreatedAt: {
      type: Date,
      value: null
    },

    scrollToId: {
      type: String,
      value: null,
      observer: '_scrollToIdChanged'
    },

    ironListResizeScrollThreshold: {
      type: Number,
      computed: '_ironListResizeScrollThreshold(largeMode)'
    },

    ironListPaddingTop: {
      type: Number,
      computed: '_ironListPaddingTop(wide)'
    },

    ifLengthUpIsRight: {
      type: Boolean,
      value: false,
      computed: 'ifLengthIsRight(textValueUp)'
    },

    ifLengthDownIsRight: {
      type: Boolean,
      value: false,
      computed: 'ifLengthIsRight(textValueDown)'
    },

    ifLengthMobileRight: {
      type: Boolean,
      value: false,
      computed: 'ifLengthIsRight(textValueMobileUpOrDown)'
    },

    addPointDisabled: {
      type: Boolean,
      value: false
    },

    mobileScrollOffset: {
      type: Number,
      computed: '_mobileScrollOffset(largeMode,post)'
    }
  },

  _mobileScrollOffset: function (large, post) {
    if (!large && post) {
      var element = this.$$("#ironListMobile");
      if (element) {
        return element.getBoundingClientRect().top;
      } else {
        console.error("Can't find mobile list element");
      }
    }
  },

  _newPointError: function () {
    this.set('addPointDisabled', false);
  },

  _ironListResizeScrollThreshold: function (largeMode) {
    if (largeMode) {
      return 300;
    } else {
      return 300;
    }
  },

  _ironListPaddingTop: function (largeMode) {
    if (largeMode) {
      return 600;
    } else {
      return 500;
    }
  },

  listeners: {
    'yp-point-deleted': '_pointDeleted'
  },

  observers: [
    '_setupPointTextStartState(pointUpOrDownSelected, post)'
  ],

  _setupPointTextStartState: function(pointUpOrDownSelected, post) {
    if (post) {
      this._pointUpOrDownSelectedChanged(pointUpOrDownSelected)
    }
  },

  _loadNewPointsIfNeeded: function (event, detail) {
    if (this.post && this.post.id == detail.postId) {
      if (this.latestPointCreatedAt) {
        this.$.newPointsAjax.url = '/api/posts/' + this.post.id + '/newPoints';
        this.$.newPointsAjax.params = { latestPointCreatedAt: this.latestPointCreatedAt };
        this.$.newPointsAjax.generateRequest();
      } else {
        console.error("Trying to send point without latestPointCreatedAt");
      }
    }
  },

  _newPointsResponse: function (event, detail) {
    var points = this._preProcessPoints(detail.response);
    points.forEach(function (point) {
      this._insertNewPoint(point);
    }.bind(this));

    this._updateCounterInfo();
  },

  _pointDeleted: function () {
    this.$.ajax.generateRequest();
  },

  _pointsChanged: function (points) {
    if (points) {
      this._updateEmojiBindings();
    }
  },

  _updateEmojiBindings: function () {
    this.async(function () {
      if (this.largeMode) {
        var upPoint = this.$$("#up_point");
        var downPoint = this.$$("#down_point");
        var upEmoji = this.$$("#pointUpEmojiSelector");
        var downEmoji = this.$$("#pointDownEmojiSelector");
        if (upPoint && downPoint && upEmoji && downEmoji) {
          upEmoji.inputTarget = upPoint;
          downEmoji.inputTarget = downPoint;
        } else {
          console.warn("Wide: Can't bind emojis :(");
        }
      } else {
        var upDownPoint = this.$$("#mobileUpOrDownPoint");
        var upDownEmoji = this.$$("#pointUpDownEmojiSelector");
        if (upDownPoint && upDownEmoji) {
          upDownEmoji.inputTarget = upDownPoint;
        } else {
          console.warn("Small: Can't bind emojis :(");
        }
      }
    }.bind(this), 500);
  },

  _pointUpOrDownSelectedChanged: function (newValue) {
    if (newValue=='pointFor') {
      if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.alternativePointForLabel) {
        this.set('labelMobileUpOrDown', this.post.Group.configuration.alternativePointForLabel);
      } else {
        this.set('labelMobileUpOrDown', this.t('point.for'));
      }
    } else if (newValue=='pointAgainst') {
      if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.alternativePointAgainstLabel) {
        this.set('labelMobileUpOrDown', this.post.Group.configuration.alternativePointAgainstLabel);
      } else {
        this.set('labelMobileUpOrDown', this.t('point.against'));
      }
    }
  },

  _postChanged: function (newPost) {
    // Remove any manually inserted points when the list is updated
    this.set('points', null);
    this.set('upPoints', null);
    this.set('downPoints', null);
    this.set('latestPointCreatedAt', null);
    if (newPost) {
      if (this.host) {
        this.$.ajax.url = this.host+'/api/posts/' + newPost.id + '/points';
      } else {
        this.$.ajax.url = '/api/posts/' + newPost.id + '/points';
      }
      this.$.ajax.generateRequest();
      if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.alternativePointForLabel) {
        this.set('labelUp', this.post.Group.configuration.alternativePointForLabel);
      } else {
        this.set('labelUp', this.t('point.for'));
      }
      if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.alternativePointAgainstLabel) {
        this.set('labelDown', this.post.Group.configuration.alternativePointAgainstLabel);
      } else {
        this.set('labelDown', this.t('point.against'));
      }
    }
  },

  removeElementsByClass: function (rootElement, className) {
    var elements = rootElement.getElementsByClassName(className);
    while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
    }
  },

  _response: function (event, detail) {
    var points = this._preProcessPoints(detail.response);
    this.removeElementsByClass(this, 'inserted-outside-list');

    if (points.length > 0) {
      var upPoints = [];
      var downPoints = [];

      for (var i = 0; i < points.length; i++) {
        if (points[i].value>0) {
          upPoints.push(points[i]);
        } else if (points[i].value<0) {
          downPoints.push(points[i]);
        }
      }
      this.set('upPoints', upPoints);
      this.set('downPoints', downPoints);
    } else {
      this.set('upPoints', []);
      this.set('downPoints', []);
      this.set('points', []);
    }

    if (!this.largeMode) {
      this.set('points', this.interleaveArrays(this.upPoints, this.downPoints));
    }

    this._updateCounterInfo();
    this._scrollPointIntoView();
  },

  _scrollToIdChanged: function (id) {
    if (id) {
      this._scrollPointIntoView();
    }
  },

  interleaveArrays: function (arrayA, arrayB) {
    var arrs = [arrayA, arrayB];
    var maxLength = Math.max.apply(Math, arrs.map(function (arr) {
      return arr.length
    }));

    var result = [];

    for (var i = 0; i < maxLength; ++i) {
      arrs.forEach(function (arr) {
        if (arr.length > i) {
          result.push(arr[i])
        }
      })
    }

    return result
  },

  _scrollPointIntoView: function () {
    //TODO: Find out why this does not work when you are not logged in
    if (this.points && this.points.length > 0 && this.scrollToId) {
      this.async(function () {
        var point = this.$$("#point"+this.scrollToId);
        console.log("Looking for point");
        if (point) {
          console.log("Scrolling to point");
          point.scrollIntoView();
          this.set('scrollToId', null);
          point.elevation = 5;
          this.async(function () {
            point.elevation = 1;
          }.bind(this), 10000);
        }
      }.bind(this), 200);
    }
  },

  _preProcessPoints: function (points) {
    for (var i = 0; i < points.length; i++) {
      if (!this.latestPointCreatedAt || (!this.latestPointCreatedAt || points[i].created_at > this.latestPointCreatedAt)) {
        this.set('latestPointCreatedAt', points[i].created_at);
      }
      points[i].latestContent = points[i].PointRevisions[points[i].PointRevisions.length-1].content;
    }
    return points;
  },

  _updateCounterInfo: function () {
    if (this.largeMode) {
      this.fire('yp-debate-info', {
        count: this.upPoints.length + this.downPoints.length,
        firstPoint: this.upPoints[0]
      });
    } else {
      this.fire('yp-debate-info', {
        count: this.points.length,
        firstPoint: this.points[0]
      });
    }
  },

  _insertNewPoint: function (point) {
    if (this.largeMode) {
      if (point.value > 0) {
        this.unshift('upPoints', point);
      } else if (point.value < 0) {
        this.unshift('downPoints', point);
      }
    } else {
      this.unshift('points', point);
    }
  },

  _newPointResponse: function (event, detail) {
    this.set('addPointDisabled', false);
    var point = this._preProcessPoints([detail.response])[0];
    if (point.value > 0) {
      this.newPointTextCombined = this.t("point.forAdded") + " " + this.truncate(point.content, 21);
      this.set("textValueUp", "");
    } else {
      this.newPointTextCombined = this.t("point.againstAdded") + " " + this.truncate(point.content, 21);
      this.set("textValueDown", "");
    }
    this.set("textValueMobileUpOrDown", "");
    this._insertNewPoint(point);
    this.set('post.counter_points', this.post.counter_points + 1);
    this.$.newPointToast.show();
    this._updateCounterInfo();
    if (point.value > 0) {
      window.appGlobals.activity('completed', 'newPointFor');
    } else {
      window.appGlobals.activity('completed', 'newPointAgainst');
    }
  },

  addPointUp: function () {
    this.addPoint(this.textValueUp, 1);
    window.appGlobals.activity('add', 'pointUp');
  },

  addPointDown: function () {
    this.addPoint(this.textValueDown, -1);
    window.appGlobals.activity('add', 'pointDown');
  },

  addMobilePointUpOrDown: function () {
    if (this.pointUpOrDownSelected=='pointFor') {
      this.addPoint(this.textValueMobileUpOrDown, 1);
      window.appGlobals.activity('add', 'pointUp');
    } else if (this.pointUpOrDownSelected=='pointAgainst') {
      this.addPoint(this.textValueMobileUpOrDown, -1);
      window.appGlobals.activity('add', 'pointDown');
    }
  },

  addPoint: function (content, value) {
    if (window.appUser.loggedIn() === true) {
      this.$.newPointAjax.url = "/api/points/" + this.post.group_id;
      this.$.newPointAjax.body = {
        postId: this.post.id,
        content: content,
        value: value
      };
      this.$.newPointAjax.generateRequest();
      this.set('addPointDisabled', true);
    } else {
      window.appUser.loginForNewPoint(this, {content: content, value: value});
    }
  },

  focusUpPoint: function () {
    window.appGlobals.activity('focus', 'pointUp');
  },

  focusDownPoint: function () {
    window.appGlobals.activity('focus', 'pointDown');
  },

  focusTextArea: function (event) {
    event.currentTarget.parentElement.elevation = 3;
  },

  blurTextArea: function (event) {
    event.currentTarget.parentElement.elevation = 1;
  },

  ifLengthIsRight: function (textValue) {
    return textValue.length > 1;
  }
});
