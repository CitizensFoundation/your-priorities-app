import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpImage } from '../yp-image.js';
import '../yp-image.js';
import { YpTestHelpers } from './setup-app.js';

describe('YpImage', () => {
  let element: YpImage;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-image></yp-image>
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
  // - _imgOnLoad()
  // - _imgOnError()
  // - _computePlaceholderClassName()
  // - _widthChanged()
  // - _heightChanged()
});
