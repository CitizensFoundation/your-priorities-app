/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpResetPassword } from '../yp-reset-password.js';
import '../yp-reset-password.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon'; 

describe('YpResetPassword', () => {
  let element: YpResetPassword;
  let server: any; 

  before(async () => {
    server = sinon.fakeServer.create();     

    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`<yp-reset-password></yp-reset-password>`);
   
    element.open('Alexos');
  });
  
  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  after(async () => {
    server.restore();
  });
});