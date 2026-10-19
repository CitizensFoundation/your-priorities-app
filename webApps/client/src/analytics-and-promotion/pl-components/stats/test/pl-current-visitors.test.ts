import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausibleCurrentVisitors } from '../pl-current-visitors.js';
import '../pl-current-visitors.js';
import { YpTestHelpers } from '../../../../common/test/setup-app.js';

describe('PlausibleCurrentVisitors', () => {
  let element: PlausibleCurrentVisitors;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-current-visitors></pl-current-visitors>
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
  // - updateCount()
});
