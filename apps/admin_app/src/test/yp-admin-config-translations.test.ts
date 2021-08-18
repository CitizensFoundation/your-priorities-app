/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpAdminTranslations } from '../yp-admin-translations.js';
import '../yp-admin-config-translation.js';
import { YpTestHelpers } from '../@yrpri/common/test/setup-app.js';

describe('YpAdminConfigTranslations', () => {
  let element: YpAdminTranslations;

  before(async () => {
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
      <yp-admin-config-translations
        .group="${group}"
        collectionId="1"
        collectionType="group"
      ></yp-admin-config-translations>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
