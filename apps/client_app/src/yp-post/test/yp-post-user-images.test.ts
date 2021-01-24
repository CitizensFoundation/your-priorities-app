/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostUserImages } from '../yp-post-user-images.js';
import '../yp-post-user-images.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostUserImages', () => {
  let element: YpPostUserImages;
  let fetchMock: any; 

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();

    fetchMock.get('/api/images/1/user_images',YpTestHelpers.getPost(), YpTestHelpers.fetchMockConfig);    
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-user-images
      
      ></yp-post-user-images>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
