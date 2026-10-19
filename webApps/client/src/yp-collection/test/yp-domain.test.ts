import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpDomain } from '../yp-domain.js';
import '../yp-domain.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpDomain', () => {
  let element: YpDomain;
  let fetchMock: any;

  before(async () => {
    await YpTestHelpers.setupApp();
    fetchMock = YpTestHelpers.getFetchMock();

    fetchMock.get('/api/domains/1',YpTestHelpers.getDomain(), YpTestHelpers.fetchMockConfig);
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-domain
        collectionId="1">
      </yp-domain>
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

    it('renders the domain page normally for a domain admin', async () => {
      window.appUser.user = YpTestHelpers.getUser();
      window.appUser.adminRights = {
        GroupAdmins: [],
        CommunityAdmins: [],
        DomainAdmins: [{ id: 1 } as YpDomainData],
        OrganizationAdmins: [],
      };
      // getDomain() fixture omits `configuration`, which render() dereferences
      // once the page isn't hidden — fill it in to avoid an unrelated crash.
      element.collection = {
        ...YpTestHelpers.getDomain(),
        configuration: {},
      } as YpDomainData;
      element.requestUpdate();
      await element.updateComplete;

      expect(element.shadowRoot!.querySelector('yp-page-not-available')).to
        .not.exist;
    });
  });
});
