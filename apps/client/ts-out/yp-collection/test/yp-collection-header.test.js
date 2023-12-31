import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-collection-header.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpCollectionHeader', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        const collectionType = 'domain';
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-collection-header
        .collection="${YpTestHelpers.getDomain()}"
        .collectionType="${collectionType}"></yp-collection-header>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-collection-header.test.js.map