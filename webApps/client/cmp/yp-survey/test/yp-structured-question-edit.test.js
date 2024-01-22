import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../yp-structured-question-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
describe('YpStructuredQuestionEdit', () => {
    let element;
    let fetchMock;
    before(async () => {
        fetchMock = YpTestHelpers.getFetchMock();
        await YpTestHelpers.setupApp();
    });
    beforeEach(async () => {
        const question = {
            text: 'ALEXO'
        };
        element = await fixture(html `
      ${YpTestHelpers.renderCommonHeader()}
      <yp-structured-question-edit
        .question="${question}">
      </yp-structured-question-edit>
    `);
        await aTimeout(100);
    });
    it('passes the a11y audit', async () => {
        debugger;
        await expect(element).shadowDom.to.be.accessible();
    });
});
//# sourceMappingURL=yp-structured-question-edit.test.js.map