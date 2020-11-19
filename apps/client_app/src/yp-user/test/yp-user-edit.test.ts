/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpUserEdit } from '../yp-user-edit.js';
import '../yp-user-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpUserEdit', () => {
  let element: YpUserEdit;
  let server: any;

  before(async () => {
    server = sinon.fakeServer.create();

    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const settings = {
      my_posts: {
        method: 3,
        frequency: 1,
      },

      my_posts_endorsements: {
        method: 3,
        frequency: 1,
      },

      my_points: {
        method: 3,
        frequency: 1,
      },

      my_points_endorsements: {
        method: 3,
        frequency: 1,
      },

      all_community: {
        method: 3,
        frequency: 1,
      },

      all_group: {
        method: 3,
        frequency: 1,
      },

      newsletter: {
        method: 3,
        frequency: 1,
      },
    } as AcNotificationSettingsData;

    const user = {
      id: 1,
      name: 'YURR',
    } as YpUserData;

    element = await fixture(html`
      <yp-user-edit .settings="${settings}" .user="${user}"></yp-user-edit>
    `);
    element.open(true, { id: 1 });
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
  
  after(async () => {
    server.restore();
  });
});
