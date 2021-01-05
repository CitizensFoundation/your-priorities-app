/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpUserImage } from '../yp-user-image.js';
import '../yp-user-image.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpUserImage', () => {
  let element: YpUserImage;
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
      ${YpTestHelpers.renderCommonHeader()}
      <yp-user-image .user="${user}"></yp-user-image>
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
