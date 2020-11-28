/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpPointCommentList } from '../yp-point-comment-list.js';
import '../yp-point-comment-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpPointCommentList', () => {
  let element: YpPointCommentList;
  let server: any; 

  before(async () => {
    await YpTestHelpers.setupApp();
    const point = {
      id: 1,
      created_at: new Date(),
      counter_quality_up: 3,
      counter_quality_down: 2,
      content: 'Betri-Alexander',
      value: 1,
      PointRevisions: [
        {
          id: 1,
          content: "Blah",
          User: {
            id: 1,
            email: "blah@blah.is",
            name: "bluh"
          }
        }
      ],
    } as YpPointData;

    const commentList = [point, point, point];
    
    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/points/1/comments', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(point)
    ]);
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-point-comment-list  
      ></yp-point-comment-list>
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
