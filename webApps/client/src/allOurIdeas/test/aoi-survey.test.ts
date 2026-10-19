import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AoiSurvey } from '../aoi-survey.js';
import '../aoi-survey.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AoiSurvey', () => {
  let element: AoiSurvey;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <aoi-survey></aoi-survey>
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
  // - getEarl()
  // - scrollToCollectionItemSubClass()
  // - snackbarclosed()
  // - tabChanged()
  // - exitToMainApp()
});
