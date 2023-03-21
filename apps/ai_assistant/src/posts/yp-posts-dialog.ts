import { css, html } from 'lit';
import { property, customElement, query, queryAll } from 'lit/decorators.js';
import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';
import { Layouts } from '../flexbox-literals/classes.js';

import '@material/web/dialog/dialog.js';
import { MdDialog } from '@material/web/dialog/dialog.js';
import '../@yrpri/yp-post/yp-post.js';
import { YpCache } from '../@yrpri/yp-app/YpCache.js';
import { YpServerApi } from '../@yrpri/common/YpServerApi.js';

@customElement('yp-posts-dialog')
export class YpPostsDialog extends YpBaseElement {
  static postsCache: YpCache = new YpCache();

  @property({ type: Array })
  simplePosts: YpSimplePost[] | undefined;

  @property({ type: Object })
  group: YpGroupData | undefined;

  @property({ type: Number })
  groupId: number = 22785;

  @property({ type: Number })
  currentPostId: number | undefined;

  @property({ type: Object })
  currentPost: YpPostData | undefined;

  @property({ type: Number })
  currentIndex: number | undefined;

  async connectedCallback() {
    super.connectedCallback();
    this.group = await window.serverApi.getGroup(this.groupId);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  @query('#dialog')
  dialog!: MdDialog;

  static get styles() {
    return [Layouts, css`

    #dialog {
      height: 100dvh;
    }

    .indexNumber {
      margin-top: 12px;
      font-size: 20px;
      margin-left: 8px;
      margin-right: 8px;
      color: var(--md-sys-color-on-surface);
    }

    .cancelButton {
      margin-right: 332px
    }

    @media (max-width: 800px) {
      .cancelButton {
      margin-right: 32px
    }

    .postHeader {
      padding: 8px;
      font-size: 22px;
    }
    }
    `];
  }

  scrollUp() {
    //await this.updateComplete;
    setTimeout(() => {
      this.$$('#content').scrollTop = 0;
    }, 100);
  }

  async cacheAllPosts() {
    const postIds = this.simplePosts?.map(post => post.postId);
    for (let i = 0; i < postIds.length; i++) {
      let post = YpPostsDialog.postsCache.getPostFromCache(postIds[i]);
      if (!post) {
        post = await window.serverApi.getPost(postIds[i]);
        YpPostsDialog.postsCache.addPostsToCache([post]);
      }
    }
  }

  async updatePost() {
    const postIds = this.simplePosts?.map(post => post.postId);
    if (postIds) {
      this.currentPostId = postIds[this.currentIndex];
      let post = YpPostsDialog.postsCache.getPostFromCache(this.currentPostId);

      if (!post) {
        post = await window.serverApi.getPost(this.currentPostId);
        YpPostsDialog.postsCache.addPostsToCache([post]);
      }

      this.currentPost = post;

      this.scrollUp();

      this.cacheAllPosts();
    }
  }
  previousPost() {
    if (this.currentIndex !== 0) {
      this.currentIndex = this.currentIndex - 1;
      this.updatePost();
    }
  }

  nextPost() {
    if (this.currentIndex !== this.simplePosts?.length - 1) {
      this.currentIndex = this.currentIndex + 1;
      this.updatePost();
    }
  }

  open(posts: YpSimplePost[], postIndex: number) {
    this.simplePosts = posts;
    this.currentIndex = postIndex;
    this.updatePost();
    this.dialog.show();
  }

  renderContent() {
    if (this.currentPost) {
      return html`
        <yp-post .post="${this.currentPost}" .group="${this.group}"> </yp-post>
      `;
    } else {
      return html` <mwc-linear-progress indeterminate></mwc-linear-progress>`;
    }
  }

  renderFooter() {
    return html` <div class="layout horizontal">
      <md-outlined-icon-button
        label="Loka"
        class="cancelButton self-start"
        @click="${() => this.dialog.close()}"
        >close</md-outlined-icon-button
      >
      <md-outlined-icon-button
        label="Loka"
        ?disabled="${this.currentIndex === 0}"
        id="cancel"
        @click="${this.previousPost}"
        >navigate_before</md-outlined-icon-button
      >
      <div class="indexNumber">${this.currentIndex + 1}.</div>
      <md-outlined-icon-button
        label="Loka"
        ?disabled="${this.currentIndex === this.simplePosts?.length - 1}"
        id="cancel"
        @click="${this.nextPost}"
        >navigate_next</md-outlined-icon-button
      >
    </div>`;
  }

  render() {
    return html`<md-dialog ?fullsffcreen="${!this.wide}" id="dialog" scrimClickAction="">
      <div slot="header" class="postHeader">${this.currentPost?.name}</div>
      <div id="content"> ${this.renderContent()} </div>
      <div slot="footer">${this.renderFooter()} </div>
    </md-dialog> `;
  }
}
