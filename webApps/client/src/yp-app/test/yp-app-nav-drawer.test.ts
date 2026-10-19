import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAppNavDrawer } from '../yp-app-nav-drawer.js';
import '../yp-app-nav-drawer.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAppNavDrawer', () => {
  let element: YpAppNavDrawer;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-app-nav-drawer></yp-app-nav-drawer>
    `);

    await aTimeout(100);
  });

  it('renders the component', async () => {
    expect(element).to.exist;
    expect(element.shadowRoot).to.exist;
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('_reset() my-domains list', () => {
    it('only includes domains the user administers, not domains they merely belong to', () => {
      element.memberships = {
        GroupUsers: [],
        CommunityUsers: [],
        DomainUsers: [
          { id: 1, name: 'Member-only Domain' } as YpDomainData,
          { id: 2, name: 'Admin Domain' } as YpDomainData,
        ],
      } as YpMemberships;
      element.adminRights = {
        GroupAdmins: [],
        CommunityAdmins: [],
        DomainAdmins: [{ id: 2, name: 'Admin Domain' } as YpDomainData],
        OrganizationAdmins: [],
      };

      element._reset();

      expect(element.myDomains!.map((d) => d.id)).to.deep.equal([2]);
    });

    it('is empty when the user has no domain admin rights, even if they belong to domains', () => {
      element.memberships = {
        GroupUsers: [],
        CommunityUsers: [],
        DomainUsers: [{ id: 1, name: 'Member-only Domain' } as YpDomainData],
      } as YpMemberships;
      element.adminRights = {
        GroupAdmins: [],
        CommunityAdmins: [],
        DomainAdmins: [],
        OrganizationAdmins: [],
      };

      element._reset();

      expect(element.myDomains).to.deep.equal([]);
    });
  });

  // TODO: Add targeted behavior tests for:
  // - _closeAllDrawers()
  // - getGroupTypeName()
  // - _openChanged()
  // - _selectedLocale()
});
