import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-missing-email.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpMissingEmail', () => {
    let element;
    let fetchMock;
    let server;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-missing-email></yp-missing-email>
      `);
        await aTimeout(100);
        element.open(true, 'Alexman');
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-missing-email.test.js.map