/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpAutoTranslateDialog} from '../yp-autotranslate-dialog.js';
import '../yp-autotranslate-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAutoTranslateDialog', () => {
  let element: YpAutoTranslateDialog;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const translate = {
      confirmationText: 'Good-morning'
    } 

    element = await fixture(html`
      <yp-autotranslate-dialog
        confirmationText="ALEXOSS">
      </yp-autotranslate-dialog>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
