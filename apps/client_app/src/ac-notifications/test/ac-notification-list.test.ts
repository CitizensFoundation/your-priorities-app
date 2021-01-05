/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AcNotificationList } from '../ac-notification-list.js';
import '../ac-notification-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import sinon from 'sinon';

describe('AcNotificationList', () => {
  let element: AcNotificationList;
  let server: any; 
  
  beforeEach(async () => {
    server = sinon.fakeServer.create();
    server.respondWith('GET', '/api/notification/', [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify([notification, notification, notification])
    ]);

    await YpTestHelpers.setupApp();
  });
  
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
    server.respond();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  after(async () => {
    server.restore();
  });
});