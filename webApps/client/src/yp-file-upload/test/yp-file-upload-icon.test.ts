import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpFileUploadIcon } from '../yp-file-upload-icon.js';
import '../yp-file-upload-icon.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpFileUploadIcon', () => {
  let element: YpFileUploadIcon;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-file-upload-icon></yp-file-upload-icon>
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
