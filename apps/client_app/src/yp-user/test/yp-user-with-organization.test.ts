/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

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
    const user = {
        id: 1,
        name: 'YURR'
      } as YpUserData

    element = await fixture(html`
      <yp-user-with-organization
        .user="${user}">
      </yp-user-with-organization>
    `);
  });
  
  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
  after(async () => {
    server.restore();
  });
});
