/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpApp } from '../yp-app.js';
import '../yp-app.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpApp', () => {
  let element: YpApp;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
  
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-app
        
      ></yp-app>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
