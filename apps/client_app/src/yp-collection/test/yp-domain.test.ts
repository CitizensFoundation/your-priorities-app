/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpDomain } from '../yp-domain.js';
import '../yp-domain.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpDomain', () => {
  let element: YpDomain;
  let server: any; 

  before(async () => {
    const domain = {
      id: 1,
      name: 'Betri Reykjavik Test',
      description: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
      configuration: {

      },
      Communities: [
        {
          id: 1,
          name: 'BEE',
          description: '',
          counter_posts: 10,
          counter_points: 11,
          counter_users: 12,
          configuration: {
            
          }
        } as YpCommunityData
      ]
    } as YpDomainData;
    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/domains/1', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(domain)
    ]);
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-domain
        .collectionId="1"></yp-domain>
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
