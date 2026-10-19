import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpDrawer } from '../yp-drawer.js';
import '../yp-drawer.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpDrawer', () => {
  let element: YpDrawer;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-drawer></yp-drawer>
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
  // - _closeAllDrawers()
  // - _handleEscKey()
  // - _focusDrawerContainer()
});
