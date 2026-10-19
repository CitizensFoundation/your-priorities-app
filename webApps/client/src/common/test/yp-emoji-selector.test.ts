import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpEmojiSelector } from '../yp-emoji-selector.js';
import '../yp-emoji-selector.js';
import { YpTestHelpers } from './setup-app.js';

describe('YpEmojiSelector', () => {
  let element: YpEmojiSelector;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-emoji-selector></yp-emoji-selector>
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
  // - togglePicker()
});
