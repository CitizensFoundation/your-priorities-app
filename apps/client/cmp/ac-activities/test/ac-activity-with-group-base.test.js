import { html, fixture, expect } from '@open-wc/testing';
import '../ac-activity-with-group-base.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('AcActivityWithGroupBase', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        const activity = {
            type: 'LEXO',
            created_at: new Date().toISOString(),
            domain_id: 2,
            Point: YpTestHelpers.getPoint(),
            Post: YpTestHelpers.getPost(),
            User: YpTestHelpers.getUser(),
        };
        element = await fixture(html `
      <ac-activity-with-group-base
        .activity="${activity}">
      </ac-activity-with-group-base
      >
    `);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=ac-activity-with-group-base.test.js.map