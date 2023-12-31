import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-user-image.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpUserImage', () => {
    let element;
    let fetchMock;
    let server;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-user-image .user="${YpTestHelpers.getUser()}"></yp-user-image>
      `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-user-image.test.js.map