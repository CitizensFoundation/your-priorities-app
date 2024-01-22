import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-post-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpPostEdit', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-edit
        .group="${YpTestHelpers.getGroup()}"
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-edit>
    `);
        await aTimeout(100);
        element.open(true, {});
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-post-edit.test.js.map