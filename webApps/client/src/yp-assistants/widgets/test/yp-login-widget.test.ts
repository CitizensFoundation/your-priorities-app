import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpLoginWidget } from '../yp-login-widget.js';
import '../yp-login-widget.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('YpLoginWidget', () => {
  let element: YpLoginWidget;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-login-widget></yp-login-widget>
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
