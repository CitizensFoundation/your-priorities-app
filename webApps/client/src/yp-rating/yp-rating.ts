/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

@customElement('yp-ratings')
export class YpRating extends YpBaseElement {
  @property({ type: String })
  emoji: string | undefined;

  @property({ type: Boolean })
  votingDisabled = false;

  @property({ type: Boolean })
  readOnly = false;

  @property({ type: Number })
  postId: number | undefined;

  @property({ type: Number })
  ratingIndex: number | undefined;

  @property({ type: Number })
  numberOf: number | undefined;

  @property({ type: Number })
  rate = 0;

  @property({ type: Array })
  currentRatings: Array<number> | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .rating-wrapper {
          unicode-bidi: bidi-override;
          direction: rtl;
          text-align: center;
        }

        .rating-wrapper > .ratingButton {
          appearance: none;
          background: transparent;
          border: 0;
          color: inherit;
          display: inline-block;
          position: relative;
          width: 1.35em;
          font-size: 1.6em;
          line-height: 1;
          padding: 0;
          cursor: pointer;
          opacity: 0.4;
          -webkit-filter: grayscale(50%);
          filter: grayscale(50%);
        }

        .rating-wrapper[voting-disabled] > .ratingButton {
          cursor: initial;
        }

        .rating-wrapper > .ratingButton.active,
        .rating-wrapper > .ratingButton.active ~ .ratingButton {
          opacity: 1;
          -webkit-filter: grayscale(0%);
          filter: grayscale(0%);
        }

        @media (pointer: fine) {
          .rating-wrapper:not([read-only]):hover > .ratingButton.active,
          .rating-wrapper:not([read-only]):hover > .ratingButton.active ~ .ratingButton {
            opacity: 0.4;
          }
          .rating-wrapper:not([read-only]) > .ratingButton:hover,
          .rating-wrapper:not([read-only]) > .ratingButton:hover ~ .ratingButton,
          .rating-wrapper:not([read-only]) > .ratingButton.active:hover ~ .ratingButton {
            opacity: 0.8 !important;
            -webkit-filter: grayscale(0%);
            filter: grayscale(0%);
          }
          .rating-wrapper:not([read-only]) > .ratingButton:hover {
            opacity: 0.9 !important;
            -webkit-filter: grayscale(0%);
            filter: grayscale(0%);
          }
        }

        .rating-wrapper > .ratingButton.totals {
          opacity: 1 !important;
          margin-left: 50px;
        }

        .rating-wrapper:not([read-only]) > .ratingButton.totals:hover {
          opacity: 1 !important;
        }

        .rating-wrapper[read-only] > .ratingButton {
        }

        .rating-wrapper[read-only] > .ratingButton {
          font-size: 0.8em !important;
          width: 1.248em;
        }

        :host[read-only] {
        }
      `,
    ];
  }

  override render() {
    return html`
      <div
        class="rating-wrapper"
        ?voting-disabled="${this.votingDisabled}"
        ?read-only="${this.readOnly}">
        ${this.currentRatings?.map((item, index) => {
          return html`
            <button
              type="button"
              class="ratingButton ${this.isActive(item, this.rate)}"
              @click="${(event: Event) => this._setRate(event, index)}"
              data-index="${index}"
              aria-label="Rate ${item} out of ${this.numberOf}"
              aria-pressed="${item === this.rate ? 'true' : 'false'}"
              ?disabled="${this.votingDisabled || this.readOnly}"
              >${this.emoji}</button
            >
          `;
        })}
      </div>
    `;
  }

  isActive(item: number, rate: number) {
    if (item === rate) {
      return 'active';
    } else {
      return '';
    }
  }

  _postIdChanged() {
    this._resetRatings();
  }

  _resetRatings() {
    if (typeof this.rate === 'string') this.rate = parseFloat(this.rate);
    this.rate = Math.round(this.rate);
    this.currentRatings = [];

    const deep = dom(this.shadowRoot);

    setTimeout(() => {
      if (typeof this.numberOf === 'string')
        this.numberOf = parseInt(this.numberOf);
      if (this.numberOf) {
        if (this.numberOf > 5) this.numberOf = 5;
        for (let i = this.numberOf - 1; i >= 0; i--) {
          this.currentRatings?.push(i + 1);
        }
        if (this.rate && this.rate > 0) {
          setTimeout(() => {
            if (this.numberOf) {
              const inverted = this.rate * -1 + this.numberOf;
              for (let i = this.numberOf - 1; i >= inverted; i--) {
                //@ts-ignore
                let selector = deep.querySelectorAll(
                  '[data-index="' + i + '"]'
                );
                selector = selector[0];
                if (selector) {
                  selector.classList.add('active');
                } else {
                  console.warn('No selector found for rating');
                }
              }
            }
          });
        }
      }
    });
  }

  _setRate(e: Event, index: number) {
    e.preventDefault();
    const deep = dom(this.shadowRoot);
    if (!this.readOnly && !this.votingDisabled && this.numberOf) {
      const indexOld = this.rate * -1 + this.numberOf;
      const oldRate = this.rate;
      this.rate = (index - this.numberOf) * -1;
      if (oldRate !== this.rate) {
        this.fire('yp-rating-add', {
          postId: this.postId,
          ratingIndex: this.ratingIndex,
          rate: this.rate,
        });
      } else {
        this.fire('yp-rating-delete', {
          postId: this.postId,
          ratingIndex: this.ratingIndex,
        });
        this.rate = 0;
        this._resetRatings();
      }
      if (indexOld < this.numberOf) {
        deep
          //@ts-ignore
          .querySelectorAll('[data-index="' + indexOld + '"]')[0]
          .classList.remove('active');
      }
      deep
        //@ts-ignore
        .querySelectorAll('[data-index="' + index + '"]')[0]
        .classList.add('active');
    }
  }
}
