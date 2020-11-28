/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpLanguageSelector } from '../yp-language-selector.js';
import '../yp-language-selector.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpLanguageSelector', () => {
  let element: YpLanguageSelector;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
  
    element = await fixture(html`
      <yp-language-selector
        
      ></yp-language-selector>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
