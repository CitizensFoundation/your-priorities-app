import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausibleSourcesList } from '../pl-sources-list.js';
import '../pl-sources-list.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausibleSourcesList', () => {
  let element: PlausibleSourcesList;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-sources-list></pl-sources-list>
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
  // - tabChanged()
});
