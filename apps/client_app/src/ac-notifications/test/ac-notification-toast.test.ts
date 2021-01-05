/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AcNotificationToast } from '../ac-notification-toast.js';
import '../ac-notification-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcNotificationToast', () => {
  let element: AcNotificationToast;
  
    beforeEach(async () => {
    const user = {
      id: 1,
      name: 'YURR'
    } as YpUserData

      element = await fixture(html`
        ${YpTestHelpers.renderCommonHeader()}
        <ac-notification-toast
          .user="${user}"
        ></ac-notification-toast>
      `);
      await aTimeout(100);
    });
  
    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });