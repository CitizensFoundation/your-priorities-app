import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-confirmation-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpConfirmationDialog', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-confirmation-dialog
        confirmationText="good morning">
      </yp-confirmation-dialog>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-confirmation-dialog.test.js.map