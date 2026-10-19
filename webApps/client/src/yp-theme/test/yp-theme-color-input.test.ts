import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpThemeColorInput } from '../yp-theme-color-input.js';
import '../yp-theme-color-input.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpThemeColorInput', () => {
  let element: YpThemeColorInput;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-theme-color-input></yp-theme-color-input>
    `);

    await aTimeout(100);
  });

  it('renders the component', async () => {
    expect(element).to.exist;
    expect(element.shadowRoot).to.exist;
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  // TODO: Add targeted behavior tests for:
  // - isValidHex()
  // - handleColorInput()
  // - openPalette()
  // - closePalette()
  // - handleKeyDown()
});
