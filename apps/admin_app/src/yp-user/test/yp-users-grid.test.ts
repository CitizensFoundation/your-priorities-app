/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpUsersGrid } from '../yp-users-grid.js';
import '../yp-users-grid.js';
import { YpTestHelpers } from '../../@yrpri/common/test/setup-app.js';


describe('YpUsersGrid', () => {
  let element: YpUsersGrid;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const user = {
        id: 1,
        name: 'YURR'
      } as YpUserData

      const users = [user, user, user]

    element = await fixture(html`
      <yp-users-grid
        .user="${user}"
        .users="${users}"
      ></yp-users-grid>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
