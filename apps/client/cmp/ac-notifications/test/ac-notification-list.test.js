import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../ac-notification-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('AcNotificationList', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
        const notification = {
            id: 1,
            domain_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            type: 'notification.point.new',
            AcActivities: [{
                    type: 'activity.point.new',
                    created_at: new Date().toISOString(),
                    domain_id: 2,
                    Point: YpTestHelpers.getPoint(),
                    Post: YpTestHelpers.getPost(),
                    User: YpTestHelpers.getUser()
                }]
        };
        const notificationList = [notification, notification, notification];
        fetchMock.get('/api/notification', { notifications: notificationList }, YpTestHelpers.fetchMockConfig);
    });
    beforeEach(async () => {
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <ac-notification-list
        .user="${YpTestHelpers.getUser()}"
      ></ac-notification-list>
    `);
        await aTimeout(200);
    });
    it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
    });
    after(async () => {
    });
});
//# sourceMappingURL=ac-notification-list.test.js.map