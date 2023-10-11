/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpAdminConfigGroup } from '../yp-admin-config-group.js';
import '../yp-admin-config-group.js';
import { YpTestHelpers } from '../@yrpri/common/test/setup-app.js';
import sinon from 'sinon';

describe('YpAdminConfigGroup', () => {
  let element: YpAdminConfigGroup;
  let server: any; 

  before(async () => {
    const group = {
        id: 1,
        name: 'Betri Reykjavik Test',
        objectives: '',
        counter_posts: 10,
        counter_points: 11,
        counter_users: 12,
      } as YpGroupData;

    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/group/1', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(group)
    ]);

    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-admin-config-group
        collectionId="1"
      ></yp-admin-config-group>
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
