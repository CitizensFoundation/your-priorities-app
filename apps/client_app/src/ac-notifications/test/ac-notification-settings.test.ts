/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AcNotificationSettings } from '../ac-notification-settings.js';
import '../ac-notification-settings.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcNotificationSettings', () => {
  let element: AcNotificationSettings;
  
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

        my_points_endorsements:{   
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
        }
      } as AcNotificationSettingsData

      element = await fixture(html`
        ${YpTestHelpers.renderCommonHeader()}
        <ac-notification-settings
          .settings="${settings}"
        ></ac-notification-settings>
      `);
      await aTimeout(100);
    });
  
    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });