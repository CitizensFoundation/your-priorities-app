import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpEmojiDialog } from '../yp-emoji-dialog.js';
import '../yp-emoji-dialog.js';
import { YpTestHelpers } from './setup-app.js';

describe('YpEmojiDialog', () => {
  let element: YpEmojiDialog;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-emoji-dialog></yp-emoji-dialog>
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
  // - closeDialog()
  // - open()
  // - emojiClick()
});
