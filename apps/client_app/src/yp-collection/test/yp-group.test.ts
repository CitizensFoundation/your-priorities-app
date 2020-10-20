/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpGroup } from '../yp-group.js';
import '../yp-group.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpGroup', () => {
  let element: YpGroup;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const collectionType = 'group';

    const group = {
      id: 1,
      name: 'Betri Reykjavik Test',
      objectives: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
    } as YpGroupData;

    element = await fixture(html`
      <yp-group
        .collection="${group}"
        .collectionType="${collectionType}"></yp-group>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
