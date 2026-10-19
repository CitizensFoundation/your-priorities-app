import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PsOperationsView } from '../ps-operations-view.js';
import '../ps-operations-view.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('PsOperationsView', () => {
  let element: PsOperationsView;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <ps-operations-view></ps-operations-view>
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
  // - createLink()
  // - updatePaperSize()
  // - createAgentElement()
  // - renderHeader()
});
