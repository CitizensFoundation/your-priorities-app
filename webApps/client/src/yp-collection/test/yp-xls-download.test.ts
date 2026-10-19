import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpXlsDownload } from '../yp-xls-download.js';
import '../yp-xls-download.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpXlsDownload', () => {
  let element: YpXlsDownload;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-xls-download></yp-xls-download>
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
  // - startXlsGeneration()
  // - _startXlsCreationResponse()
  // - _pollXlsProgress()
  // - _reportXlsCreationProgress()
  // - _xlsReportCreationProgressResponse()
});
