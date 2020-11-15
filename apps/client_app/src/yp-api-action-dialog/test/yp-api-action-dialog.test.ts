/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpApiActionDialog } from '../yp-api-action-dialog.js';
import '../yp-api-action-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpApiActionDialog', () => {
  let element: YpApiActionDialog;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-api-action-dialog
        confirmationText="good morning">
      </yp-api-action-dialog>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
