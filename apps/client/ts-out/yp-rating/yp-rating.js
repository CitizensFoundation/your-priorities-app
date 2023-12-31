var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
let YpRating = class YpRating extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.votingDisabled = false;
        this.readOnly = false;
        this.rate = 0;
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
        }

        .rating-wrapper {
          unicode-bidi: bidi-override;
          direction: rtl;
          text-align: center;
        }

        .rating-wrapper > span {
          display: inline-block;
          position: relative;
          width: 1.35em;
          font-size: 1.6em;
          cursor: pointer;
          opacity: 0.4;
          -webkit-filter: grayscale(50%);
          filter: grayscale(50%);
        }

        .rating-wrapper[voting-disabled] > span {
          cursor: initial;
        }

        .rating-wrapper > span.active,
        .rating-wrapper > span.active ~ span {
          opacity: 1;
          -webkit-filter: grayscale(0%);
          filter: grayscale(0%);
        }

        @media (pointer: fine) {
          .rating-wrapper:not([read-only]):hover > span.active,
          .rating-wrapper:not([read-only]):hover > span.active ~ span {
            opacity: 0.4;
          }
          .rating-wrapper:not([read-only]) > span:hover,
          .rating-wrapper:not([read-only]) > span:hover ~ span,
          .rating-wrapper:not([read-only]) > span.active:hover ~ span {
            opacity: 0.8 !important;
            -webkit-filter: grayscale(0%);
            filter: grayscale(0%);
          }
          .rating-wrapper:not([read-only]) > span:hover {
            opacity: 0.9 !important;
            -webkit-filter: grayscale(0%);
            filter: grayscale(0%);
          }
        }

        .rating-wrapper > span.totals {
          opacity: 1 !important;
          margin-left: 50px;
        }

        .rating-wrapper:not([read-only]) > span.totals:hover {
          opacity: 1 !important;
        }

        .rating-wrapper[read-only] > span {
        }

        .rating-wrapper[read-only] > span {
          font-size: 0.8em !important;
          width: 1.248em;
        }

        :host[read-only] {
        }
      `,
        ];
    }
    render() {
        return html `
      <div
        class="rating-wrapper"
        voting-disabled$="[[votingDisabled]]"
        read-only$="[[readOnly]]">
        ${this.currentRatings?.map((item, index) => {
            return html `
            <span
              class="${this.isActive(index, this.rate)}"
              @click="${this._setRate}"
              data-index="${index}"
              >${this.emoji}</span
            >
          `;
        })}
      </div>
    `;
    }
    // Caller in polymer was {{isActive(numberOf, index, rate)}}
    isActive(index, rate) {
        if (index <= rate) {
            return 'active';
        }
        else {
            return '';
        }
    }
    _postIdChanged() {
        this._resetRatings();
    }
    _resetRatings() {
        if (typeof this.rate === 'string')
            this.rate = parseFloat(this.rate);
        this.rate = Math.round(this.rate);
        this.currentRatings = [];
        const deep = dom(this.shadowRoot);
        setTimeout(() => {
            if (typeof this.numberOf === 'string')
                this.numberOf = parseInt(this.numberOf);
            if (this.numberOf) {
                if (this.numberOf > 5)
                    this.numberOf = 5;
                for (let i = this.numberOf - 1; i >= 0; i--) {
                    this.currentRatings?.push(i + 1);
                }
                if (this.rate && this.rate > 0) {
                    setTimeout(() => {
                        if (this.numberOf) {
                            const inverted = this.rate * -1 + this.numberOf;
                            for (let i = this.numberOf - 1; i >= inverted; i--) {
                                //@ts-ignore
                                let selector = deep.querySelectorAll('[data-index="' + i + '"]');
                                selector = selector[0];
                                if (selector) {
                                    selector.classList.add('active');
                                }
                                else {
                                    console.warn('No selector found for rating');
                                }
                            }
                        }
                    });
                }
            }
        });
    }
    _setRate(e) {
        const deep = dom(this.shadowRoot);
        if (!this.readOnly && this.numberOf) {
            //@ts-ignore
            const index = e.model.index;
            const indexOld = this.rate * -1 + this.numberOf;
            const oldRate = this.rate;
            this.rate = (index - this.numberOf) * -1;
            if (oldRate !== this.rate) {
                this.fire('yp-rating-add', {
                    postId: this.postId,
                    ratingIndex: this.ratingIndex,
                    rate: this.rate,
                });
            }
            else {
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
};
__decorate([
    property({ type: String })
], YpRating.prototype, "emoji", void 0);
__decorate([
    property({ type: Boolean })
], YpRating.prototype, "votingDisabled", void 0);
__decorate([
    property({ type: Boolean })
], YpRating.prototype, "readOnly", void 0);
__decorate([
    property({ type: Number })
], YpRating.prototype, "postId", void 0);
__decorate([
    property({ type: Number })
], YpRating.prototype, "ratingIndex", void 0);
__decorate([
    property({ type: Number })
], YpRating.prototype, "numberOf", void 0);
__decorate([
    property({ type: Number })
], YpRating.prototype, "rate", void 0);
__decorate([
    property({ type: Array })
], YpRating.prototype, "currentRatings", void 0);
YpRating = __decorate([
    customElement('yp-ratings')
], YpRating);
export { YpRating };
//# sourceMappingURL=yp-rating.js.map