/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { AcActivities } from '../ac-activities.js';
import '../ac-activities.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcActivities', () => {
  let element: AcActivities;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const point = {
      id: 1,
      created_at: new Date(),
      counter_quality_up: 3,
      counter_quality_down: 2,
      content: 'Betri-Alexander',
      value: 1,
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

    const activity = {
        type: 'LEXO',
        created_at: new Date(),
        domain_id: 2,
        User: {
          id: 1,
          name: 'Lexer'
        },
        Post: post,
        Point: point,
    } as AcActivityData

    const activities = [activity, activity, activity]

    const recommendedPost = {
      id: 1,
      location:{
          latitude: 2,
          longitude: 3
      },
      name: 'Robert',
      group_id: 1,
      description: 'Post-Test',
      counter_endorsements_up: 2,
      counter_endorsements_down: 4,
      counter_points: 5,
      Group: {
        id: 1,
        name: 'Alex',
        community_id: 1,
        counter_points: 1,
        counter_users: 2,
        counter_posts: 1,
        configuration: {
        makeMapViewDefault: false
        }
      }
    } as YpPostData;

    const recommendedPosts = [recommendedPost, recommendedPost]
  
    element = await fixture(html`
      <ac-activities
       .activities="${activities}"
       .collectionId="1"
       .collectionType="group"
       .recommendedPosts="${recommendedPosts}">
      </ac-activities
      >
    `);
  });
  /*
  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
  */
});
