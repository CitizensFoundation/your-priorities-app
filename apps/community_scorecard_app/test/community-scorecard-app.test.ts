import { html, fixture, expect } from '@open-wc/testing';

import {CsApp} from '../src/cs-app/cs-app.js';
import '../src/cs-app.js';

describe('CsApp', () => {
  let element: CsApp;
  beforeEach(async () => {
    element = await fixture(html`
      <cs-app></cs-app>
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
