import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausableLocations } from '../pl-locations.js';
import '../pl-locations.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausableLocations', () => {
  let element: PlausableLocations;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-locations></pl-locations>
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

  // TODO: Add targeted behavior tests for:
  // - setMode()
  // - onCountryFilter()
  // - onRegionFilter()
  // - renderCountries()
  // - renderRegions()
});
