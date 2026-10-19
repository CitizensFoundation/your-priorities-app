import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpUsersGrid } from '../yp-users-grid.js';
import '../yp-users-grid.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpUsersGrid', () => {
  let element: YpUsersGrid;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-users-grid></yp-users-grid>
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
  // - renderSelectionHeader()
  // - selectionRenderer()
  // - _reloadFromButton()
  // - _generateRequest()
  // - _ajaxError()
});
