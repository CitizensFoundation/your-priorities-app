/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpPointNewsStoryEmbed } from '../yp-point-news-story-embed.js';
import '../yp-point-news-story-embed.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPointNewsStoryEmbed', () => {
  let element: YpPointNewsStoryEmbed;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const point = {
      id: 1,
      created_at: new Date(),
      counter_quality_up: 3,
      counter_quality_down: 2,
      content: 'Betri-Alexander',
      value: 1,
      PointRevisions: [
        {
          id: 1,
          content: "Blah",
          User: {
            id: 1,
            email: "blah@blah.is",
            name: "bluh"
          }
        }
      ],
    } as YpPointData;

    element = await fixture(html`
      <yp-point-news-story-embed
        .point="${point}"
      ></yp-point-news-story-embed>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
