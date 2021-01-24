/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCommunity } from '../yp-community.js';
import '../yp-community.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpCommunity', () => {
  let element: YpCommunity;
  let server: any;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();

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
      ${YpTestHelpers.renderCommonHeader()}
      <yp-community

      ></yp-community>
    `);
    await aTimeout(100);
    server.respond();
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });

  after(async () => {
    server.restore();
  });
});
