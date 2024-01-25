import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-forgot-password.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpForgotPassword', () => {
    let element;
    let fetchMock;
    let server;
    before(async () => {
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-forgot-password></yp-forgot-password>
      `);
        await aTimeout(100);
        element.open({ email: "robert@citizens.is" });
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-forgot-password.test.js.map