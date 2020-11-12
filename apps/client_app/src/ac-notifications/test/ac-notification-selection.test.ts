/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { AcNotificationSelection } from '../ac-notification-selection.js';
import '../ac-notification-selection.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcNotificationSelection', () => {
  let element: AcNotificationSelection;
  
    beforeEach(async () => {
      const settings = {
        method: 1,
        frequency: 2,
      } as AcNotificationSettingsDataItem

      element = await fixture(html`
        <ac-notification-selection
          .settings="${settings}"
        ></ac-notification-selection>
      `);
    });
  
    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });