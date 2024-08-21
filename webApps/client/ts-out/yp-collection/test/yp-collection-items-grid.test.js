import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-collection-items-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpCollectionItemsList', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        const collectionType = 'domain';
        const collectionItems = YpTestHelpers.getDomain().Communities;
        const collectionItemType = 'community';
        element = await fixture(html `
    ${YpTestHelpers.renderCommonHeader()}
      <yp-collection-items-list
        .collection="${YpTestHelpers.getDomain()}"
        .collectionItems="${collectionItems}"
        .collectionType="${collectionType}"
        .collectionItemType="${collectionItemType}">
        </yp-collection-items-list>
    `);
        await aTimeout(1000);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-collection-items-grid.test.js.map