/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostUserImages } from '../yp-post-user-images.js';
import '../yp-post-user-images.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpPostUserImages', () => {
  let element: YpPostUserImages;
  let server: any; 

  before(async () => {
    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/images/1/user_images', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(YpTestHelpers.getPost())
    ]);
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-user-images
      
      ></yp-post-user-images>
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
