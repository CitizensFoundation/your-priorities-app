/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpMagicTextDialog } from '../yp-magic-text-dialog.js';
import '../yp-magic-text-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpMagicTextDialog', () => {
  let element: YpMagicTextDialog;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-magic-text-dialog
        content='ALXOEz'>
      </yp-magic-text-dialog>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
