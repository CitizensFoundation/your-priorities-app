/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpAdminConfigCommunity } from '../yp-admin-config-community.js';
import '../yp-admin-config-community.js';
import { YpTestHelpers } from '../@yrpri/common/test/setup-app.js';
import sinon from 'sinon';

describe('YpAdminConfigCommunity', () => {
  let element: YpAdminConfigCommunity;
  let server: any; 

  before(async () => {
    const community = {
      id: 1,
      name: 'Betri Reykjavik Test',
      description: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
      only_admins_can_create_groups: true,
      configuration: {
        name: 'alex',
        number: 1,
        id: 1
      },  
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
      <yp-admin-config-community
        .collectionId="1"
        .collectionType="domain"></yp-admin-config-community>
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
