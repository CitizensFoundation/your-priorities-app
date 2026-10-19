import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PsAiModelSelector } from '../ps-ai-model-selector.js';
import '../ps-ai-model-selector.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('PsAiModelSelector', () => {
  let element: PsAiModelSelector;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <ps-ai-model-selector></ps-ai-model-selector>
    `);

    await aTimeout(100);
  });

  it('renders the component', async () => {
    expect(element).to.exist;
    expect(element.shadowRoot).to.exist;
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  // TODO: Add targeted behavior tests for:
  // - filterAiModels()
  // - filterReasoningModels()
  // - initializeSelectedModels()
  // - initializeSelectedReasoningModels()
  // - renderAiModelSelect()
});
