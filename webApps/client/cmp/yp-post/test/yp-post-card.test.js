import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-post-card.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpPostCard', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-card
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-card>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-post-card.test.js.map