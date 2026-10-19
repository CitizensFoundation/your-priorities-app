import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostTags } from '../yp-post-tags.js';
import '../yp-post-tags.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostTags', () => {
  let element: YpPostTags;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-post-tags></yp-post-tags>
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
  // - _trimmedItem()
  // - _autoTranslateEvent()
  // - computeSpanHidden()
  // - _newTranslation()
});
