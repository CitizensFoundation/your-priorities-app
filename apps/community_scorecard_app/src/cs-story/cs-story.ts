import { property, html, css, LitElement, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
//import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import '@material/mwc-tab-bar';
import '@material/mwc-fab';
import '@material/mwc-icon';
import '@material/mwc-button';

import './cs-story-viewer.js';
import './cs-story-card.js';
import { runInThisContext } from 'vm';

@customElement('cs-story')
export class CsStory extends YpBaseElement {
  @property({type: Number})
  number = 1

  renderStoryOne() {
    return html`
      <cs-story-viewer>
        <cs-story-card>
          <img slot="media" src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/shutterstock_1147582w93.png" />
          <div class="bottom">
            <h1 style="font-family: serif">Acme Hospital Monitoring</h1>
            <p>Tell us about your services</p>
          </div>
        </cs-story-card>

        <cs-story-card>
          <video
            slot="media"
            src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/Sequence+%231(54).mp4"
            loop
            playsinline
          ></video>
          <div class="bottom">
            <h2>This is a</h2>
            <h1 style="font-family: serif">WELCOME</h1>
            <h3>from us at ACME</h3>
          </div>
        </cs-story-card>

        <cs-story-card>
          <img slot="media" src="https://i.imgur.com/1wTXrAu.jpg" />
          <h1>Choose meeting time</h1>
          <p>for <i>Acme</i> hospital project.</p>
        </cs-story-card>

        <cs-story-card>
          <video
            slot="media"
            src="https://i.imgur.com/PwTsAT3.mp4"
            loop
            playsinline
          ></video>
          <div class="bottom">
            <p>Let us know when we can meet.</p>
            <h1>Swipe to start</h1>
          </div>
        </cs-story-card>

        <img
          style="object-fit: cover"
          src="https://i.imgur.com/ktDKGxb.jpg"
          draggable="false"
        />
      </cs-story-viewer>
    `;
  }

  renderStoryTwo() {
    return html`
      <cs-story-viewer>
        <cs-story-card>
          <img slot="media" src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/shutterstock_1147582w93.png" />
          <div class="bottom">
            <h1 style="font-family: serif">Acme Hospital Monitoring</h1>
            <p>What issues do you want to add</p>
          </div>
        </cs-story-card>

        <cs-story-card>
          <video
            slot="media"
            src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/Sequence+%231(54).mp4"
            loop
            playsinline
          ></video>
          <div class="bottom">
            <h2>This is a</h2>
            <h1 style="font-family: serif">WELCOME</h1>
            <h3>from us at ACME</h3>
          </div>
        </cs-story-card>

        <cs-story-card>
          <img slot="media" src="https://i.imgur.com/1wTXrAu.jpg" />
          <h1>What questions do you have</h1>
          <p>for Service Providers.</p>
        </cs-story-card>

        <cs-story-card>
          <video
            slot="media"
            src="https://i.imgur.com/PwTsAT3.mp4"
            loop
            playsinline
          ></video>
          <div class="bottom">
            <p>Your feedback can improve services</p>
            <h1>Swipe to start</h1>
          </div>
        </cs-story-card>

        <img
          style="object-fit: cover"
          src="https://i.imgur.com/ktDKGxb.jpg"
          draggable="false"
        />
      </cs-story-viewer>
    `;
  }

  renderStoryThree() {
    return html`
      <cs-story-viewer>
        <cs-story-card>
          <img slot="media" src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/shutterstock_1147582w93.png" />
          <div class="bottom">
            <h1 style="font-family: serif">Acme Hospital Monitoring</h1>
            <p>Score the issues</p>
          </div>
        </cs-story-card>

        <cs-story-card>
          <video
            slot="media"
            src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/Sequence+%231(54).mp4"
            loop
            playsinline
          ></video>
          <div class="bottom">
            <h2>This is a</h2>
            <h1 style="font-family: serif">WELCOME</h1>
            <h3>from us at ACME</h3>
          </div>
        </cs-story-card>

        <cs-story-card>
          <img slot="media" src="https://i.imgur.com/1wTXrAu.jpg" />
          <h1>What questions do you have</h1>
          <p>for Service Providers.</p>
        </cs-story-card>

        <cs-story-card>
          <video
            slot="media"
            src="https://i.imgur.com/PwTsAT3.mp4"
            loop
            playsinline
          ></video>
          <div class="bottom">
            <p>Your feedback can improve services</p>
            <h1>Swipe to start</h1>
          </div>
        </cs-story-card>

        <img
          style="object-fit: cover"
          src="https://i.imgur.com/ktDKGxb.jpg"
          draggable="false"
        />
      </cs-story-viewer>
    `;
  }

  renderStoryFour() {
    return html`
      <cs-story-viewer>
        <cs-story-card>
          <img slot="media" src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/shutterstock_1147582w93.png" />
          <div class="bottom">
            <h1 style="font-family: serif">Acme Hospital Monitoring</h1>
            <p>Create Action Plan</p>
          </div>
        </cs-story-card>

        <cs-story-card>
          <video
            slot="media"
            src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/Sequence+%231(54).mp4"
            loop
            playsinline
          ></video>
          <div class="bottom">
            <h2>This is a</h2>
            <h1 style="font-family: serif">WELCOME</h1>
            <h3>from us at ACME</h3>
          </div>
        </cs-story-card>

        <cs-story-card>
          <img slot="media" src="https://i.imgur.com/1wTXrAu.jpg" />
          <h1>What actions </h1>
          <p>are needed</p>
        </cs-story-card>

        <cs-story-card>
          <video
            slot="media"
            src="https://i.imgur.com/PwTsAT3.mp4"
            loop
            playsinline
          ></video>
          <div class="bottom">
            <p>Your feedback can improve services</p>
            <h1>Swipe to create action plan</h1>
          </div>
        </cs-story-card>

        <img
          style="object-fit: cover"
          src="https://i.imgur.com/ktDKGxb.jpg"
          draggable="false"
        />
      </cs-story-viewer>
    `;
  }

  renderStoryFive() {
    return html`
      <cs-story-viewer>
        <cs-story-card>
          <img slot="media" src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/shutterstock_1147582w93.png" />
          <div class="bottom">
            <h1 style="font-family: serif">Acme Hospital Monitoring</h1>
            <p style="margin:16px;">There has been an update on waiting times!</p>
          </div>
        </cs-story-card>

        <cs-story-card>
          <video
            slot="media"
            src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/Sequence+%231(54).mp4"
            loop
            playsinline
          ></video>
          <div class="bottom">
            <h2>This is a</h2>
            <h1 style="font-family: serif">WELCOME</h1>
            <h3>from us at ACME</h3>
          </div>
        </cs-story-card>

        <cs-story-card>
          <img slot="media" src="https://i.imgur.com/1wTXrAu.jpg" />
          <h1>Here are the results</h1>
          <p>...</p>
        </cs-story-card>

        <cs-story-card>
          <video
            slot="media"
            src="https://i.imgur.com/PwTsAT3.mp4"
            loop
            playsinline
          ></video>
          <div class="bottom">
            <p>More information later</p>
            <h1>Swipe to end</h1>
          </div>
        </cs-story-card>

        <img
          style="object-fit: cover"
          src="https://i.imgur.com/ktDKGxb.jpg"
          draggable="false"
        />
      </cs-story-viewer>
    `;
  }

  static get styles() {
    return [
      css`
        cs-story-viewer {
          width: 400px;
          max-width: 100%;
          overflow: hidden;
        }

        /* Styles for specific story cards */
        .bottom {
          position: absolute;
          width: 100%;
          bottom: 48px;
          left: 0;
        }
        .bottom > * {
          margin: 0;
          text-align: center;
        }
      `,
    ];
  }

  renderStory() {
    if (this.number===1) {
      return this.renderStoryOne();
    } else if (this.number===2) {
      return this.renderStoryTwo();
    } else if (this.number===3) {
      return this.renderStoryThree();
    } else if (this.number===4) {
      return this.renderStoryFour();
    } else if (this.number===5) {
      return this.renderStoryFive();
    }
  }

  render() {
    return this.renderStory();
  }
}
