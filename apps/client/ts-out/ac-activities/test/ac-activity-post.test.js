import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../ac-activity-post.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('AcActivityPost', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        const activity = {
            type: 'activity.post.new',
            created_at: new Date().toISOString(),
            domain_id: 2,
            Point: YpTestHelpers.getPoint(),
            Post: YpTestHelpers.getPost(),
            User: YpTestHelpers.getUser(),
        };
        element = await fixture(html `
    ${YpTestHelpers.renderCommonHeader()}
      <ac-activity-post
        .activity="${activity}">
      </ac-activity-post
      >
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=ac-activity-post.test.js.map