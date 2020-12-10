/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpDialogRatings } from '../yp-dialog-ratings.js';
import '../yp-dialog-ratings.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';


describe('YpDialogRatings', () => {
  let element: YpDialogRatings;
  let server: any; 

  before(async () => {
    server = sinon.fakeServer.create();
    server.respondWith('POST', '/api/ratings/1/0', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({})
    ]);

    server.respondWith('DELETE', '/api/ratings/1/0', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({})
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
      <yp-dialog-ratings
        .post="${post}"
      ></yp-dialog-ratings->
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
