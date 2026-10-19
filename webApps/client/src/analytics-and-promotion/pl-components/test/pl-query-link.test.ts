import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausibleQueryLink } from '../pl-query-link.js';
import '../pl-query-link.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('PlausibleQueryLink', () => {
  let element: PlausibleQueryLink;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-query-link></pl-query-link>
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
  // - onClick()
});
