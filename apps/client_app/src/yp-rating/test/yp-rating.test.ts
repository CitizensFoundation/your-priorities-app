/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpRating } from '../yp-rating.js';
import '../yp-rating.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpRating', () => {
  let element: YpRating;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const alexo = {
      numberOf: 5,
      postId: 1,
      emoji: 'star',
      ratingIndex: 5, 
    }

    element = await fixture(html`
      <yp-rating
        .alexo="${alexo}"
      ></yp-rating>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
