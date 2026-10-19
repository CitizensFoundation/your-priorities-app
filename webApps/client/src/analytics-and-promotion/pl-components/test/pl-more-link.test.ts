import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausibleMoreLink } from '../pl-more-link.js';
import '../pl-more-link.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('PlausibleMoreLink', () => {
  let element: PlausibleMoreLink;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-more-link></pl-more-link>
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
  // - user interactions and emitted events
  // - conditional rendering across property states
  // - API or side-effect flows
});
