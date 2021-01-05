/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AcNotificationList } from '../ac-notification-list.js';
import '../ac-notification-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcNotificationList', () => {
  let element: AcNotificationList;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();

    const notification =  {
      id: 1,
      domain_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      type: 'notification.point.new',
      AcActivities: [{
        type: 'activity.point.new',
        created_at: new Date(),
        domain_id: 2,
        User: {
          id: 1,
          name: 'Lex'
        }
      }]
    } as AcNotificationData;
  
    const notificationList = [notification, notification, notification];

    fetchMock.get('/api/notification',{ notifications: notificationList }, YpTestHelpers.fetchMockConfig);
  });

  const user = {
    id: 1,
    name: 'YURR'
  } as YpUserData
  
  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <ac-notification-list
        .user="${user}"
      ></ac-notification-list>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });

  after(async () => {
  });
});