/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostUserImageCard } from '../yp-post-user-image-card.js';
import '../yp-post-user-image-card.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostUserImageCard', () => {
  let element: YpPostUserImageCard;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-user-image-card
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-user-image-card>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
