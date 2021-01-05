/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAcceptInvite } from '../yp-accept-invite.js';
import '../yp-accept-invite.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpAcceptInvite', () => {
  let element: YpAcceptInvite;
  let server: any;

  before(async () => {
    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/users/get_invite_info/BLAH', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({
        inviteName: "robert",
        targetName: "Alexander",
        targetEmail: "robert@citizens.is",
        configuration: {}
      })
    ]);

    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()} 
      <yp-accept-invite> </yp-accept-invite>
      `);
        await aTimeout(100);
      element.open('BLAH');
      server.respond();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  after(async () => {
    server.restore();
  });
});
