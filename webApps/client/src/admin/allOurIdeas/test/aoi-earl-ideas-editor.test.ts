import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AoiEarlIdeasEditor } from '../aoi-earl-ideas-editor.js';
import '../aoi-earl-ideas-editor.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('AoiEarlIdeasEditor', () => {
  let element: AoiEarlIdeasEditor;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <aoi-earl-ideas-editor></aoi-earl-ideas-editor>
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
  // - themeUpdated()
  // - socketClosed()
  // - socketError()
  // - getChoices()
  // - createGroupObserver()
});
