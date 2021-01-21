/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpMissingEmail } from '../yp-missing-email.js';
import '../yp-missing-email.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon'; 

describe('YpMissingEmail', () => {
  let element: YpMissingEmail;
  let fetchMock: any; 
  let server: any; 

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    server = sinon.fakeServer.create();     

    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-missing-email></yp-missing-email>
      `);
        await aTimeout(100);
    element.open(true, 'Alexman');
  });
  
  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  after(async () => {
    server.restore();
  });
});
