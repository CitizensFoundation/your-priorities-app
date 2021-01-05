/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpSurveyGroup } from '../yp-survey-group.js';
import '../yp-survey-group.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpSurveyGroup', () => {
  let element: YpSurveyGroup;
  let server: any; 

  before(async () => {
    const group = {
      id: 1,
      name: 'Betri Reykjavik Test',
      objectives: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
      configuration: {
        structuredQuestionsJson: [
          {
            type: 'textfield',
            maxLength: 100,
            text: "Whats up"
          },
          {
            type: 'textfield',
            maxLength: 300,
            text: "Whats2 up"
          },
          {
            type: 'textfield',
            maxLength: 200,
            text: "Whats1 up"
          }
        ]
      }
    } as YpGroupData;

    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/groups/1/survey', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(group)
    ]);
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
   
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-survey-group
        surveyGroupId="1">
      </yp-survey-group>
    `);
    await aTimeout(100);
    server.respond(); 
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  after(async () => {
    server.restore();
  });
});
