import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-post-user-images.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpPostUserImages', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
        fetchMock.get('/api/images/1/user_images', YpTestHelpers.getImages(), YpTestHelpers.fetchMockConfig);
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-user-images
      .post="${YpTestHelpers.getPost()}"
      ></yp-post-user-images>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-post-user-images.test.js.map