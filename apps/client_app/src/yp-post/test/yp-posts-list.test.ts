/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpPostsList } from '../yp-posts-list.js';
import '../yp-posts-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpPostslist', () => {
  let element: YpPostsList;
  let server: any;

  before(async () => {
    const posts = [
      {
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
      },
      {
        id: 2,
        location:{
          latitude: 2,
          longitude: 3,
        },
        name: 'Robert 2',
        group_id: 1,
        description: 'Post-Test',
        counter_endorsements_up: 2,
        counter_endorsements_down: 4,
        counter_points: 5,
      },
      {
        id: 3,
        location:{
          latitude: 2,
          longitude: 3,
        },
        name: 'Robert 3',
        group_id: 1,
        description: 'Post-Test',
        counter_endorsements_up: 2,
        counter_endorsements_down: 4,
        counter_points: 5,
      },
    ] as Array<YpPostData>
    
    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/groups/1/posts/newest/null/open?offset=0', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(posts)
    ]);
    await YpTestHelpers.setupApp();
  });

    beforeEach(async () => {
      const group = {
        id: 1,
        name: 'Alex',
        community_id: 1,
        counter_points: 1,
        counter_users: 2,
        counter_posts: 1,
        configuration: {
          makeMapViewDefault: false
        }
      } as YpGroupData;
      
      element = await fixture(html`
        <yp-posts-list
          .group="${group}"
        ></yp-posts-list>
      `);
      server.respond();
    });
  
    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
    after(async () => {
      server.retore();
    });
  });