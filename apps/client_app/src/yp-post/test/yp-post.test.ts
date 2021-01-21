/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPost } from '../yp-post.js';
import '../yp-post.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpPost', () => {
  let element: YpPost;
  let fetchMock: any; 
  let server: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/post/1', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(YpTestHelpers.getPost())
    ]);
    
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post
        collectionId="1"
      ></yp-post>
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
