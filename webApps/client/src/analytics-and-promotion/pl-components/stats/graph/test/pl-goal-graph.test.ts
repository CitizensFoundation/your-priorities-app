import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausibleGoalGraph } from '../pl-goal-graph.js';
import '../pl-goal-graph.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausibleGoalGraph', () => {
  let element: PlausibleGoalGraph;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-goal-graph></pl-goal-graph>
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
  // - setGraphData()
});
