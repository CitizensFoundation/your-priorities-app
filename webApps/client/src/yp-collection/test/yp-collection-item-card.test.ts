import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';

import { YpCollectionItemCard } from '../yp-collection-item-card.js';
import '../yp-collection-item-card.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCollectionItemCard', () => {
  let element: YpCollectionItemCard;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const itemType = 'community';

    element = await fixture(html`
      <yp-collection-item-card
        .collection="${YpTestHelpers.getDomain()}"
        .item="${YpTestHelpers.getCommunity()}"
        .itemType="${itemType}"></yp-collection-item-card>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });

  it('links a group community link to the linked community', async () => {
    const group = {
      id: 20,
      name: 'Group link',
      objectives: 'Group objectives',
      language: 'en',
      status: 'active',
      counter_posts: 0,
      community_id: 1,
      configuration: { actAsLinkToCommunityId: 44 },
      Community: {
        id: 1,
        name: 'Parent community',
        configuration: {},
      },
      GroupLogoImages: [],
      CommunityLink: {
        id: 44,
        name: 'Linked community',
        description: 'Linked description',
        language: 'en',
        configuration: {},
        CommunityLogoImages: [],
      },
    } as unknown as YpGroupData;

    element = await fixture(html`
      <yp-collection-item-card .item="${group}"></yp-collection-item-card>
    `);
    await element.updateComplete;

    const link = element.shadowRoot!.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).to.equal('/community/44');
  });

  it('falls back to actAsLinkToCommunityId when CommunityLink is missing', async () => {
    const group = {
      id: 20,
      name: 'Group link',
      objectives: 'Group objectives',
      language: 'en',
      status: 'active',
      counter_posts: 0,
      community_id: 1,
      configuration: { actAsLinkToCommunityId: 44 },
      Community: {
        id: 1,
        name: 'Parent community',
        configuration: {},
      },
      GroupLogoImages: [],
    } as unknown as YpGroupData;

    element = await fixture(html`
      <yp-collection-item-card .item="${group}"></yp-collection-item-card>
    `);
    await element.updateComplete;

    const link = element.shadowRoot!.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).to.equal('/community/44');
  });

  it('resets odd image margin in stacked tablet cards', async () => {
    await setViewport({ width: 930, height: 800 });

    const community = {
      ...YpTestHelpers.getCommunity(),
      CommunityLogoImages: YpTestHelpers.getImages(),
    } as YpCommunityData;

    element = await fixture(html`
      <yp-collection-item-card
        .collection="${YpTestHelpers.getDomain()}"
        .item="${community}"
        .itemType="${'community'}"
        .useEvenOddItemLayout="${true}"
        .index="${1}"></yp-collection-item-card>
    `);
    await element.updateComplete;

    const image = element.shadowRoot!.querySelector('yp-image[is-odd]');
    expect(image).to.exist;
    expect(getComputedStyle(image as Element).marginLeft).to.equal('0px');
  });
});
