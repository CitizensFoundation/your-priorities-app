import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAdminTranslations } from '../yp-admin-translations.js';
import '../yp-admin-translations.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAdminTranslations', () => {
  let element: YpAdminTranslations;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-admin-translations></yp-admin-translations>
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
  // - getTranslationText()
  // - selectLanguage()
  // - openEdit()
  // - cancelEdit()
  // - saveItem()
  // - autoTranslate()
});
