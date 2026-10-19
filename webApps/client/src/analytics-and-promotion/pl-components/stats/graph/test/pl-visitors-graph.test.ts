import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausibleVisitorsGraph } from '../pl-visitors-graph.js';
import '../pl-visitors-graph.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausibleVisitorsGraph', () => {
  let element: PlausibleVisitorsGraph;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-visitors-graph></pl-visitors-graph>
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
  // - updateMetric()
  // - fetchGraphData()
  // - fetchTopStatData()
  // - renderInner()
});
