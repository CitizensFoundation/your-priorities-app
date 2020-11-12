/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { AcNotificationList } from '../ac-notification-list.js';
import '../ac-notification-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcNotificationList', () => {
  let element: AcNotificationList;
  
    beforeEach(async () => {
      const notification =  {
        id: 1,
        type: 'ALex',
        domain_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        AcActivities: [{
          type: 'LEXI',
          created_at: new Date(),
          domain_id: 2,
          User: {
            id: 1,
            name: 'Lex'
          }
        }]
    } as AcNotificationData;

    const notifications = [notification, notification, notification]

    const user = {
      id: 1,
      name: 'YURR'
    } as YpUserData

      element = await fixture(html`
        <ac-notification-list
          .notifications="${notifications}"
          .user="${user}"

        ></ac-notification-list>
      `);
    });
  
    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });