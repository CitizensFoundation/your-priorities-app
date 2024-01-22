import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-page-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpPageDialog', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        const page = {
            id: 1,
            content: { "en": "Blah" },
            title: { "en": "blur" },
        };
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-page-dialog
      .page="${page}">
      </yp-page-dialog>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-page-dialog.test.js.map