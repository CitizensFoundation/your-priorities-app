/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpCommunity } from '../yp-community.js';
import '../yp-community.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon'; 

describe('YpCommunity', () => {
  let element: YpCommunity;
  let server: any; 

  before(async () => {
    const community = {
      id: 1,
      name: 'Betri Reykjavik Test',
      description: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
      configuration: {

      },
      Groups: [
        {
          id: 1,
          name: 'Betri Reykjavik Test',
          objectives: '',
          counter_posts: 10,
          counter_points: 11,
          counter_users: 12,
          configuration: {
          }
        } as YpGroupData 
      ]
    } as YpCommunityData;

    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/community/1', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(community)
    ]);

    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-community
        
      ></yp-community>
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
