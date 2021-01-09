/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostCoverMedia } from '../yp-post-cover-media.js';
import '../yp-post-cover-media.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostCoverMedia', () => {
  let element: YpPostCoverMedia;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-cover-media
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-cover-media>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
