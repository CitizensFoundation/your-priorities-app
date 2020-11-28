/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpPostPoints } from '../yp-post-points.js';
import '../yp-post-points.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpPostPoints', () => {
  let element: YpPostPoints;
  let server: any;

  before(async () => {
    const pointsResponse = {
      count: 0,
      points: [
        {
          id: 1,
          content: "okokok",
          PointRevisions: [
            {
              id: 1,
              content: "jokoko"
            } 
          ]
        },
        {
          id: 2,
          content: "oko1kok",
          PointRevisions: [
            {
              id: 2,
              content: "jok1oko"
            } 
          ]
        },
        {
          id: 3,
          content: "oko1kok",
          PointRevisions: [
            {
              id: 3,
              content: "jok1oko"
            } 
          ]
        }
      ]      
    } as YpGetPointsResponse

    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/posts/1/points', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(pointsResponse)
    ]);
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
    
    element = await fixture(html`
      <yp-post-points
        .post="${post}"
      ></yp-post-points>
    `);
    server.respond();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  after(async () => {
    server.restore();
  });
});
