/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpUserEdit } from '../yp-user-edit.js';
import '../yp-user-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('YpUserEdit', () => {
  let element: YpUserEdit;
  let fetchMock: any; 
  let server: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
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

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-user-edit .settings="${settings}" .user="${YpTestHelpers.getUser()}"></yp-user-edit>
    `);
    await aTimeout(100);
    element.open(true, { id: 1 });
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
  
  after(async () => {
    server.restore();
  });
});
