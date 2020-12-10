/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpAdminConfigDomain } from '../yp-admin-config-domain.js';
import '../yp-admin-config-domain.js';
import { YpTestHelpers } from '../@yrpri/common/test/setup-app.js';
import sinon from 'sinon';

describe('YpAdminConfigDomain', () => {
  let element: YpAdminConfigDomain;
  let server: any; 

  before(async () => {
    const domain = {
      id: 1,
      name: 'Betri Reykjavik Test',
      description: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
      only_admins_can_create_communities: true,
      domain_name: 'lex',
      configuration: {
        themeOverrideBackgroundColor: 'alex',
        disableNameAutoTranslation: false,
        useVideoCover: true
      }
    } as YpDomainData;

    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/domain/1', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(domain)
    ]);

    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-admin-config-domain
        .collectionId="1"
        .collectionType="domain"></yp-admin-config-domain>
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
