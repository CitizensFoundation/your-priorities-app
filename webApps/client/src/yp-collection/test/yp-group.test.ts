import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { GroupTabTypes, YpGroup } from '../yp-group.js';
import '../yp-group.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';


describe('YpGroup', () => {
  let element: YpGroup;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();

    fetchMock.get('/api/groups/1',YpTestHelpers.getGroupResults(), YpTestHelpers.fetchMockConfig);
    fetchMock.get('/api/groups/1/pages',[], YpTestHelpers.fetchMockConfig);
    fetchMock.get('/api/groups/1/posts/newest/null/open?offset=0', {
      posts: [],
      totalPostsCount: 0,
    }, YpTestHelpers.fetchMockConfig);
    fetchMock.get('/api/groups/1/posts/newest/null/in_progress?offset=0', {
      posts: [],
      totalPostsCount: 23,
    }, YpTestHelpers.fetchMockConfig);
    fetchMock.get('/api/groups/1/posts/newest/null/successful?offset=0', {
      posts: [],
      totalPostsCount: 0,
    }, YpTestHelpers.fetchMockConfig);
    fetchMock.get('/api/groups/1/posts/newest/null/failed?offset=0', {
      posts: [],
      totalPostsCount: 231,
    }, YpTestHelpers.fetchMockConfig);

  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-group
        collectionId="1">
      </yp-group>
    `);
    await aTimeout(200);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });

  it('selects the first non-empty post status tab when open is empty', async () => {
    element.collection = YpTestHelpers.getGroup();
    element.hasNonOpenPosts = true;
    element.selectedGroupTab = GroupTabTypes.Open;
    element.tabCounters = {
      open: 0,
      in_progress: 23,
      successful: 0,
      failed: 231,
    };

    element._setupOpenTab();

    expect(element.selectedGroupTab).to.equal(GroupTabTypes.InProgress);
  });
});
