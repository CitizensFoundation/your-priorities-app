import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-magic-text-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpMagicTextDialog', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-magic-text-dialog
        content='ALXOEz'>
      </yp-magic-text-dialog>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-magic-text-dialog.test.js.map