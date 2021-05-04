<link rel="import" href="../../bower_components/polymer/polymer.html">

<link rel="import" href="../../bower_components/iron-flex-layout/iron-flex-layout-classes.html">
<link rel="import" href="../../bower_components/iron-image/iron-image.html" >
<link rel="import" href="../../bower_components/lite-signal/lite-signal.html">

<link rel="import" href="../yp-app-globals/yp-app-icons.html">
<link rel="import" href="../yp-behaviors/yp-language-behavior.html">
<link rel="import" href="../yp-behaviors/access-helpers.html">
<link rel="import" href="../yp-behaviors/yp-got-admin-rights-behavior.html">
<link rel="import" href="../yp-behaviors/yp-logged-in-user-behavior.html">
<link rel="import" href="../yp-behaviors/yp-media-formats-behavior.html">
<link rel="import" href="../yp-behaviors/yp-truncate-behavior.html">
<link rel="import" href="../yp-behaviors/yp-goto-behavior.html">
<link rel="import" href="../yp-magic-text/yp-magic-text.html">
<link rel="import" href="../yp-rating/yp-post-ratings-info.html">

<link rel="import" href="yp-post-actions.html">
<link rel="import" href="yp-post-cover-media.html">
<link rel="import" href="yp-post-behaviors.html">
<link rel="import" href="yp-post-survey-translation-behaviors.html">

<dom-module id="yp-post-tags">
  <template>
    <style include="iron-flex iron-flex-alignment">
      .tagContainer {
        max-width: 480px;
        font-size: 14px;
        margin-left: 8px;
        vertical-align: middle;
        padding-left: 16px;
        color: var(--app-tags-text-color, #111) !important;
        font-weight: var(--app-tags-font-weight, 500);
      }

      .middleDot {
        padding-left: 7px;
        padding-right: 2px;
        vertical-align: middle;
        color: var(--app-tags-color, #656565);
      }

      .tagItem {
          vertical-align: middle;
      }

      @media (max-width: 800px) {
        .middleDot {
          font-size: 14px;
          margin-bottom: 8px;
        }

        .tagContainer {
          font-size: 17px;
          padding-left: 16px;
          padding-right: 16px;
          padding-bottom: 16px;
        }
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-yp-auto-translate="_autoTranslateEvent"></lite-signal>

    <div class="tagContainer wrap">
      <template is="dom-repeat" items="[[postTags]]">
        <span class="tagItem">[[_trimmedItem(item)]]</span><span class="middleDot" hidden$="[[computeSpanHidden(postTags, index)]]">&#9679;</span>
      </template>
    </div>

    <yp-magic-text id="postTagsTranslations" hidden
                   content-id="[[post.id]]"
                   text-only
                   content="[[post.public_data.tags]]"
                   content-language="[[post.language]]"
                   on-new-translation="_newTranslation"
                   text-type="postTags"></yp-magic-text>
  </template>

  <script>
    Polymer({
      is: 'yp-post-tags',

      behaviors: [
        Polymer.ypLanguageBehavior
      ],

      properties: {
        post: {
          type: Object
        },

        postTags: {
          type: String,
          computed: '_postTags(post,language,translatedTags,autoTranslate)'
        },

        translatedTags: {
          type: String,
          value: null
        },

        autoTranslate: {
          type: Boolean,
          value: false
        }
      },

      _trimmedItem: function (item) {
        if (item) {
          return item.trim();
        } else {
          return "";
        }
      },

      _autoTranslateEvent(event, detail) {
        this.set('autoTranslate', detail);
      },

      computeSpanHidden: function(items,index){
        return (items.length - 1) === index
      },

      _newTranslation: function () {
        this.async(function () {
          var tagsTranslation = this.$$("#postTagsTranslations");
          if (tagsTranslation && tagsTranslation.finalContent) {
            this.set('translatedTags', tagsTranslation.finalContent);
          }
        });
      },

      _postTags: function (post, language, translatedTags) {
        if (translatedTags && this.autoTranslate) {
          return translatedTags.split(",");
        } else if (post && post.public_data && post.public_data.tags) {
          return post.public_data.tags.split(",")
        } else {
          return [];
        }
      }
    });
  </script>
</dom-module>
