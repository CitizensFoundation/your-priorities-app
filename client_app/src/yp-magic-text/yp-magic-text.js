import { Element } from '../../../../@polymer/polymer/polymer-element.js';
import '../../../../@polymer/iron-ajax/iron-ajax.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../yp-behaviors/yp-language-behavior.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
import '../../../../twemoji-min/2/twemoji.min.js';
import './sanitize-html.min.js';
import '../../../../linkifyjs/linkify.js';
import '../../../../linkifyjs/linkify-string.js';

class YpMagicTextBox extends Element {
  static get template() {
    return `
    <style>
      :host {
        display: block;
      }

      .container[more-text] {
        @apply --layout-vertical;
        @apply --layout-center-center;
      }

      .moreText {
        color: var(--accent-color);
        background-color: #FFF;
        margin-top: 6px;
        margin-bottom: 6px;
        position: absolute;
        bottom: 6px;
        left: 466px;
      }

      @media (max-width: 600px) {
        .moreText {
          position: initial;
        }
      }
    </style>
    <div class="container" more-text\$="[[showMoreText]]">
      <div hidden\$="[[!finalContent]]" inner-h-t-m-l="[[finalContent]]"></div>
      <div hidden\$="[[finalContent]]">[[content]]</div>
      <template is="dom-if" if="[[showMoreText]]">
        <paper-button raised="" class="moreText" on-tap="_openFullScreen">[[moreText]]</paper-button>
      </template>
    </div>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-yp-auto-translate="_autoTranslateEvent"></lite-signal>

    <iron-ajax id="getTranslationAjax" on-response="_getTranslationResponse"></iron-ajax>
`;
  }

  static get is() { return 'yp-magic-text'; }

  static get properties() {
    return {

      content: {
        type: String,
        observer: '_contentChanged'
      },

      contentId: String,

      extraId: String,

      textType: {
        type: String
      },

      contentLanguage: {
        type: String
      },

      processedContent: {
        type: String,
        value: null
      },

      finalContent: {
        type: String,
        value: null
      },

      autoTranslate: {
        type: Boolean,
        value: false
      },

      language: {
        type: String,
        value: null
      },

      truncate: {
        type: Number,
        value: null
      },

      moreText: String,

      showMoreText: {
        type: Boolean,
        computed: '_showMoreText(moreText,content)'
      },

      closeDialogText: {
        type: String
      },

      textOnly: {
        type: Boolean,
        value: false
      },

      disableTranslation: {
        type: Boolean,
        value: false
      },

      simpleFormat: {
        type: Boolean,
        value: false
      }
    }
  }

  static get doubleWidthLanguages() {
    return ['zh_TW']
  }

  _showMoreText(moreText, content) {
    return moreText && content && content.length>500;
  }

  _openFullScreen() {
    dom(document).querySelector('yp-app').getDialogAsync("magicTextDialog", function (dialog) {
      dialog.open(this.content, this.contentId, this.extraId, this.textType, this.contentLanguage, this.closeDialogText);
    }.bind(this));
  }

  subClassProcessing() {
  }

  _contentChanged(newValue) {
    //console.info("Content changed: "+newValue);
    if (newValue && newValue!=="") {
      this.set('finalContent', null);
      if (window.autoTranslate) {
        this.set('autoTranslate', window.autoTranslate);
      }
      this._update();
    }
  }

  _autoTranslateEvent(event, detail) {
    this.set('autoTranslate', detail);
    this._update();
  }

  _languageEvent (event, detail) {
    if (detail.type === 'language-loaded') {
      this.set('language', detail.language);
      this._update();
    }
  }

  _getIndexKey() {
    return `${this.textType}-${this.contentId}-${this.language}`;
  }

