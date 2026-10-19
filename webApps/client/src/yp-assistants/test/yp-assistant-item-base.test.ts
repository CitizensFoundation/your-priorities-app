import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAssistantItemBase } from '../yp-assistant-item-base.js';
import '../yp-assistant-item-base.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAssistantItemBase', () => {
  let element: YpAssistantItemBase;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-assistant-item-base></yp-assistant-item-base>
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
  // - renderAvatar()
});
