/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpMediaRecorder } from '../yp-media-recorder.js';
import '../yp-media-recorder.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpMediaRecorder', () => {
  let element: YpMediaRecorder;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const media = {
      captureCallback: function (data: any) {
          
      }
    } 

    element = await fixture(html`
      <yp-media-recorder
        .media="${media}">
      </yp-media-recorder>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
