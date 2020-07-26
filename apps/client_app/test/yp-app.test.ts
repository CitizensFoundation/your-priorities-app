import { html, fixture, expect } from '@open-wc/testing';

import {YpApp} from '../src/yp-app/yp-app.js';
import '../src/yp-app/yp-app.js';

describe('YpApp', () => {
  let element: YpApp;
  beforeEach(async () => {
    element = await fixture(html`
      <yp-app></yp-app>
    `);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
