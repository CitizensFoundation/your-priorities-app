import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PsOperationsManager } from '../ps-operations-manager.js';
import '../ps-operations-manager.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('PsOperationsManager', () => {
  let element: PsOperationsManager;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <ps-operations-manager></ps-operations-manager>
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
  // - getAgent()
  // - updateConnectorRegistry()
  // - addExistingConnector()
  // - fetchAgentCosts()
  // - fetchActiveAiModels()
});
