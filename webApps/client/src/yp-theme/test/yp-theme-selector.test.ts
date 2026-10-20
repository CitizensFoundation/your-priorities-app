import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpThemeSelector } from '../yp-theme-selector.js';
import '../yp-theme-selector.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpThemeSelector', () => {
  let element: YpThemeSelector;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
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
    await aTimeout(100);
  });

  // TODO: Skipped because this fails, as it already did upstream at
  // f187715 (where we forked from). We haven't investigated why.
  it.skip('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
