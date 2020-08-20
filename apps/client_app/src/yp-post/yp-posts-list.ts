import { customElement, html, property, css } from 'lit-element';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpIronListHelpers } from '../@yrpri/YpIronListHelpers.js';

import '@material/mwc-icon-button';
import '@material/mwc-textfield';
import 'lit-virtualizer';

import './yp-posts-filter.js';
import './yp-post-card.js';

import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpPostCard } from './yp-post-card.js';
import { YpPostsFilter } from './yp-posts-filter.js';
import { nothing, TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';

@customElement('yp-posts-list')
export class YpPostsList extends YpBaseElement {
  @property({ type: String })
  searchingFor: string | undefined;

  @property({ type: String })
  subTitle: string | undefined;

  @property({ type: String })
  filter = 'newest';

  @property({ type: String })
  statusFilter = 'open';

  @property({ type: Array })
  posts: Array<YpPostData> | undefined;

  //TODO: Check if we still want to use this like that
  @property({ type: Number })
  userId: number | undefined;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Number })
  categoryId: number | undefined;

  @property({ type: Number })
  postsCount: number | undefined;

  @property({ type: String })
  selectedCategoryName: string | undefined;

  @property({ type: Number })
  selectedGroupTab: number | undefined;

  @property({ type: Boolean })
  noPosts = false;

  @property({ type: Boolean })
  showSearchIcon = false;

  moreToLoad = false;

  // For YpIronListHelper
  resetListSize: Function | undefined;
  skipIronListWidth = false;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .postsFilter {
          padding-left: 16px;
          height: 36px;
        }

        .objectives {
          padding-bottom: 40px;
          max-width: 432px;
        }

        .description {
          padding: 12px;
        }

        yp-post-card {
          padding-bottom: 52px;
        }

        #outerRegion {
          position: relative;
        }

        #scrollableRegion {
        }

        iron-list {
          height: 100vh;
        }

        yp-posts-filter {
          margin-bottom: 8px;
          margin-left: 8px;
          margin-top: 16px;
        }

        #ironList {
        }

        .searchButton {
          padding: 8px;
          margin: 8px;
        }

        .searchContainer {
          margin-top: 8px;
        }

        yp-posts-filter {
          padding-right: 16px;
        }

        .half {
          width: 50%;
        }

        .searchBox {
          --paper-input-container-label: {
            font-size: 23px;
            color: #555;
          }
          margin-bottom: 22px;
          margin-right: 8px;
        }

        @media (max-width: 800px) {
          .searchBox {
            --paper-input-container-label: {
              font-size: 18px;
            }
            margin-bottom: 8px;
          }

          .searchBox {
            margin-top: 8px;
          }

          .half {
            width: 100%;
          }

          .searchContainer {
            margin-top: 0;
          }

          .postsFilter {
            padding-left: 16px;
            width: 215px !important;
          }
        }

        .noIdeas {
          background-color: #fff;
          max-width: 200px;
          padding: 16px;
          margin: 16px;
          margin-top: 32px;
        }

        .noIdeasText {
          font-weight: bold;
        }

        .card {
          padding: 0;
          padding-top: 8px;
        }

        .card[wide-padding] {
          padding: 16px !important;
        }

        #searchInput {
          margin-left: 8px;
        }

        [hidden] {
          display: none !important;
        }

        :focus {
        }

        .largeAjax {
          position: absolute;
          bottom: 32px;
        }

        a {
          text-decoration: none;
        }
      `,
    ];
  }

  _searchKey(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this._search();
    }
  }

  render() {
    return html`
      <div class="layout vertical center-center topMost">
        ${this.noPosts
          ? html`
              <div class="layout horiztonal center-center">
                <div
                  class="noIdeas layout horizontal center-center shadow-elevation-6dp shadow-transition"
                  ?hidden="${this.group.configuration
                    .allPostsBlockedByDefault}">
                  <div class="noIdeasText">${this.t('noIdeasHere')}</div>
                </div>
              </div>
            `
          : html``}
        ${this.posts
          ? html`
              <div
                class="searchContainer layout horizontal center-center wrap"
                ?hidden="${this.group.configuration.hidePostFilterAndSearch}">
                <div class="layout horizontal center-center">
                  <yp-posts-filter
                    @tap="${this._tapOnFilter}"
                    .subTitle="${this.subTitle ? this.subTitle : ''}"
                    class="filter"
                    id="postsFilter"
                    .tabName="${this.statusFilter}"
                    @refresh-group="${this._refreshGroupFromFilter}"
                    .group="${this.group}"
                    .filter="${this.filter}"
                    .statusFilter="${this.statusFilter}"
                    .searchingFor="${this.searchingFor}"
                    .categoryId="${this.categoryId}"
                    .postsCount="${this.postsCount}">
                  </yp-posts-filter>
                </div>
                <div class="layout horizontal center-center">
                  <mwc-textfield
                    id="searchInput"
                    @keydown="${this._searchKey}"
                    .label="${this.t('searchFor')}"
                    .value="${this.searchingFor ? this.searchingFor : ''}"
                    class="searchBox">
                  </mwc-textfield>
                  <mwc-icon-button
                    .label="${this.t('startSearch')}"
                    icon="search"
                    @click="${this._search}"
                    ?hidden="${!this.showSearchIcon}"></mwc-icon-button>
                </div>
              </div>
              <lit-virtualizer style="width: 100vw; height: 100vh;"
                  .items=${this.posts}
                  .scrollTarget="${window}"
                  .renderItem=${this.renderPostItem}
                ></lit-virtualizer>
            `
          : html``}
      </div>
    `;
  }

  renderPostItem(post: YpPostData, index?: number | undefined): TemplateResult {
    return html` <div
      ?wide-padding="${this.wide}"
      class="card layout vertical center-center"
      aria-label="[[post.name]]"
      role="listitem"
      aria-level="2"
      tabindex="${ifDefined(index)}">
      <yp-post-card
        id="postCard${post.id}"
        @refresh="${this._refreshPost}"
        class="card"
        .post="${post}">
      </yp-post-card>
    </div>`;
  }

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
    super.firstUpdated(changedProperties);
    console.error(changedProperties);

  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  _selectedItemChanged(event: CustomEvent) {
    const detail = event.detail;
    if (detail && detail.value) {
      const selectedCard = this.$$('#postCard' + detail.value.id) as YpPostCard;
      if (selectedCard) {
        selectedCard.clickOnA();
      }
    }
  }

  async _refreshPost(event: CustomEvent) {
    const postId: number = event.detail.id as number;
    if (postId) {
      const post = (await window.serverApi.getPost(
        postId
      )) as YpPostData | void;
      if (post && this.posts) {
        for (let i = 0; i < this.posts.length; i++) {
          if (this.posts[i].id == post.id) {
            this.posts[i] = post;
            window.appGlobals.cache.updatePostInCache(post);
            this.requestUpdate;
            await this.updateComplete;
            setTimeout(() => {
              (this.$$('#ironList') as IronListInterface).fire('iron-resize');
            });
            break;
          }
        }
      }
    }
  }

  _getPostLink(post: YpPostData) {
    if (post) {
      if (
        post.Group &&
        post.Group.configuration &&
        post.Group.configuration.disablePostPageLink
      ) {
        return '#';
      } else if (
        post.Group &&
        post.Group.configuration &&
        post.Group.configuration.resourceLibraryLinkMode
      ) {
        return post.description.trim();
      } else {
        return '/post/' + post.id;
      }
    } else {
      console.warn('Trying to get empty post link');
    }
  }

  get scrollOffset() {
    const list = this.$$('ironList');
    if (list) {
      let offset = list.offsetTop;
      offset -= 75;
      if (list.offsetTop > 0 && offset > 0) {
        console.info('Post list scroll offset: ' + offset);
        return offset;
      } else {
        if (this.wide) offset = 550;
        else offset = 700;

        if (this.group && this.group.configuration) {
          if (this.group.configuration.hideAllTabs) offset -= 60;
          if (this.group.configuration.hideNewPost) offset -= 100;
          if (this.group.configuration.hidePostFilterAndSearch) offset -= 100;
        }

        console.info('Post list (manual) scroll offset: ' + offset);
        return offset;
      }
    } else {
      console.warn('No list for scroll offset');
      return null;
    }
  }

  _tapOnFilter() {
    window.appGlobals.activity('click', 'filter');
  }

  _search() {
    window.appGlobals.activity('click', 'search');
    if (this.searchingFor && this.searchingFor != '') {
      this._refreshGroupFromFilter();
    }
  }

  buildPostsUrlPath() {
    return (this.$$('#postsFilter') as YpPostsFilter).buildPostsUrlPath();
  }

  scrollToPost(post: YpPostData) {
    if (post && this.posts) {
      console.info('Scrolling to post: ' + post.id);
      (this.$$('#ironList') as IronListInterface).scrollToItem(post);
      this.fireGlobal('yp-refresh-activities-scroll-threshold');
    } else {
      console.error('No post id on goToPostId');
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    console.error(changedProperties);
    if (changedProperties.has('statusFilter') && this.group && this.statusFilter) {
      const allowedForceByValues = [
        'oldest',
        'newest',
        'top',
        'most_debated',
        'random',
        'alphabetical',
      ];

      this.posts = undefined;
      this.noPosts = false;
      if (this.group) {
        this.moreToLoad = true;
        if (
          this.group.configuration &&
          this.group.configuration.forcePostSortMethodAs &&
          allowedForceByValues.indexOf(
            this.group.configuration.forcePostSortMethodAs
          ) > -1
        ) {
          this.filter = this.group.configuration.forcePostSortMethodAs;
        } else {
          if (
            this.group.configuration &&
            this.group.configuration.canAddNewPosts != undefined
          ) {
            if (this.group.configuration.canAddNewPosts === true) {
              this.filter = 'newest';
            } else if (
              this.group.configuration.canAddNewPosts === false &&
              this.group.configuration.canVote === false
            ) {
              if (this.group.configuration.customRatings) {
                this.filter = 'random';
              } else {
                this.filter = 'top';
              }
            } else {
              this.filter = 'random';
            }
          } else if (!this.filter) {
            this.filter = 'newest';
          }
        }
        console.error('LOADMORE FOR CONTAINER');
        this._loadMoreData();
      }
    } else if (this.group && changedProperties.has('filter') && this.filter) {
      this._loadMoreData();
    } else if (
      this.group &&
      changedProperties.has('categoryId') &&
      this.categoryId
    ) {
      this._loadMoreData();
    }

    if (changedProperties.has('searchingFor')) {
      if (this.searchingFor && this.searchingFor != '') {
        this.moreToLoad = true;
        this.showSearchIcon = true;
      } else {
        this.showSearchIcon = false;
      }
    }
  }

  _refreshGroupFromFilter() {
    this.posts = undefined;
    this.moreToLoad = true;
    this._loadMoreData();
  }

  async _loadMoreData() {
    if (this.moreToLoad && this.group) {
      this.moreToLoad = false;
      this.noPosts = false;
      let objectIdString: string;
      let objectType: string;
      let url: string;

      if (this.userId) {
        objectIdString = this.userId + '/posts';
        objectType = 'users';
      } else {
        objectIdString = `${this.group.id}`;
        objectType = 'groups';
      }

      if (this.searchingFor) {
        url =
          '/api/' +
          objectType +
          '/' +
          objectIdString +
          '/search/' +
          this.searchingFor;
      } else {
        url =
          '/api/' + objectType + '/' + objectIdString + '/posts/' + this.filter;
        if (this.categoryId) {
          url += '/' + this.categoryId;
        } else {
          url += '/null';
        }
        url += '/' + this.statusFilter;
      }
      if (this.posts) url += '?offset=' + this.posts.length;

      const postsInfo = (await window.serverApi.getGroupPosts(
        url
      )) as YpPostsInfoInterface | void;

      if (postsInfo) {
        this.postsCount = postsInfo.totalPostsCount;

        this.fire('yp-post-count', {
          type: this.statusFilter,
          count: this.postsCount,
        });

        if (!this.posts) {
          this.posts = postsInfo.posts;
        } else {
          for (let i = 0; i < postsInfo.posts.length; i++) {
            this.posts.push(postsInfo.posts[i]);
          }
        }

        if (postsInfo.posts.length == 0 && this.posts.length == 0) {
          this.noPosts = true;
        }

        if (postsInfo.posts.length > 0) {
          this.noPosts = false;
        } else {
          if (this.searchingFor && this.searchingFor != '') {
            this.noPosts = false;
          }
        }

        setTimeout(() => {
          const postFilter = this.$$('#postsFilter') as YpPostsFilter;
          if (postFilter) {
            postFilter._updateTitle();
          }
        }, 20);

        if (
          postsInfo.posts.length > 0 &&
          postsInfo.posts.length != this.postsCount
        ) {
          this.moreToLoad = true;
        }

        this.fireGlobal('yp-refresh-activities-scroll-threshold');

        this._processCategories();
        this._checkForMultipleLanguages(postsInfo.posts);
        window.appGlobals.cache.addPostsToCacheLater(postsInfo.posts);
        this.requestUpdate();
      }
    }
  }

  _checkForMultipleLanguages(posts: Array<YpPostData>) {
    if (
      !localStorage.getItem('dontPromptForAutoTranslation') &&
      !sessionStorage.getItem('dontPromptForAutoTranslation')
    ) {
      let firstLanguage: string;
      let firstContent: string;
      let multipleLanguages = false;
      posts.forEach(function (post) {
        if (post.language && !multipleLanguages) {
          if (!firstLanguage && post.language !== '??') {
            firstLanguage = post.language;
            firstContent = post.description;
          } else if (
            firstLanguage &&
            firstLanguage !== post.language &&
            post.language !== '??'
          ) {
            multipleLanguages = true;
            console.info(
              'Multiple post languages: ' +
                firstLanguage +
                ' and ' +
                post.language
            );
            //console.info("A: "+firstContent+" B: "+post.description);
          }
        }
      });

      if (multipleLanguages) {
        /* TODO: Fix explicit typedef
        window.appDialogs.getDialogAsync('autoTranslateDialog', (dialog: { openLaterIfAutoTranslationEnabled: () => void }) => {
          dialog.openLaterIfAutoTranslationEnabled();
        }); */
      }
    }
  }

  _processCategories() {
    if (this.categoryId && this.group.Categories) {
      for (let i = 0; i < this.group.Categories.length; i++) {
        if (this.group.Categories[i].id == this.categoryId) {
          this.selectedCategoryName = this.group.Categories[i].name;
          //this.$.layout.updateFilter();
        }
      }
    } else {
      this.selectedCategoryName = 'categories.all';
      //this.$.layout.updateFilter();
    }
  }
}
