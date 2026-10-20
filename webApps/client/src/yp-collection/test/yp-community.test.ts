import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCommunity } from '../yp-community.js';
import '../yp-community.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCommunity', () => {
  let element: YpCommunity;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();

    fetchMock.get('/api/communities/1',YpTestHelpers.getCommunity(), YpTestHelpers.fetchMockConfig);
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-community
        collectionId="1"
      ></yp-community>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('admin-only page gating', () => {
    afterEach(() => {
      window.appUser.user = undefined;
      window.appUser.adminRights = undefined;
    });

    it('shows the not-available page to a non-admin viewer', async () => {
      window.appUser.user = YpTestHelpers.getUser();
      window.appUser.adminRights = undefined;
      element.requestUpdate();
      await element.updateComplete;

      expect(element.shadowRoot!.querySelector('yp-page-not-available')).to
        .exist;
    });

    it('shows the not-available page to a logged-out (anonymous) viewer', async () => {
      window.appUser.user = undefined;
      window.appUser.adminRights = undefined;
      element.requestUpdate();
      await element.updateComplete;

      expect(element.shadowRoot!.querySelector('yp-page-not-available')).to
        .exist;
    });

    it('renders the community page normally for a community admin', async () => {
      window.appUser.user = YpTestHelpers.getUser();
      window.appUser.adminRights = {
        GroupAdmins: [],
        CommunityAdmins: [{ id: 1 } as YpCommunityData],
        DomainAdmins: [],
        OrganizationAdmins: [],
      };
      element.requestUpdate();
      await element.updateComplete;

      expect(element.shadowRoot!.querySelector('yp-page-not-available')).to
        .not.exist;
    });
  });

  describe('_setupCommunityBackPath (navbar link up to the parent domain)', () => {
    let originalPath: string;
    let capturedDetail: any;
    const onChangeHeader = (event: Event) => {
      capturedDetail = (event as CustomEvent).detail;
    };

    beforeEach(() => {
      originalPath = window.location.pathname;
      history.pushState({}, '', '/community/1');
      capturedDetail = undefined;
      element.addEventListener('yp-change-header', onChangeHeader);
    });

    afterEach(() => {
      element.removeEventListener('yp-change-header', onChangeHeader);
      history.pushState({}, '', originalPath);
      window.appUser.user = undefined;
      window.appUser.adminRights = undefined;
    });

    it('points non-domain-admins at the homepage instead of the domain page', () => {
      window.appUser.user = YpTestHelpers.getUser();
      window.appUser.adminRights = undefined;

      const community = {
        ...YpTestHelpers.getCommunity(),
        domain_id: 9,
        Domain: { id: 9, name: 'Test Domain' } as YpDomainData,
      } as YpCommunityData;

      element._setupCommunityBackPath(community);

      expect(capturedDetail.backPath).to.equal('/');
    });

    it('points domain admins at the actual domain page', () => {
      window.appUser.user = YpTestHelpers.getUser();
      window.appUser.adminRights = {
        GroupAdmins: [],
        CommunityAdmins: [],
        DomainAdmins: [{ id: 9 } as YpDomainData],
        OrganizationAdmins: [],
      };

      const community = {
        ...YpTestHelpers.getCommunity(),
        domain_id: 9,
        Domain: { id: 9, name: 'Test Domain' } as YpDomainData,
      } as YpCommunityData;

      element._setupCommunityBackPath(community);

      expect(capturedDetail.backPath).to.equal('/domain/9');
    });
  });
});
