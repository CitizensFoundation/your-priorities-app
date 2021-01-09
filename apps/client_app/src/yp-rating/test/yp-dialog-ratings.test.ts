/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpDialogRatings } from '../yp-dialog-ratings.js';
import '../yp-dialog-ratings.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';


describe('YpDialogRatings', () => {
  let element: YpDialogRatings;
  let server: any; 

  before(async () => {
    server = sinon.fakeServer.create();
    server.respondWith('POST', '/api/ratings/1/0', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({})
    ]);

    server.respondWith('DELETE', '/api/ratings/1/0', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({})
    ]);

    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-dialog-ratings
        .post="${YpTestHelpers.getPost()}"
      ></yp-dialog-ratings>
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
