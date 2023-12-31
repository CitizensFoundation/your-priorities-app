import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../ac-notification-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('AcNotificationToast', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
        ${YpTestHelpers.renderCommonHeader()}
        <ac-notification-toast
          .user="${YpTestHelpers.getUser()}"
        ></ac-notification-toast>
      `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=ac-notification-toast.test.js.map