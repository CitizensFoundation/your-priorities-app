import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-point-comment.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpPointComment', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-point-comment
        .point="${YpTestHelpers.getPoint()}"
      ></yp-point-comment>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-point-comment.test.js.map