/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpFileUpload } from '../yp-file-upload.js';
import '../yp-file-upload.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpFileUpload', () => {
  let element: YpFileUpload;
  let fetchMock

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const group = {
        id: 1,
        name: 'Betri Reykjavik Test',
        objectives: '',
        counter_posts: 10,
        counter_points: 11,
        counter_users: 12,
      } as YpGroupData;

      element = await fixture(html`
        ${YpTestHelpers.renderCommonHeader()}
        <yp-file-upload
          .group="${group}">
        </yp-file-upload>
      `);
      await aTimeout(100);
    });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
