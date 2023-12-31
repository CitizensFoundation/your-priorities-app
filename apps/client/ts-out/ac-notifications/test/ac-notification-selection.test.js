import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../ac-notification-selection.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('AcNotificationSelection', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        const settings = {
            method: 1,
            frequency: 2,
        };
        element = await fixture(html `
        ${YpTestHelpers.renderCommonHeader()}
        <ac-notification-selection
          .settings="${settings}"
        ></ac-notification-selection>
      `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=ac-notification-selection.test.js.map