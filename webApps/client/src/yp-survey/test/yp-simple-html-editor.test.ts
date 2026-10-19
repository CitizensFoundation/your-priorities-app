import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpSimpleHtmlEditor } from '../yp-simple-html-editor.js';
import '../yp-simple-html-editor.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpSimpleHtmlEditor', () => {
  let element: YpSimpleHtmlEditor;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-simple-html-editor></yp-simple-html-editor>
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
  // - _onWidthInput()
  // - _onHeightInput()
  // - _onMarginInput()
  // - closeImageDialog()
  // - applyImageSize()
});
