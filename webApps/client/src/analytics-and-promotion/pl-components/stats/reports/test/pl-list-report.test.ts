import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausableListReport } from '../pl-list-report.js';
import '../pl-list-report.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausableListReport', () => {
  let element: PlausableListReport;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-list-report></pl-list-report>
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
  // - getExternalLink()
  // - fetchData()
  // - renderListItem()
  // - renderList()
});
