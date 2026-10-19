import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostsGrid } from '../yp-posts-grid.js';
import '../yp-posts-grid.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostsGrid', () => {
  let element: YpPostsGrid;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-posts-grid></yp-posts-grid>
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
