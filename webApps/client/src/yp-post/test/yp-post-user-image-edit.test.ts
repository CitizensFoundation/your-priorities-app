import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostUserImageEdit } from '../yp-post-user-image-edit.js';
import '../yp-post-user-image-edit.js';
import { YpEditDialog } from '../../yp-edit-dialog/yp-edit-dialog.js';
import { TextField } from '@material/web/textfield/internal/text-field.js';
import { YpImage } from '../../common/yp-image.js';
import { YpFileUpload } from '../../yp-file-upload/yp-file-upload.js';

describe('YpPostUserImageEdit', () => {
  let element: YpPostUserImageEdit;
  const testImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

  const getPost = () =>
    ({
      id: 1,
      name: 'Test post',
      description: 'Post description',
      group_id: 1,
    }) as YpPostData;

  const getImage = () =>
    ({
      id: 2,
      description: 'Image description',
      photographer_name: 'Photographer',
      formats: JSON.stringify([testImageUrl]),
    }) as YpImageData;

  before(async () => {
    window.appGlobals = {
      hasLlm: false,
      locale: 'en',
      i18nTranslation: {
        t: (key: string) =>
          ({
            'post.formInvalid': 'Complete filling out the form',
            'post.newPhoto': 'New photo',
            'post.photoUpdate': 'Update photo',
            'post.photographerName': 'Photographer',
            'post.description': 'Description',
            'image.upload': 'Upload image',
            create: 'Create',
            update: 'Update',
          })[key] || key,
      },
      theme: {
        hasStaticTheme: false,
        themeDarkMode: false,
        themeHighContrast: false,
      },
      activity: () => {},
    } as any;
    window.serverApi = {
      submitForm: async () => ({}),
    } as any;
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-post-user-image-edit></yp-post-user-image-edit>
    `);
    element.setup(getPost(), undefined, true, () => {});
    element.params = { postId: 1, userImages: true };
    await element.updateComplete;
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('renders the photographer and required description as sibling fields', () => {
    const photographer = element.shadowRoot!.querySelector('#photographerName');
    const description = element.shadowRoot!.querySelector(
      '#description'
    ) as TextField;
    const dialog = element.shadowRoot!.querySelector(
      '#editDialog'
    ) as YpEditDialog;

    expect(photographer).to.exist;
    expect(description).to.exist;
    expect(photographer!.parentElement).to.equal(description.parentElement);
    expect(description.required).to.equal(true);
    expect(dialog.heading).to.equal('New photo');
  });

  it('shows the processed image after upload', async () => {
    const response = {
      id: 42,
      formats: JSON.stringify([testImageUrl]),
    };

    element._imageUploaded(
      new CustomEvent('success', {
        detail: { xhr: { response: JSON.stringify(response) } },
      })
    );
    await element.updateComplete;

    const preview = element.shadowRoot!.querySelector(
      'yp-image.imagePreview'
    ) as YpImage;
    expect(element.uploadedPostUserImageId).to.equal(42);
    expect(element.imagePreviewUrl).to.equal(testImageUrl);
    expect(preview).to.exist;
    expect(preview.src).to.equal(testImageUrl);
  });

  it('does not submit until the required description is filled in', async () => {
    const dialog = element.shadowRoot!.querySelector(
      '#editDialog'
    ) as YpEditDialog;
    const originalSubmitForm = window.serverApi.submitForm;
    let submitCount = 0;
    window.serverApi.submitForm = async (...args) => {
      submitCount += 1;
      return originalSubmitForm.apply(window.serverApi, args);
    };

    try {
      element.uploadedPostUserImageId = 42;
      await element.updateComplete;
      dialog.submit();
      await aTimeout(50);
      expect(submitCount).to.equal(0);
    } finally {
      window.serverApi.submitForm = originalSubmitForm;
    }
  });

  it('requires an uploaded image when creating a new photo', async () => {
    const dialog = element.shadowRoot!.querySelector(
      '#editDialog'
    ) as YpEditDialog;
    const description = element.shadowRoot!.querySelector(
      '#description'
    ) as TextField;
    const originalSubmitForm = window.serverApi.submitForm;
    let submitCount = 0;
    window.serverApi.submitForm = async () => {
      submitCount += 1;
      return {};
    };

    try {
      description.value = 'A useful description';
      dialog.submit();
      await aTimeout(50);

      expect(submitCount).to.equal(0);
      expect(element.imageMissing).to.equal(true);
    } finally {
      window.serverApi.submitForm = originalSubmitForm;
    }
  });

  it('aborts an active upload when the dialog is reused', async () => {
    const uploader = element.shadowRoot!.querySelector(
      '#imageFileUpload'
    ) as YpFileUpload;
    const dialog = element.shadowRoot!.querySelector(
      '#editDialog'
    ) as YpEditDialog;
    const activeFile = new File(['active'], 'active.png', {
      type: 'image/png',
    }) as YpUploadFileData;
    let uploadAborted = false;
    activeFile.complete = false;
    activeFile.xhr = {
      abort: () => {
        uploadAborted = true;
      },
    } as XMLHttpRequest;
    uploader.files = [activeFile];
    uploader.dispatchEvent(
      new CustomEvent('file-upload-starting', {
        bubbles: true,
        composed: true,
      })
    );
    expect(dialog.uploadingState).to.equal(true);

    element.setup(getPost(), undefined, true, () => {});
    await element.updateComplete;

    expect(uploadAborted).to.equal(true);
    expect(uploader.files).to.be.empty;
    expect(dialog.uploadingState).to.equal(false);
  });

  it(
    'submits uploaded image metadata to the post user-images endpoint',
    async () => {
      const dialog = element.shadowRoot!.querySelector(
        '#editDialog'
      ) as YpEditDialog;
      const description = element.shadowRoot!.querySelector(
        '#description'
      ) as TextField;
      const photographer = element.shadowRoot!.querySelector(
        '#photographerName'
      ) as TextField;
      const originalSubmitForm = window.serverApi.submitForm;
      let request:
        | {
            url: string;
            method: string;
            body: string;
          }
        | undefined;

      window.serverApi.submitForm = async (url, method, _headers, body) => {
        request = { url, method, body };
        return {};
      };

      try {
        description.value = 'A useful description';
        photographer.value = 'A photographer';
        element.uploadedPostUserImageId = 42;
        await element.updateComplete;

        dialog.submit();
        await aTimeout(50);

        expect(request).to.deep.include({
          url: '/images/1/user_images',
          method: 'POST',
        });
        expect(request!.body).to.contain(
          'description=A%20useful%20description'
        );
        expect(request!.body).to.contain(
          'photographerName=A%20photographer'
        );
        expect(request!.body).to.contain('uploadedPostUserImageId=42');
      } finally {
        window.serverApi.submitForm = originalSubmitForm;
      }
    }
  );

  it('shows the existing image when editing', async () => {
    const image = getImage();
    element.setup(getPost(), image, false, () => {});
    await element.updateComplete;

    const preview = element.shadowRoot!.querySelector(
      'yp-image.imagePreview'
    ) as YpImage;
    expect(element.oldUploadedPostUserImageId).to.equal(image.id);
    expect(preview.src).to.equal(JSON.parse(image.formats)[0]);
  });

  it(
    'submits existing image metadata without requiring a replacement',
    async () => {
      const image = getImage();
      const originalSubmitForm = window.serverApi.submitForm;
      let request: { method: string; body: string } | undefined;
      window.serverApi.submitForm = async (_url, method, _headers, body) => {
        request = { method, body };
        return {};
      };

      try {
        element.setup(getPost(), image, false, () => {});
        await element.updateComplete;
        const dialog = element.shadowRoot!.querySelector(
          '#editDialog'
        ) as YpEditDialog;

        dialog.submit();
        await aTimeout(50);

        expect(request!.method).to.equal('PUT');
        expect(request!.body).to.contain('oldUploadedPostUserImageId=2');
        expect(request!.body).to.contain('uploadedPostUserImageId=');
      } finally {
        window.serverApi.submitForm = originalSubmitForm;
      }
    }
  );
});
