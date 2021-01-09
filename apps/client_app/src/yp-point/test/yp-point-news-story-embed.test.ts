/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPointNewsStoryEmbed } from '../yp-point-news-story-embed.js';
import '../yp-point-news-story-embed.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPointNewsStoryEmbed', () => {
  let element: YpPointNewsStoryEmbed;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-point-news-story-embed
        .point="${YpTestHelpers.getPoint()}"
      ></yp-point-news-story-embed>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
