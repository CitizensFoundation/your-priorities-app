import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-user-delete-or-anonymize.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpUserDeleteOrAnonymize', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-user-delete-or-anonymize></yp-user-delete-or-anonymize>
    `);
        await aTimeout(100);
        element.open();
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-user-delete-or-anonymize.test.js.map