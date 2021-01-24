/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpDomain } from '../yp-domain.js';
import '../yp-domain.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpDomain', () => {
  let element: YpDomain;
  let server: any; 
  let fetchMock: any;

  before(async () => {
    await YpTestHelpers.setupApp();
    fetchMock = YpTestHelpers.getFetchMock();

    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/domains/1', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(YpTestHelpers.getDomain())
    ]);
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-domain
        collectionId="1"></yp-domain>
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
