import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausibleLineGraph } from '../pl-line-graph.js';
import '../pl-line-graph.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausibleLineGraph', () => {
  let element: PlausibleLineGraph;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-line-graph></pl-line-graph>
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
  // - regenerateChart()
  // - repositionTooltip()
  // - updateWindowDimensions()
  // - onClick()
  // - pollExportReady()

  // TODO: The generated 'renders the component' and 'passes the a11y audit'
  // tests (from 5fcdcbf) are skipped because most generated tests fail: they
  // render the component without the data it needs. Either give the
  // component realistic fixture data and re-enable them, or delete them.
});
