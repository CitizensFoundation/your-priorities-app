import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PsAgentConnector } from '../ps-connector-node.js';
import '../ps-connector-node.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('PsAgentConnector', () => {
  let element: PsAgentConnector;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <ps-connector-node></ps-connector-node>
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
  // - toggleMenu()
  // - renderImage()
  // - openInternalLink()
  // - openExternalLink()
});
