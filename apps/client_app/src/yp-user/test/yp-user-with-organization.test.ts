/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpUserWithOrganization } from '../yp-user-with-organization.js';
import '../yp-user-with-organization.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpUserWithOrganization', () => {
  let element: YpUserWithOrganization;
  let server: any;

  before(async () => {
    server = sinon.fakeServer.create();

    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-user-with-organization
        .user="${YpTestHelpers.getUser()}">
      </yp-user-with-organization>
    `);
    await aTimeout(100);
  });
  
  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
  after(async () => {
    server.restore();
  });
});
