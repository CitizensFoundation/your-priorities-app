import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpEditDialog } from '../yp-edit-dialog.js';
import '../yp-edit-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpEditDialog', () => {
  let element: YpEditDialog;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-edit-dialog></yp-edit-dialog>
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
  // - renderMobileView()
  // - renderDesktopView()
  // - scrollResize()
  // - _fileUploadStarting()
  // - _fileUploadComplete()
});
