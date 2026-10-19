import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAssistantWelcome } from '../yp-assistant-welcome.js';
import '../yp-assistant-welcome.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAssistantWelcome', () => {
  let element: YpAssistantWelcome;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-assistant-welcome></yp-assistant-welcome>
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
  // - startInVoiceMode()
  // - startInTextMode()
  // - renderVoiceStartIcon()
  // - renderVoiceIconButton()
  // - renderVoiceButton()
  // - renderVoiceTalkingHead()
});
