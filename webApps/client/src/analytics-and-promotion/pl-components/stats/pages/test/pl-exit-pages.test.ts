import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausableExitPages } from '../pl-exit-pages.js';
import '../pl-exit-pages.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausableExitPages', () => {
  let element: PlausableExitPages;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-exit-pages></pl-exit-pages>
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
