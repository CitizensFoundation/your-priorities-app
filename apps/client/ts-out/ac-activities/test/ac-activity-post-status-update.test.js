import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../ac-activity-post-status-update.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('AcActivityPostStatusUpdate', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        const activity = {
            type: 'activity.post.status.change',
            created_at: new Date().toISOString(),
            domain_id: 2,
            Point: YpTestHelpers.getPoint(),
            Post: YpTestHelpers.getPost(),
            User: YpTestHelpers.getUser(),
            PostStatusChange: {
                content: "blar",
                language: "en"
            }
        };
        element = await fixture(html `
    ${YpTestHelpers.renderCommonHeader()}
      <ac-activity-post-status-update
       .activity="${activity}">
      </ac-activity-post-status-update
      >
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=ac-activity-post-status-update.test.js.map