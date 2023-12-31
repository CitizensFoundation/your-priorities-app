import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-post-header.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpPostHeader', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-header
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-header>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await new Promise(resolve => setTimeout(resolve, 10000));
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-post-header.test.js.map