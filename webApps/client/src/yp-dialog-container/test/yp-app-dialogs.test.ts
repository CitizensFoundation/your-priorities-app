import { html, fixture, expect } from '@open-wc/testing';

import { YpAppDialogs } from '../yp-app-dialogs.js';
import '../yp-app-dialogs.js';
import { YpLogin } from '../../yp-user/yp-login.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAppDialogs', () => {
  let element: YpAppDialogs;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`<yp-app-dialogs></yp-app-dialogs>`);
  });

  it('closes wrapped dialogs through their close method', async () => {
    const dialog = await new Promise<YpLogin>((resolve) => {
      element.getDialogAsync('userLogin', resolve);
    });
    let closeCalled = false;

    dialog.close = () => {
      closeCalled = true;
    };

    element.closeDialog('userLogin');

    expect(closeCalled).to.equal(true);
  });
});
