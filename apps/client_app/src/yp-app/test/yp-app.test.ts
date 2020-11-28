/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

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
      <yp-app
        
      ></yp-app>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
