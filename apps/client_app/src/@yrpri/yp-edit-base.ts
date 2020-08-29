import { YpBaseElement } from './yp-base-element.js';
import { property } from 'lit-element';
import { YpEditDialog } from '../yp-edit-dialog/yp-edit-dialog.js';

export abstract class YpEditBase extends YpBaseElement {
  @property({ type: Boolean })
  new = true;

  @property({ type: String })
  editHeaderText: string | undefined

  @property({ type: String })
  saveText: string | undefined

  @property({ type: String })
  snackText: string | undefined

  @property({ type: Object })
  params: Record<string,string> | undefined

  @property({ type: String })
  method = 'POST'

  @property({ type: Function })
  refreshFunction: Function | undefined

  uploadedLogoImageId: number | undefined

  uploadedHeaderImageId: number | undefined

  uploadedDefaultDataImageId: number | undefined

  uploadedDefaultPostImageId: number | undefined

  customRedirect?: Function

  setupAfterOpen?: Function

  abstract customFormResponse(event?: CustomEvent): void

  abstract clear(): void

  abstract setupTranslation(): void

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('new')) {
      this._setupNewUpdateState();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-form-response', this._formResponse.bind(this))
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-form-response', this._formResponse.bind(this))
  }

  _logoImageUploaded(event: CustomEvent) {
    const image = JSON.parse(event.detail.xhr.response);
    this.uploadedLogoImageId = image.id;
  }

  _headerImageUploaded(event: CustomEvent) {
    const image = JSON.parse(event.detail.xhr.response);
    this.uploadedHeaderImageId = image.id;
  }

  _defaultDataImageUploaded(event: CustomEvent) {
    const image = JSON.parse(event.detail.xhr.response);
    this.uploadedDefaultDataImageId = image.id;
  }

  _defaultPostImageUploaded(event: CustomEvent) {
    const image = JSON.parse(event.detail.xhr.response);
    this.uploadedDefaultPostImageId = image.id;
  }

  _formResponse(event: CustomEvent) {
    if (typeof this.customRedirect == 'function') {
      this.customRedirect(event.detail.response);
    }
    if (typeof this.refreshFunction == 'function') {
      this.refreshFunction(event.detail.response);
    }
    if (
      event &&
      event.detail &&
      event.detail.response &&
      event.detail.response.isError
    ) {
      console.log('Not clearing form because of user error');
    } else {
      this.clear();
    }
    this.customFormResponse(event);
  }

  _setupNewUpdateState() {
    if (this.new) {
      this.saveText = this.t('create');
      this.method = 'POST';
    } else {
      this.saveText = this.t('update');
      this.method = 'PUT';
    }
    this.setupTranslation();
  }

  open(newOrUpdate: string, params: Record<string,string>) {
    if (window.appUser && window.appUser.loggedIn() === true) {
      if (newOrUpdate && newOrUpdate === 'new') {
        this.new = true;
      } else {
        this.new = false;
      }
      if (params) this.params = params;
      if (typeof this.setupAfterOpen === 'function') {
        this.setupAfterOpen(params);
      }
      (this.$$("#editDialog") as YpEditDialog).open();
    } else {
      window.appUser.loginForEdit(
        this,
        newOrUpdate==="new",
        params,
        this.refreshFunction!
      );
    }
  }

  close() {
    (this.$$("#editDialog") as YpEditDialog).close();
  }
}
