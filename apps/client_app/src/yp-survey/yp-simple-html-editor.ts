<link rel="import" href="../../bower_components/polymer/polymer-element.html">
<link rel="import" href="../../bower_components/paper-icon-button/paper-icon-button.html">
<link rel="import" href="../yp-behaviors/yp-language-behavior.html">

<dom-module id="yp-simple-html-editor">
  <template>
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: inline-block;
        margin-top: 8px;
        width: 100%;
      }

      #htmlEditor {
        width: 100%;
        height: 300px;
        border-top: 1px solid #cccccc;
        border-bottom: 1px solid #888888;
        outline: none;
        overflow: auto;
        padding-top: 8px;
        padding-bottom: 8px;
        transition: border-bottom-color 0.1s;
      }

      #htmlEditor:focus {
        border-bottom: 2px solid var(--accent-color);
      }

      #htmlEditor[has-error] {
          border-bottom: 2px solid #dd2c00 !important;
      }

      .characterCounter {
        color: #212121;
        font-size: 12px;
        text-align: right;
        width: 100%;
        transition: color 0.1s;
        margin-top: 1px;
      }

      .characterCounter[has-focus] {
        color: var(--accent-color);
        margin-top: 0px;
      }

      .characterCounter[has-error] {
          color: #dd2c00 !important;
      }

      @media (max-width: 800px) {
        #htmlEditor {
            height: 220px;
        }
      }
    </style>
    <div class="layout horizontal wrap">
      <div class="layout horizontal">
        <paper-icon-button aria-label$="[[t('formatBold')]]" icon="format-bold"  on-mousedown="_toggleBoldM" on-tap="_toggleBold"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatItalic')]]" icon="format-italic" on-mousedown="_toggleItalicM" on-tap="_toggleItalic"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatUnderline')]]" icon="format-underlined" on-mousedown="_toggleUnderlineM" on-tap="_toggleUnderline"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatListBullets')]]" icon="format-list-bulleted" on-mousedown="_toggleListBulletsM" on-tap="_toggleListBullets"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatListNumbered')]]" icon="format-list-numbered" on-mousedown="_toggleListNumbersM" on-tap="_toggleListNumbers"></paper-icon-button>
      </div>
      <div class="layout horizontal">
        <paper-icon-button aria-label$="[[t('formatLeft')]]" icon="format-align-left" on-mousedown="_toggleAlignLeftM" on-tap="_toggleAlignLeft"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatCenter')]]" icon="format-align-center" on-mousedown="_toggleAlignCenterM" on-tap="_toggleAlignCenter"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatRight')]]" icon="format-align-right" on-mousedown="_toggleAlignRightM" on-tap="_toggleAlignRight"></paper-icon-button>
     </div>

      <div class="layout horizontal">
        <paper-icon-button aria-label$="[[t('formatH1')]]" icon="format-header-1" on-mousedown="_toggleH1M" on-tap="_toggleH1"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatH2')]]" icon="format-header-2" on-mousedown="_toggleH2M" on-tap="_toggleH2"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatH3')]]" icon="format-header-3" on-mousedown="_toggleH3M" on-tap="_toggleH3"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatH4')]]" icon="format-header-4" on-mousedown="_toggleH4M" on-tap="_toggleH4"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatH5')]]" icon="format-header-5" on-mousedown="_toggleH5M" on-tap="_toggleH5"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatH6')]]" icon="format-header-6" on-mousedown="_toggleH6M" on-tap="_toggleH6"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatP')]]" icon="format-paragraph" on-mousedown="_toggleHPM" on-tap="_toggleP"></paper-icon-button>
        <paper-icon-button aria-label$="[[t('formatClear')]]" icon="format-clear" on-mousedown="_clearFormatM" on-tap="_clearFormat"></paper-icon-button>
      </div>
    </div>
    <div id="htmlEditor" has-error$="[[showErrorLine]]" on-focus="_setFocus" on-blur="_setBlur" contenteditable="true" spellcheck="false" on-keydown="_keydown" on-paste="_paste" on-click="_changed" on-keyup="_changed" on-changed="_changed"></div>
    <div has-focus$="[[hasFocus]]" has-error$="[[showErrorLine]]" class="layout end characterCounter">[[characterCount]]<span hidden$="[[!question.maxLength]]">/[[question.maxLength]]</span></div>
  </template>
  <script>

    class YpSimpleHtmlEditor extends Polymer.Element {
      static get is() {
        return 'yp-simple-html-editor';
      }

      static get properties() {
        return {
          question: {
            type: Object
          },

          index: {
            type: Number
          },

          language: {
            type: String,
          },

          useSmallFont: {
            type: Boolean,
            value: false
          },

          value: {
            type: String,
            value: ""
          },

          characterCount: {
            type: Number,
            value: 0
          },

          hasFocus: {
            type: Boolean,
            value: false
          },

          allowFirefoxFocusHack: {
            type: Boolean,
            value: true
          },

          showErrorLine: {
            type: Boolean,
            value: false
          }
        }
      }

      _setFocus() {
        this.set('hasFocus', true);

        if (this._isFirefox() && this.allowFirefoxFocusHack) {
          setTimeout(function() {
            this.allowFirefoxFocusHack = false;
            this.shadowRoot.querySelector("#htmlEditor").blur();
            this.shadowRoot.querySelector("#htmlEditor").focus();
            setTimeout(function () {
              this.allowFirefoxFocusHack = true;
            }.bind(this), 150);
          }.bind(this));
        }
      }

      _setBlur(event) {
        //TODO: Fix blinking on using the icon buttons
        this.set('hasFocus', false);
      }

      setRichValue(value) {
        this.set('value', value);
        this.shadowRoot.querySelector("#htmlEditor").innerHTML = this.value;
      }

      _updateCharacterCounter() {
        var textContent = this.shadowRoot.querySelector("#htmlEditor").textContent;

        if (textContent) {
          this.set('characterCount', textContent.length);
        } else {
          this.set('characterCount', 0);
        }
      }

      _keydown(event) {
        this._updateCharacterCounter();
        this.set('showErrorLine', false);

        if (this.question.maxLength) {
          var allowedKeyCodes = [8, 37, 38, 39, 40];
          var allowedKeyCodesWithCtrlKey = [65, 90, 86, 67, 88, 8];
          var isAllowedKey = allowedKeyCodes.includes(event.keyCode);
          var isShortcut = event.ctrlKey && allowedKeyCodesWithCtrlKey.includes(event.keyCode);
          var isAllowedAction = isAllowedKey || isShortcut;

          if (isAllowedAction) {
            return
          }

          if (this.characterCount>=this.question.maxLength) {
            event.preventDefault();
          }
        }
      }

      _paste(event) {
        if (this.question.maxLength) {
          var clipboardData = event.clipboardData || window.clipboardData;
          var pastedText = clipboardData.getData('text/plain');
          var content = event.target.textContent;
          var contentLength = content.length;
          var selectedText = window.getSelection().toString();
          const allowedPasteLength = this.question.maxLength - contentLength + selectedText.length;
          const slicedPasteText = pastedText.substring(0, allowedPasteLength);

          event.preventDefault();

          this._masterCommand('insertHTML', false, slicedPasteText);
        }

        setTimeout(function() {
          this._updateCharacterCounter();
        }.bind(this));
      }

      _changed() {
        this.set('value', this.shadowRoot.querySelector("#htmlEditor").innerHTML);
        this._updateCharacterCounter();
      }

      validate() {
        if (this.question.required) {
          if (this.value && this.value.length>0) {
            this.set('showErrorLine', false);
            return true;
          } else {
            this.set('showErrorLine', true);
            return false;
          }
        } else {
          this.set('showErrorLine', false);
          return true;
        }
      }

      _isSafariOrIe11() {
        return (navigator.userAgent.indexOf("Safari") > -1 &&
          navigator.userAgent.indexOf('Chrome') === -1 &&
          navigator.userAgent.indexOf('iPhone') === -1 &&
          navigator.userAgent.indexOf('iPad') === -1) ||
          /Trident.*rv[ :]*11\./.test(navigator.userAgent)
      }

      _isFirefox() {
        return navigator.userAgent.indexOf("Firefox") > -1;
      }

      _clearFormat() {
        this._masterCommand('removeFormat');
        this._masterCommand('formatBlock', false, 'p');
      }

      _clearFormatM() {
        if (this._isSafariOrIe11()) this._clearFormat();
      }

      _toggleH1() {
        this._masterCommand('formatBlock',false,'h1');
      }

      _toggleH1M() {
        if (this._isSafariOrIe11()) this._toggleH1();
      }

      _toggleH2() {
        this._masterCommand('formatBlock',false,'h2');
      }

      _toggleH2M() {
        if (this._isSafariOrIe11()) this._toggleH2();
      }

      _toggleH3() {
        this._masterCommand('formatBlock',false,'h3');
      }

      _toggleH3M() {
        if (this._isSafariOrIe11()) this._toggleH3();
      }

      _toggleH4() {
        this._masterCommand('formatBlock',false,'h4');
      }

      _toggleH4M() {
        if (this._isSafariOrIe11()) this._toggleH4();
      }

      _toggleH5() {
        this._masterCommand('formatBlock',false,'h5');
      }

      _toggleH5M() {
        if (this._isSafariOrIe11()) this._toggleH5();
      }

      _toggleH6() {
        this._masterCommand('formatBlock',false,'h6');
      }

      _toggleH6M() {
        if (this._isSafariOrIe11()) this._toggleH6();
      }

      _toggleP() {
        this._masterCommand('formatBlock',false,'p');
      }

      _togglePM() {
        if (this._isSafariOrIe11()) this._toggleP();
      }

      _toggleAlignLeft() {
        this._masterCommand("JustifyLeft", false, "");
      }

      _toggleAlignLeftM() {
        if (this._isSafariOrIe11()) this._toggleAlignLeft();
      }

      _toggleAlignRight() {
        this._masterCommand("JustifyRight", false, "");
      }

      _toggleAlignRightM() {
        if (this._isSafariOrIe11()) this._toggleAlignRight();
      }

      _toggleAlignCenter() {
        this._masterCommand("JustifyCenter", false, "");
      }

      _toggleAlignCenterM() {
        if (this._isSafariOrIe11()) this._toggleAlignCenter();
      }

      _toggleAlignJustify() {
        this._masterCommand("JustifyFull", false, "");
      }

      _toggleAlignJustifyM() {
        if (this._isSafariOrIe11()) this._toggleAlignJustify();
      }

      _toggleBold() {
        this._masterCommand('bold');
      }

      _toggleBoldM() {
        if (this._isSafariOrIe11()) this._toggleBold();
      }

      _toggleItalic() {
        this._masterCommand('italic');
      }

      _toggleItalicM() {
        if (this._isSafariOrIe11()) this._toggleItalic();
      }

      _toggleUnderline() {
        this._masterCommand('underline');
      }

      _toggleUnderlineM() {
        if (this._isSafariOrIe11()) this._toggleUnderline();
      }

      _toggleListBullets() {
        this._masterCommand('insertUnorderedList');
      }

      _toggleListBulletsM() {
        if (this._isSafariOrIe11()) this._toggleListBullets();
      }

      _toggleListNumbers() {
        this._masterCommand('insertOrderedList');
      }

      _toggleListNumbersM() {
        if (this._isSafariOrIe11()) this._toggleListNumbers();
      }

      _masterCommand(commandName, showDefaultUI, value) {
        document.execCommand(commandName, showDefaultUI, value);
        this._changed();
      }

      ready() {
        if (window.i18nTranslation) {
          this.set('language', window.locale);
        }

        super.ready();
      }
    }

    customElements.define(YpSimpleHtmlEditor.is, YpSimpleHtmlEditor);
  </script>
</dom-module>
