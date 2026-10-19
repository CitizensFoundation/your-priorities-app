import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPromotionApp } from '../yp-promotion-app.js';
import '../yp-promotion-app.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPromotionApp', () => {
  let element: YpPromotionApp;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-promotion-app></yp-promotion-app>
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
  // - _getCollection()
  // - renderTopBar()
  // - snackbarclosed()
  // - renderNavigationBar()
  // - tabChanged()
});
