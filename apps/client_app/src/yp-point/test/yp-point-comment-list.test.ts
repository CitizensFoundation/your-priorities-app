/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPointCommentList } from '../yp-point-comment-list.js';
import '../yp-point-comment-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpPointCommentList', () => {
  let element: YpPointCommentList;
  let server: any; 

  before(async () => {
    await YpTestHelpers.setupApp();
    
    const commentList = [YpTestHelpers.getPoint(), YpTestHelpers.getPoint(), YpTestHelpers.getPoint()];
    
    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/points/1/comments', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(YpTestHelpers.getPoint())
    ]);
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-point-comment-list  
      ></yp-point-comment-list>
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
