import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpFileUpload } from '../yp-file-upload.js';
import '../yp-file-upload.js';

describe('YpFileUpload', () => {
  let element: YpFileUpload;

  before(async () => {
    window.appGlobals = {
      hasLlm: false,
      locale: 'en',
      i18nTranslation: {
        t: (key: string) => key,
      },
      theme: {
        hasStaticTheme: false,
        themeDarkMode: false,
        themeHighContrast: false,
      },
      activity: () => {},
    } as any;
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-file-upload buttonText="Upload" subText="Test"> </yp-file-upload>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('replaces the previous file when replacement is enabled', async () => {
    element.replaceFilesOnSelect = true;
    element.uploadFile = async () => {};
    const firstFile = new File(['first'], 'first.png', {
      type: 'image/png',
    }) as YpUploadFileData;
    const secondFile = new File(['second'], 'second.png', {
      type: 'image/png',
    }) as YpUploadFileData;
    let firstUploadAborted = false;
    firstFile.xhr = {
      abort: () => {
        firstUploadAborted = true;
      },
    } as XMLHttpRequest;

    element._fileChange({ target: { files: [firstFile] } });
    element._fileChange({ target: { files: [secondFile] } });
    await element.updateComplete;

    expect(firstUploadAborted).to.equal(true);
    expect(element.files).to.deep.equal([secondFile]);
    expect(element.shadowRoot!.querySelectorAll('.file')).to.have.length(1);
  });

  it('keeps existing selections when replacement is disabled', async () => {
    element.uploadFile = async () => {};
    const firstFile = new File(['first'], 'first.png', {
      type: 'image/png',
    }) as YpUploadFileData;
    const secondFile = new File(['second'], 'second.png', {
      type: 'image/png',
    }) as YpUploadFileData;

    element._fileChange({ target: { files: [firstFile] } });
    element._fileChange({ target: { files: [secondFile] } });
    await element.updateComplete;

    expect(element.files).to.deep.equal([firstFile, secondFile]);
    expect(element.shadowRoot!.querySelectorAll('.file')).to.have.length(2);
  });

  it('aborts active uploads before clearing file state', () => {
    const activeFile = new File(['active'], 'active.png', {
      type: 'image/png',
    }) as YpUploadFileData;
    let uploadAborted = false;
    let completionCount = 0;
    activeFile.complete = false;
    activeFile.xhr = {
      abort: () => {
        uploadAborted = true;
      },
    } as XMLHttpRequest;
    element.files = [activeFile];
    element.addEventListener('file-upload-complete', () => {
      completionCount += 1;
    });

    element.clear(true);

    expect(uploadAborted).to.equal(true);
    expect(completionCount).to.equal(1);
    expect(element.files).to.be.empty;
  });
});
