// Originally from here: https://dev.to/straversi/build-a-story-web-component-with-litelement-e59

import { LitElement, html, css, property, query, customElement } from 'lit-element';

@customElement('cs-story-card')
export class CsStoryCard extends LitElement {
  constructor() {
    super();

    this.addEventListener("entered", () => {
      if (this._slottedMedia) {
        this._slottedMedia.currentTime = 0;
        this._slottedMedia.play();
      }
    });

    this.addEventListener("exited", () => {
      if (this._slottedMedia) {
        this._slottedMedia.pause();
      }
    });
  }

  static get styles() {
    return [css`
    #media {
      height: 100%;
    }

    #media ::slotted(*) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Default styles for content */
    #content {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 48px;
      font-family: sans-serif;
      color: white;
      font-size: 24px;
    }
    #content > slot::slotted(*) {
      margin: 0;
    }
  `]
  }

  /**
   * The element in the "media" slot, ONLY if it is an
   * HTMLMediaElement, such as <video>.
   */
  private get _slottedMedia(): HTMLMediaElement | null {
    const el = this._mediaSlot && this._mediaSlot.assignedNodes()[0];
    return el instanceof HTMLMediaElement ? el : null;
  }

  /*
   * @query(selector) is shorthand for
   * this.renderRoot.querySelector(selector)
   */
  @query("slot[name=media]")
  private _mediaSlot: HTMLSlotElement | undefined;

  render() {
    return html`
      <div id="media">
        <slot name="media"></slot>
      </div>
      <div id="content">
        <slot></slot>
      </div>
    `;
  }
}