import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../ac-notification-list-point.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('AcNotificationListPoint', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        const notification = {
            id: 1,
            type: 'notification.point.new',
            domain_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            AcActivities: [{
                    type: 'activity.point.new',
                    created_at: new Date().toISOString(),
                    domain_id: 2,
                    Point: YpTestHelpers.getPoint(),
                    Post: YpTestHelpers.getPost(),
                    User: YpTestHelpers.getUser()
                }]
        };
        element = await fixture(html `
        ${YpTestHelpers.renderCommonHeader()}
        <ac-notification-list-point
          .notification="${notification}"
        ></ac-notification-list-point>
      `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=ac-notification-list-point.test.js.map