  _startTranslationAndFinalize () {
    let indexKey = this._getIndexKey();
    if (window.appGlobals.autoTranslateCache[indexKey]) {
      //console.warn("Using cache: "+window.appGlobals.autoTranslateCache[indexKey]);
      this.set('processedContent', window.appGlobals.autoTranslateCache[indexKey]);
      this._finalize();
    } else {
      this.$.getTranslationAjax.params = {
        textType: this.textType,
        contentId: this.contentId,
        targetLanguage: this.language
      };
      switch(this.textType) {
        case 'postName':
        case 'postContent':
          this.$.getTranslationAjax.url = "/api/posts/"+this.contentId+"/translatedText";
          break;
        case 'pointContent':
          this.$.getTranslationAjax.url = "/api/points/"+this.contentId+"/translatedText";
          break;
        case 'domainName':
        case 'domainContent':
          this.$.getTranslationAjax.url = "/api/domains/"+this.contentId+"/translatedText";
          break;
        case 'communityName':
        case 'communityContent':
          this.$.getTranslationAjax.url = "/api/communities/"+this.contentId+"/translatedText";
          break;
        case 'groupName':
        case 'groupContent':
          this.$.getTranslationAjax.url = "/api/groups/"+this.contentId+"/translatedText";
          break;
        case 'categoryName':
          this.$.getTranslationAjax.url = "/api/categories/"+this.contentId+"/translatedText";
          break;
        case 'statusChangeContent':
          this.$.getTranslationAjax.url = "/api/posts/"+this.extraId+"/"+this.contentId+"/translatedStatusText";
          break;
        default:
          console.error("No valid textType for magic text to translate: "+this.textType);
          return;
      }
      if (this.contentId) {
        this.$.getTranslationAjax.generateRequest();
      } else {
        console.error("No content id for: "+this.textType);
        this._finalize();
      }
    }
  }

  _getTranslationResponse(event, detail) {
    if (detail.response.content) {
      this.processedContent = detail.response.content;
      window.appGlobals.autoTranslateCache[this._getIndexKey()] = this.processedContent;
    } else {
      console.error("No content for magic text");
    }
    this._finalize();
  }

  _update() {
    this.processedContent = this.content;
    if (this.processedContent) {
      if (this.autoTranslate && this.language!==this.contentLanguage  && !this.disableTranslation) {
        this._startTranslationAndFinalize();
      } else {
        this._finalize();
      }
    }
  }

  _finalize() {
    if (!this.textOnly) {
      this._linksAndEmojis()
    }

    if (this.simpleFormat) {
      this.processedContent = this.processedContent.replace(/(\r\n)/g,"<br>");
    }

    if (this.truncate && this.content && (this.content.length>this.truncate || this.autoTranslate)) {
      let truncateBy = this.truncate;
      if (this.autoTranslate && YpMagicTextBox.doubleWidthLanguages.indexOf(this.language) > -1) {
        truncateBy = truncateBy / 2;
      }
      this.processedContent = YpMagicTextBox.truncate(YpMagicTextBox.trim(this.processedContent), truncateBy, '...');
    }

    this.subClassProcessing();

    if (this.processedContent!==this.finalContent) {
      if (!window.magicTextIronResizeDebouncer) {
        window.magicTextIronResizeDebouncer = setTimeout(function () {
          window.magicTextIronResizeDebouncer = null;
          this.dispatchEvent(new CustomEvent('iron-resize', { bubbles: true, composed: true }));
        }.bind(this), 100);
      }
    }

    if (this.processedContent && this.processedContent!=="undefined" && this.content!==this.processedContent) {
      this.set('finalContent', this.processedContent);
    } else {
      this.set('finalContent', null);
    }
  }

  _linksAndEmojis () {
    this.processedContent = sanitizeHtml(this.processedContent, { allowedTags: [ 'b', 'i', 'em', 'strong'] });
    this.processedContent = this.processedContent.replace(/&amp\;/g, "&");
    this.processedContent = linkifyStr(this.processedContent, {
      format: function (value, type) {
        if (type === 'url' && value.length > 34) {
          value = value.slice(0, 35) + '…';
        }
        return value;
      },
      ignoreTags: [
        'b',
        'i',
        'em',
        'strong'
      ]
    });
    this.processedContent = this.processedContent.replace(/&amp\;/g, "&");
    this.processedContent = twemoji.parse(this.processedContent).
    replace(/&amp\;quot\;/g,"\"").
    replace(/class=\"emoji\" /g,'style="height: 1em;width: 1em;margin: 0 .3em 0 .3em;vertical-align: -0.1em;" ');
  }

  static truncate(input, length, killwords, end) {
    length = length || 255;

    if (input.length <= length)
      return input;

    if (killwords) {
      input = input.substring(0, length);
    } else {
      let idx = input.lastIndexOf(' ', length);
      if (idx === -1) {
        idx = length;
      }

      input = input.substring(0, idx);
    }

    input += (end !== undefined && end !== null) ? end : '...';
    return input;
  }

  static trim(input){
    return input.replace(/^\s*|\s*$/g, '');
  }

  ready () {
    if (window.i18nTranslation) {
      this.set('language', window.locale);
    }
    super.ready();
  }
}

customElements.define(YpMagicTextBox.is, YpMagicTextBox);
