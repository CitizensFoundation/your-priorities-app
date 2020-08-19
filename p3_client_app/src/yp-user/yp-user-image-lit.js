import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpUserImageLit extends YpBaseElement {
  static get properties() {
    return {
      small: {
        type: Boolean,
        value: false
      },

      large: {
        type: Boolean,
        value: false
      },

      veryLarge: {
        type: Boolean,
        value: false
      },

      titleFromUser: {
        type: String
      },

      userTitle: {
        type: String,
        computed: '_computeUserTitle(user, title)'
      },

      user: {
        type: Object
      },

      profileImageUrl: {
        type: String,
        computed: '_profileImageUrl(user)'
      },

      noDefault: {
        type: Boolean,
        value: false
      },

      computeFacebookSrc: {
        type: String,
        computed: '_computeFacebookSrc(user)'
      },

      noProfileImage: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return [
      css`

      iron-image {
        display: block;
        vertical-align: text-top;
        height: 48px;
        width: 48px;
      }

      .small {
        height: 30px;
        width: 30px;
        background-color: var(--primary-color-lighter,#434343);
      }

      .large {
        height: 90px;
        width: 90px;
        background-color: var(--primary-color-lighter,#434343);
      }

      .veryLarge {
        height: 200px;
        width: 200px;
        background-color: var(--primary-color-lighter,#434343);
      }

      .medium {
        height: 48px;
        width: 48px;
        background-color: var(--primary-color-lighter,#434343);
      }

      .rounded {
        -webkit-border-radius: 25px;
        -moz-border-radius: 25px;
        border-radius: 25px;
        display: block;
        -webkit-transform-style: preserve-3d;
      }

      .rounded-more {
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        border-radius: 50px;
        display: block;
        vertical-align: top;
        align: top;
        -webkit-transform-style: preserve-3d;
      }

      .rounded-even-more {
        -webkit-border-radius: 115px;
        -moz-border-radius: 125px;
        border-radius: 125px;
        display: block;
        vertical-align: top;
        align: top;
        -webkit-transform-style: preserve-3d;
      }

      .rounded img { opacity: 0; }

      .rounded-more img { opacity: 0; }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`

    ${ this.user ? html`

      ${this.profileImageUrl ? html`
        <iron-image .sizing="cover" alt="${this.userTitle}" title="${this.userTitle}" .preload src="${this.profileImageUrl}" class="${this.computeClass(small)}"></iron-image>
      ` : html``}

      ${ this.noProfileImage ? html`

        ${this.user.facebook_id ? html`
          <iron-image .sizing="cover" ?hidden="${this.profileImageUrl}" alt="${this.userTitle}" title="${this.userTitle}" .preload="" src="${this.computeFacebookSrc}" class="${this.computeClass(small)}"></iron-image>
        ` : html``}

        ${!this.noDefault ? html`

          ${this.user.facebook_id ? html`
            <iron-image .sizing="cover" title="${this.userTitle}" alt="${this.userTitle}" preload src="https://s3.amazonaws.com/better-reykjavik-paperclip-production/instances/buddy_icons/000/000/001/icon_50/default_profile.png" class="${this.computeClass(small)}"></iron-image>
          ` : html``}
        ` : html``}

      ` : html``}

    ` : html``}
    `
  }

/*
  behaviors: [
    ypMediaFormatsBehavior
  ],
*/

  _computeUserTitle(user, titleFromUser) {
    if (user) {
      if (titleFromUser) {
        return titleFromUser;
      } else {
        return user.name;
      }
    } else {
      return "";
    }
  }

  _profileImageUrl(user) {
    if (user && user.UserProfileImages && user.UserProfileImages.length > 0) {
      const formatUrl = this.getImageFormatUrl(user.UserProfileImages, 0);
      if (formatUrl && formatUrl!=="") {
        this.noProfileImage = false;
        return formatUrl;
      } else {
        this.noProfileImage = true;
        return null;
      }
    } else {
      this.noProfileImage = true;
      return null;
    }
  }

  computeIf(user) {
    return false && !user.facebook_id && user.buddy_icon_file_name;
  }

  computeClass(small) {
    if (this.small)
      return 'small rounded';
    else if (this.large)
      return 'large rounded-more';
    else if (this.veryLarge)
      return 'veryLarge rounded-even-more';
    else
      return 'medium rounded';
  }

  _computeFacebookSrc(user) {
    if (user && user.facebook_id) {
      return 'https://graph.facebook.com/' + user.facebook_id + '/picture';
    } else {
      return null;
    }
  }

  usePlaceHolderImage(user) {
    (this.profileImageUrl==null && user.facebook_id==null)
  }

  connectedCallback() {
    super.connectedCallback()
  }
}

window.customElements.define('yp-user-image-lit', YpUserImageLit)