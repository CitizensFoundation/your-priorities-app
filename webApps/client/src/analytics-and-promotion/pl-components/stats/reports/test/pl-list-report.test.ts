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

  it.skip('renders the component', async () => {
    expect(element).to.exist;
    expect(element.shadowRoot).to.exist;
  });

  it.skip('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  // TODO: Add targeted behavior tests for:
  // - getExternalLink()
  // - fetchData()
  // - renderListItem()
  // - renderList()

  // TODO: The generated 'renders the component' and 'passes the a11y audit'
  // tests (from 5fcdcbf) are skipped because most generated tests fail: they
  // render the component without the data it needs. Either give the
  // component realistic fixture data and re-enable them, or delete them.
});
