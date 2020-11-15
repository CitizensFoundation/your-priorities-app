/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpSurveyGroup } from '../yp-survey-group.js';
import '../yp-survey-group.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpSurveyGroup', () => {
  let element: YpSurveyGroup;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
   
    element = await fixture(html`
      <yp-survey-group
        .surveyGroupId="1">
      </yp-survey-group>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
