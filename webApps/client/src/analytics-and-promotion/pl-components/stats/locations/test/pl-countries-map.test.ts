import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausableCountriesMap } from '../pl-countries-map.js';
import '../pl-countries-map.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausableCountriesMap', () => {
  let element: PlausableCountriesMap;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-countries-map></pl-countries-map>
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
  // - getDataset()
  // - updateCountries()
  // - fetchCountries()
  // - resizeMap()
  // - onClick()
});
