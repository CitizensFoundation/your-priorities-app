import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAdminReports } from '../yp-admin-reports.js';
import '../yp-admin-reports.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAdminReports', () => {
  let element: YpAdminReports;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-admin-reports></yp-admin-reports>
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
  // - refresh()
  // - fraudItemSelection()
  // - startReportCreation()
  // - startReportCreationResponse()
  // - pollLaterForProgress()
});
