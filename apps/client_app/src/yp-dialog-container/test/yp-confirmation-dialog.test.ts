/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpConfirmationDialog} from '../yp-confirmation-dialog.js';
import '../yp-confirmation-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpConfirmationDialog', () => {
  let element: YpConfirmationDialog;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
  
    element = await fixture(html`
      <yp-confirmation-dialog
        confirmationText="good morning">
      </yp-confirmation-dialog>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
