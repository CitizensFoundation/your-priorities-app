/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPointNewsStoryEdit } from '../yp-point-news-story-edit.js';
import '../yp-point-news-story-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPointNewsStoryEdit', () => {
  let element: YpPointNewsStoryEdit;

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
      ${YpTestHelpers.renderCommonHeader()}
      <yp-point-news-story-edit
        .point="${point}"
      ></yp-point-news-story-edit>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
