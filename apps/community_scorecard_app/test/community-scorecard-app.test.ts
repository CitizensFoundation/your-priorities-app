import { html, fixture, expect } from '@open-wc/testing';

import {CommunityScorecardApp} from '../src/CommunityScorecardApp.js';
import '../src/community-scorecard-app.js';

describe('CommunityScorecardApp', () => {
  let element: CommunityScorecardApp;
  beforeEach(async () => {
    element = await fixture(html`
      <community-scorecard-app></community-scorecard-app>
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
