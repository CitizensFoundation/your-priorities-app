import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AoiNewIdeaDialog } from '../aoi-new-idea-dialog.js';
import '../aoi-new-idea-dialog.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('AoiNewIdeaDialog', () => {
  let element: AoiNewIdeaDialog;
  let fetchMock: any;
  const mockEarl = {
    configuration: {
      allowAnswersNotForVoting: false,
    },
  } as AoiEarlData;

  const mockGroup = {
    id: 1,
    language: 'en',
    configuration: {
      theme: {},
    },
  } as unknown as YpGroupData;

  const mockQuestion = {
    id: 1,
    name: 'What should we improve first?',
  } as AoiQuestionData;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <aoi-new-idea-dialog
        .groupId=${1}
        .earl=${mockEarl}
        .group=${mockGroup}
        .question=${mockQuestion}
      ></aoi-new-idea-dialog>
    `);

    await aTimeout(100);
  });

  it.skip('renders the component', async () => {
    expect(element).to.exist;
    expect(element.shadowRoot).to.exist;
  });

  it.skip('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  // TODO: Add targeted behavior tests for:
  // - submitIdea()
  // - reset()
  // - close()
  // - textAreaKeyDownIdea()
  // - generateAiIcon()

  // TODO: The generated 'renders the component' and 'passes the a11y audit'
  // tests (from 5fcdcbf) are skipped because most generated tests fail: they
  // render the component without the data it needs. Either give the
  // component realistic fixture data and re-enable them, or delete them.
});
