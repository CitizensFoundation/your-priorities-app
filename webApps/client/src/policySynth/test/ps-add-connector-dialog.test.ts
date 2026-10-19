import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PsAddConnectorDialog } from '../ps-add-connector-dialog.js';
import '../ps-add-connector-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('PsAddConnectorDialog', () => {
  let element: PsAddConnectorDialog;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <ps-add-connector-dialog></ps-add-connector-dialog>
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
  // - fetchActiveConnectorClasses()
  // - disableScrim()
  // - _handleNameInput()
  // - _handleConnectorClassSelection()
  // - _handleClose()
  // - _handleAddConnector()
});
