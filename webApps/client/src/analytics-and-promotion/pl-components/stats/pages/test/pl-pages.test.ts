import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausablePages } from '../pl-pages.js';
import '../pl-pages.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausablePages', () => {
  let element: PlausablePages;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-pages></pl-pages>
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
  // - renderContent()
  // - renderPill()
});
