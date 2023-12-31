import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-community.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpCommunity', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
        fetchMock.get('/api/communities/1', YpTestHelpers.getCommunity(), YpTestHelpers.fetchMockConfig);
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-community
        collectionId="1"
      ></yp-community>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-community.test.js.map