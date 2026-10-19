import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpRegistrationQuestionsDialog } from '../yp-registration-questions-dialog.js';
import '../yp-registration-questions-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpRegistrationQuestionsDialog', () => {
  let element: YpRegistrationQuestionsDialog;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-registration-questions-dialog></yp-registration-questions-dialog>
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
  // - logout()
  // - _onEnter()
  // - _questionsUpdated()
  // - _focusFirstQuestion()
  // - _validateAndSend()
});
