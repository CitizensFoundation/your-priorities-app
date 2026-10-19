import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpForm } from '../yp-form.js';
import '../yp-form.js';
import { YpTestHelpers } from './setup-app.js';

describe('YpForm', () => {
  let element: YpForm;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-form></yp-form>
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
  // - _formError()
  // - _init()
  // - saveResetValues()
  // - _saveInitialValues()
  // - validate()
});
