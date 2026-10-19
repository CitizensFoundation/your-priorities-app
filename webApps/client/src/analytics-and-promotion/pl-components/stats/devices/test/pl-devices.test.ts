import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausableDevices } from '../pl-devices.js';
import '../pl-devices.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausableDevices', () => {
  let element: PlausableDevices;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-devices></pl-devices>
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
  // - renderBrowsers()
  // - renderBrowserVersions()
  // - renderOperatingSystems()
  // - renderOperatingSystemVersions()
  // - renderScreenSizes()
});
