import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpSnackbar } from '../yp-snackbar.js';
import '../yp-snackbar.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpSnackbar', () => {
  let element: YpSnackbar;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-snackbar></yp-snackbar>
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
  // - showSnackbar()
  // - closeSnackbar()
});
