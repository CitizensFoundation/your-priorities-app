import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAudkenniLogin } from '../yp-audkenni-login.js';
import '../yp-audkenni-login.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAudkenniLogin', () => {
  let element: YpAudkenniLogin;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-audkenni-login></yp-audkenni-login>
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
  // - startLogin()
  // - _poll()
});
