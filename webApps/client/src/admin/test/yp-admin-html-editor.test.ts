import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAdminHtmlEditor } from '../yp-admin-html-editor.js';
import '../yp-admin-html-editor.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAdminHtmlEditor', () => {
  let element: YpAdminHtmlEditor;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-admin-html-editor></yp-admin-html-editor>
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
  // - _selectTab()
  // - getConfiguration()
  // - _generateLogo()
  // - renderAiImageGenerator()
  // - _setMediaLoaded()
  // - _logoImageUploaded()
});
