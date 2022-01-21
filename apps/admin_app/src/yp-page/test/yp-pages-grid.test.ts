/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpPagesGrid } from '../yp-pages-grid.js';
import '../yp-pages-grid.js';
import { YpTestHelpers } from '../../@yrpri/common/test/setup-app.js';


describe('YpPagesGrid', () => {
  let element: YpPagesGrid;

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
      <yp-pages-grid
        .page="${page}"
      ></yp-pages-grid>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
