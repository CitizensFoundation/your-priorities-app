/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpSetVideoCover } from '../yp-set-video-cover.js';
import '../yp-set-video-cover.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpSetVideoCover', () => {
  let element: YpSetVideoCover;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const video = {
        videoId: 1
      } 

      element = await fixture(html`
        <yp-set-video-cover
          .video="${video}">
        </yp-set-video-cover>
      `);
    });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
