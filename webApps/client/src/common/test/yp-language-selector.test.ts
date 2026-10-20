import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpLanguageSelector } from '../languages/yp-language-selector.js';
import '../yp-language-selector.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

// TODO: This file is currently excluded from the test run because it
// fails to load (see web-test-runner.config.mjs), so any tests added to
// it won't run.
describe('YpLanguageSelector', () => {
  let element: YpLanguageSelector;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {

    element = await fixture(html`
      <yp-language-selector
      selectedLocale="en"
      ></yp-language-selector>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
