import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-post-transcript.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpPostTranscript', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-transcript
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-transcript>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-post-transcript.test.js.map