import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausibleSourcesUtm } from '../pl-sources-utm.js';
import '../pl-sources-utm.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausibleSourcesUtm', () => {
  let element: PlausibleSourcesUtm;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-sources-utm></pl-sources-utm>
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
  // - renderReferrer()
  // - renderList()
  // - renderContent()
});
