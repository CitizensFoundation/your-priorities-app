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

  it('renders the component', async () => {
    expect(element).to.exist;
    expect(element.shadowRoot).to.exist;
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  // TODO: Add targeted behavior tests for:
  // - regenerateChart()
  // - repositionTooltip()
  // - updateWindowDimensions()
  // - onClick()
  // - pollExportReady()
});
