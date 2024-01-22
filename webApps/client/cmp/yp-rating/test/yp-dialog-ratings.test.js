import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-dialog-ratings.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpDialogRatings', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
        fetchMock.post('/api/ratings/1/0', {}, YpTestHelpers.fetchMockConfig);
        fetchMock.delete('/api/ratings/1/0', {}, YpTestHelpers.fetchMockConfig);
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-dialog-ratings
        .post="${YpTestHelpers.getPost()}"
      ></yp-dialog-ratings>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-dialog-ratings.test.js.map