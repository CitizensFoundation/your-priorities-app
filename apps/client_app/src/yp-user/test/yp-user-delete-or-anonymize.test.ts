/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpUserDeleteOrAnonymize } from '../yp-user-delete-or-anonymize.js';
import '../yp-user-delete-or-anonymize.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon'; 

describe('YpUserDeleteOrAnonymize', () => {
  let element: YpUserDeleteOrAnonymize;
  let server: any; 

  before(async () => {
    server = sinon.fakeServer.create();     

    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`<yp-user-delete-or-anonymize></yp-user-delete-or-anonymize>`);
   
    element.open();
  });
  
  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  after(async () => {
    server.restore();
  });
});
