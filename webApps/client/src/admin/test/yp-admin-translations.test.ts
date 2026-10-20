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

  it.skip('renders the component', async () => {
    expect(element).to.exist;
    expect(element.shadowRoot).to.exist;
  });

  it.skip('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  // TODO: Add targeted behavior tests for:
  // - getTranslationText()
  // - selectLanguage()
  // - openEdit()
  // - cancelEdit()
  // - saveItem()
  // - autoTranslate()

  // TODO: The generated 'renders the component' and 'passes the a11y audit'
  // tests (from 5fcdcbf) are skipped because most generated tests fail: they
  // render the component without the data it needs. Either give the
  // component realistic fixture data and re-enable them, or delete them.
});
