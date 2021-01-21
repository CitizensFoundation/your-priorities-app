/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostPoints } from '../yp-post-points.js';
import '../yp-post-points.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpPostPoints', () => {
  let element: YpPostPoints;
  let fetchMock: any; 
  let server: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
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
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-points
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-points>
    `);
    await aTimeout(100);
    server.respond();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  after(async () => {
    server.restore();
  });
});
