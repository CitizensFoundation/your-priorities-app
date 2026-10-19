import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpDomainHeader } from '../yp-domain-header.js';
import '../yp-domain-header.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpDomainHeader', () => {
  let element: YpDomainHeader;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-domain-header></yp-domain-header>
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
