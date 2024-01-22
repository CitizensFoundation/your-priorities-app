import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-domain.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpDomain', () => {
    let element;
    let fetchMock;
    before(async () => {
        await YpTestHelpers.setupApp();
        fetchMock = YpTestHelpers.getFetchMock();
        fetchMock.get('/api/domains/1', YpTestHelpers.getDomain(), YpTestHelpers.fetchMockConfig);
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-domain
        collectionId="1">
      </yp-domain>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-domain.test.js.map