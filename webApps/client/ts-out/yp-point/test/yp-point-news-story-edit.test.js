import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-point-news-story-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpPointNewsStoryEdit', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-point-news-story-edit
        .point="${YpTestHelpers.getPoint()}"
      ></yp-point-news-story-edit>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-point-news-story-edit.test.js.map