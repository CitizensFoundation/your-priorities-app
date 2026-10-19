import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PsEditNodeDialog } from '../ps-edit-node-dialog.js';
import '../ps-edit-node-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('PsEditNodeDialog', () => {
  let element: PsEditNodeDialog;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <ps-edit-node-dialog></ps-edit-node-dialog>
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
  // - fetchActiveAiModels()
  // - initializeCurrentModels()
  // - _getCurrentModels()
  // - disableScrim()
  // - _renderNodeEditHeadline()
});
