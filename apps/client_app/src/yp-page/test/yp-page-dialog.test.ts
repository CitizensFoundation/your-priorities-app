/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPageDialog } from '../yp-page-dialog.js';
import '../yp-page-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPageDialog', () => {
  let element: YpPageDialog;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const page  = {
    id: 1,
    content: {"en":"Blah"},
    title: {"en":"blur"},
    } as YpHelpPageData;


    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-page-dialog
      .page="${page}">
      </yp-page-dialog>
    `);
    await aTimeout(100);
  });
  
  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
