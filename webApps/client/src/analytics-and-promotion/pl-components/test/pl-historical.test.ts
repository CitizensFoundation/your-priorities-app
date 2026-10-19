import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausibleHistorical } from '../pl-historical.js';
import '../pl-historical.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('PlausibleHistorical', () => {
  let element: PlausibleHistorical;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-historical></pl-historical>
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
  // - renderConversions()
});
