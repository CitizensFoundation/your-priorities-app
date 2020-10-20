/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpPostActions } from '../yp-post-actions.js';
import '../yp-post-actions.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';


describe('YpPostActions', () => {
  let element: YpPostActions;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const post = {
    } as YpPointData;


    element = await fixture(html`
      <yp-post-actions
        .post="${post}"
      ></yp-post-actions->
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
