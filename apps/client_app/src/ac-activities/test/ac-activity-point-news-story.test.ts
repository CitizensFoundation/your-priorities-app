/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AcActivityPointNewsStory } from '../ac-activity-point-news-story.js';
import '../ac-activity-point-news-story.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcActivityPointNewsStory', () => {
  let element: AcActivityPointNewsStory;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const post = {
      id: 1,
      location:{
        latitude: 2,
        longitude: 3,
      },
      name: 'Robert',
      group_id: 1,
      description: 'Post-Test',
      counter_endorsements_up: 2,
      counter_endorsements_down: 4,
      counter_points: 5,
      Group: {
        id: 1,
        name: 'Alexi',
        community_id: 1,
        counter_points: 1,
        counter_users: 2,
        counter_posts: 1,
        configuration: {
          makeMapViewDefault: false
        }
      }
    } as YpPostData;

    const point = {
      id: 1,
      created_at: new Date(),
      counter_quality_up: 3,
      counter_quality_down: 2,
      content: 'Betri-Alexander',
      value: 1,
      latestContent: "blah",
      PointRevisions: [
        {
          id: 1,
          content: "Blah",
          User: {
            id: 1,
            email: "blah@blah.is",
            name: "bluh"
          }
        }
      ],
    } as YpPointData;

    const activity = {
        type: 'activity.point.newsStory.new',
        created_at: new Date(),
        domain_id: 2,
        User: {
          id: 1,
          name: 'Lexer'
        },
        Point: point,
        Post: post
    } as AcActivityData

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <ac-activity-point-news-story
        .activity="${activity}">
      </ac-activity-point-news-story
      >
    `);
    await aTimeout(100);
  });
  
  it('passes the a11y audit', async () => {
   
    await expect(element).shadowDom.to.be.accessible();
  });
});
