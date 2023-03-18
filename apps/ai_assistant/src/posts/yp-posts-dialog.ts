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
  static serverApi: YpServerApi = new YpServerApi(
    'https://betrireykjavik.is/api'
  );

  @property({ type: Array })
  simplePosts: YpSimplePost[] | undefined;

  @property({ type: Object })
  group: YpGroupData | undefined;

  @property({ type: Number })
  groupId: number;

  @property({ type: Number })
  currentPostId: number | undefined;

  @property({ type: Object })
  currentPost: YpPostData | undefined;

  @property({ type: Number })
  currentIndex: number | undefined;

  async connectedCallback() {
    super.connectedCallback();
    this.group = await YpPostsDialog.serverApi.getGroup(this.groupId);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  @query('#dialog')
  dialog!: MdDialog;

  static get styles() {
    return [Layouts, css``];
  }

  async cacheAllPosts() {
    const postIds = this.simplePosts?.map(post => post.id);
    for (let i = 0; i < postIds.length; i++) {
      let post = YpPostsDialog.postsCache.getPostFromCache(postIds[i]);
      if (!post) {
        post = await YpPostsDialog.serverApi.getPost(this.currentPostId);
        YpPostsDialog.postsCache.addPostsToCache([post]);
      }
    }
  }

  async updatePost() {
    const postIds = this.simplePosts?.map(post => post.id);
    if (postIds) {
      this.currentPostId = postIds[this.currentIndex];
      let post = YpPostsDialog.postsCache.getPostFromCache(this.currentPostId);

      if (!post) {
        post = await YpPostsDialog.serverApi.getPost(this.currentPostId);
        YpPostsDialog.postsCache.addPostsToCache([post]);
      }

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
        id="cancel"
        @click="${() => this.dialog.close()}"
        >close</md-outlined-icon-button
      >
      <div class="flex"></div>
      <md-outlined-icon-button
        label="Loka"
        ?disabled="${this.currentIndex === 0}"
        id="cancel"
        @click="${this.previousPost}"
        >left_arrow</md-outlined-icon-button
      >
      <div class="indexNumber">${this.currentIndex + 1}</div>
      <md-outlined-icon-button
        label="Loka"
        ?disabled="${this.currentIndex === this.simplePosts?.length - 1}"
        id="cancel"
        @click="${this.nextPost}"
        >left_arrow</md-outlined-icon-button
      >
    </div>`;
  }

  render() {
    return html`<md-dialog id="dialog">
      <slot id="content"> ${this.renderContent()} </slot>
      <slot id="footer">${this.renderFooter()} </slot>
    </md-dialog> `;
  }
}
