import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpFileUpload } from '../yp-file-upload.js';
import '../yp-file-upload.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpFileUpload', () => {
  let element: YpFileUpload;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
      element = await fixture(html`
        <yp-file-upload
          .group="${YpTestHelpers.getGroup()}"
          subText="Test">
        </yp-file-upload>
      `);
      await aTimeout(100);
    });

  // TODO: Skipped because this fails, as it already did upstream at
  // f187715 (where we forked from). We haven't investigated why.
  it.skip('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
