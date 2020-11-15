/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpStructuredQuestionEdit } from '../yp-structured-question-edit.js';
import '../yp-structured-question-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpStructuredQuestionEdit', () => {
  let element: YpStructuredQuestionEdit;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const question = {
      text: 'ALEXO'
    } as YpStructuredQuestionData
   
    element = await fixture(html`
      <yp-structured-question-edit
        .question="${question}">
      </yp-structured-question-edit>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
