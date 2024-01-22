import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-api-action-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpApiActionDialog', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-api-action-dialog
        confirmationText="good morning">
      </yp-api-action-dialog>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-api-action-dialog.test.js.map