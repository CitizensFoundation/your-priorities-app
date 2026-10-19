import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpShareDialog } from '../yp-share-dialog.js';
import '../yp-share-dialog.js';
import { YpTestHelpers } from './setup-app.js';

describe('YpShareDialog', () => {
  let element: YpShareDialog;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-share-dialog></yp-share-dialog>
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
  // - open()
});
