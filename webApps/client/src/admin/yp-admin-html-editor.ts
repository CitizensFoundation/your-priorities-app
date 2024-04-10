import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { YpBaseElement } from '../common/yp-base-element';
import '@tinymce/tinymce-webcomponent';

@customElement('yp-admin-html-editor')
export class YpAdminHtmlEditor extends YpBaseElement {
  // Use @property decorator to define properties with their types
  @property({ type: String }) data: string = '<p>Hello from CKEditor 5 with tables!</p>';

  @property({ type: Object })
  configuration = { content: "" }

  override firstUpdated(_changedProperties: PropertyValues) {

  }

  override render() {
    return html`
      <tinymce-editor
      api-key="urd3k008tynb5c494mlomuiacphcx207awaso2c8ggvownkm"
      height="500"
      menubar="false"
      plugins="advlist autolink lists link image charmap print preview anchor
      searchreplace visualblocks code fullscreen
      insertdatetime media table paste code help wordcount"
      toolbar="undo redo | formatselect | bold italic backcolor |
      alignleft aligncenter alignright alignjustify | image | table
      bullist numlist outdent indent | removeformat | help"
      content_style="body
      {
        font-family:Helvetica,Arial,sans-serif;
        font-size:14px
      }"
      >



    </tinymce-editor>
    `;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

  }
}
