import { LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';
import { Layouts } from 'lit-flexbox-literals';
import { PlausibleStyles } from './plausibleStyles';
import { PlausibleBaseElement } from './pl-base-element';

export class PlausibleBaseElementWithState extends PlausibleBaseElement {
  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: String })
  collectionType!: string;

  @property({ type: Object })
  timer: any;

  @property({ type: Object })
  state!: PlausibleStateData;

  @property({ type: String })
  currentUserRole!: string;

  constructor() {
    super();
    this.state = {};
  }

  updateState(updatedState: PlausibleStateData) {
    this.state = { ...this.state, ...updatedState };
  }
}
