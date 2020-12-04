/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpThemeSelector } from '../yp-theme-selector.js';
import '../yp-theme-selector.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpThemeSelector', () => {
  let element: YpThemeSelector;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const themes = {
      disabled: true, 
      name: 'Roberto'   
    }

    const theme = [themes, themes, themes]

    element = await fixture(html`
      <yp-theme-selector
        .theme="${theme}">
      </yp-theme-selector>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});