import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostEdit } from '../yp-post-edit.js';
import '../yp-post-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostEdit', () => {
  let element: YpPostEdit;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-post-edit
        .group="${YpTestHelpers.getGroup()}"
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-edit>
    `);
    await aTimeout(100);
    element.open(true, {})
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });

  it('uses native email validation for the contact email field', async () => {
    element.group = {
      ...YpTestHelpers.getGroup(),
      configuration: {
        ...YpTestHelpers.getGroup().configuration,
        moreContactInformation: true,
      },
    };
    await element.updateComplete;

    const emailField = element.shadowRoot!.querySelector('#contactEmail');
    expect(emailField?.getAttribute('type')).to.equal('email');
  });

  it('clears saved survey answers before opening a fresh idea form', async () => {
    const originalUser = window.appUser.user;
    const originalStructuredAnswersJson = element.structuredAnswersJson;
    const group = YpTestHelpers.getGroup();
    window.appUser.user = YpTestHelpers.getUser();
    element.group = group;
    element.new = true;
    element.newPost = true;
    element.structuredAnswersJson = '';

    const storageKey = `yp-survey-response-v2-for-${group.id}-${window.appUser.user.id}`;
    localStorage.setItem(storageKey, JSON.stringify('[{"uniqueId":"old","value":"old answer"}]'));

    try {
      element.setupAfterOpen({ group } as YpEditFormParams);
      await aTimeout(20);

      expect(localStorage.getItem(storageKey)).to.be.null;
      expect(element.structuredAnswersJson).to.equal('');
    } finally {
      localStorage.removeItem(storageKey);
      window.appUser.user = originalUser;
      element.structuredAnswersJson = originalStructuredAnswersJson;
    }
  });
});

describe('YpPostEdit thank you screen', () => {
  let element: YpPostEdit;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-post-edit
        .group="${YpTestHelpers.getGroup()}"
        .post="${YpTestHelpers.getPost()}"
        newPost
      ></yp-post-edit>
    `);
    await aTimeout(100);
  });

  it('shows a thank you message with actions after a new post submission', async () => {
    element.submissionCompleted = true;
    element.thankYouMessage = 'Thank you for adding content';
    await element.updateComplete;

    const thankYouMessage = element.shadowRoot!.querySelector('.thankYouMessage');
    expect(thankYouMessage).to.exist;
    expect(thankYouMessage!.textContent).to.contain('Thank you for adding content');

    const buttons = element.shadowRoot!.querySelectorAll(
      '.thankYouActions md-filled-button, .thankYouActions md-outlined-button'
    );
    expect(buttons.length).to.equal(2);

    await expect(element).shadowDom.to.be.accessible();
  });

  it('returns to the form when submitting another idea, without leftover content', async () => {
    element.submissionCompleted = true;
    element.thankYouMessage = 'Thank you for adding content';
    const group = YpTestHelpers.getGroup();
    const question = {
      uniqueId: 'question-1',
      text: 'What should change?',
      type: 'textField',
      value: 'Previous answer',
    } as YpStructuredQuestionData;
    group.configuration.structuredQuestionsJson = [question];
    element.group = group;
    element.newPost = true;
    element.post = { ...YpTestHelpers.getPost(), name: 'Submitted idea name' };
    (element as any)._setupStructuredQuestions();
    element.initialStructuredAnswersJson = [
      { uniqueId: 'question-1', value: 'Previous answer' } as YpStructuredAnswer,
    ];
    await element.updateComplete;

    (element as any)._submitAnotherIdea();
    await element.updateComplete;

    expect(element.submissionCompleted).to.be.false;
    expect(element.shadowRoot!.querySelector('.thankYouMessage')).to.not.exist;
    expect(element.post?.name).to.equal('');
    expect(element.initialStructuredAnswersJson).to.be.undefined;
    expect(element.structuredQuestions?.[0].value).to.be.undefined;
    expect(group.configuration.structuredQuestionsJson?.[0].value).to.equal(
      'Previous answer'
    );
  });

  it('does not clear the thank you state as a side effect of clear() (e.g. right after a successful submission)', async () => {
    element.submissionCompleted = true;
    element.thankYouMessage = 'Thank you for adding content';
    await element.updateComplete;

    element.clear();
    await element.updateComplete;

    expect(element.submissionCompleted).to.be.true;
    expect(element.thankYouMessage).to.equal('Thank you for adding content');
  });

  it('resets the thank you state when the component reconnects, e.g. navigating away and back', async () => {
    element.submissionCompleted = true;
    element.thankYouMessage = 'Thank you for adding content';
    element.disableDialog = true;
    await element.updateComplete;

    element.connectedCallback();

    expect(element.submissionCompleted).to.be.false;
    expect(element.thankYouMessage).to.be.undefined;
  });

  it('shows the thank you screen after the full successful-submission response chain (customRedirect then clear)', async () => {
    const post = { ...YpTestHelpers.getPost(), id: 999, name: 'New idea' };

    (element as any).customRedirect(post);
    element.clear();
    await element.updateComplete;

    expect(element.submissionCompleted).to.be.true;
    expect(element.shadowRoot!.querySelector('.thankYouMessage')).to.exist;
  });

  it('resets submitDisabled, validationErrorMessage and structured answers via clear(), e.g. on reconnect', async () => {
    element.submitDisabled = true;
    element.validationErrorMessage = 'Some previous error';
    element.structuredAnswersJson = '[{"foo":"bar"}]';
    element.structuredAnswersString = 'foo';
    await element.updateComplete;

    element.clear();
    await element.updateComplete;

    expect(element.submitDisabled).to.be.false;
    expect(element.validationErrorMessage).to.be.undefined;
    expect(element.structuredAnswersJson).to.equal('');
    expect(element.structuredAnswersString).to.equal('');
  });

  it('does not accumulate the submit action url across repeated submissions', async () => {
    element.params = { groupId: 1 };
    const form = element.shadowRoot!.querySelector('#form') as any;
    form.validate = () => true;
    form.submit = () => {};

    await element.submit();
    expect(element.action).to.equal('/posts/1');

    await element.submit();
    expect(element.action).to.equal('/posts/1');
  });
});
