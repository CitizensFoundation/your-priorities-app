/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpMagicText } from '../yp-magic-text.js';
import '../yp-magic-text.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpMagicText', () => {
  let element: YpMagicText;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-magic-text
        content='ALXOE'>
      </yp-magic-text>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
