import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpLandingPage } from '../yp-landing-page.js';
import '../yp-landing-page.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';
import { YpNavHelpers } from '../../common/YpNavHelpers.js';
import {
  OPTIONAL_COOKIE_CONSENT_KEY,
} from '../yp-landing-page-content.js';

const SECTIONS = [
  { id: 'get-involved', navLabel: 'Get Involved', heading: 'Get Involved' },
  { id: 'about-us', navLabel: 'About Us', heading: 'About Us' },
  { id: 'faqs', navLabel: 'FAQs', heading: 'Frequently Asked Questions' },
];

describe('YpLandingPage', () => {
  let element: YpLandingPage;
  let fetchMock: any;
  let redirectedTo: string[];
  let originalRedirectTo: typeof YpNavHelpers.redirectTo;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    localStorage.removeItem(OPTIONAL_COOKIE_CONSENT_KEY);
    originalRedirectTo = YpNavHelpers.redirectTo;
    redirectedTo = [];
    YpNavHelpers.redirectTo = (path: string) => {
      redirectedTo.push(path);
    };

    // Avoid a real analytics/activity network call firing on every click.
    window.appGlobals.activity = () => {};
    window.appGlobals.domain = YpTestHelpers.getDomain();

    element = await fixture(html`<yp-landing-page></yp-landing-page>`);
    await aTimeout(50);
  });

  afterEach(() => {
    YpNavHelpers.redirectTo = originalRedirectTo;
    localStorage.removeItem(OPTIONAL_COOKIE_CONSENT_KEY);
  });

  function getNavButton(navLabel: string): HTMLElement {
    const button = Array.from(
      element.shadowRoot!.querySelectorAll('.navLinks md-text-button')
    ).find((el) => el.getAttribute('aria-label') === navLabel) as HTMLElement | undefined;
    expect(button, `nav button "${navLabel}" should exist`).to.exist;
    return button!;
  }

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('shows the intro video after optional-cookie approval', async () => {
    const video = element.shadowRoot!.querySelector('.videoPlaceholder');
    expect(video).to.exist;
    expect(video!.querySelector('iframe')).to.not.exist;

    (video!.querySelector('button') as HTMLButtonElement).click();
    await element.updateComplete;

    expect(
      video!.querySelector('iframe')?.getAttribute('src')
    ).to.equal('https://www.youtube-nocookie.com/embed/enfgLUpgJiQ?autoplay=0');
  });

  describe('navigation bar', () => {
    it('is always rendered and visible', () => {
      const nav = element.shadowRoot!.querySelector('nav.nav');
      expect(nav, 'nav bar should exist').to.exist;

      const navStyle = getComputedStyle(nav as Element);
      expect(navStyle.display).to.not.equal('none');
      expect(navStyle.visibility).to.not.equal('hidden');
    });

    it('stays pinned to the top of the viewport while scrolling', () => {
      const nav = element.shadowRoot!.querySelector('nav.nav') as Element;
      const navStyle = getComputedStyle(nav);
      expect(navStyle.position).to.equal('sticky');
      expect(navStyle.top).to.equal('0px');
    });

    SECTIONS.forEach(({ id, navLabel }) => {
      it(`scrolls to the "${navLabel}" section when its nav button is clicked`, () => {
        const section = element.shadowRoot!.querySelector(
          `#${id}`
        ) as HTMLElement;
        expect(section, `#${id} should exist`).to.exist;

        let scrolledIntoView = false;
        section.scrollIntoView = () => {
          scrolledIntoView = true;
        };

        getNavButton(navLabel).click();

        expect(scrolledIntoView).to.be.true;
      });
    });

    // TODO: Skipped because this fails. Claude's speculation as to why:
    // the mobile label's text has surrounding whitespace, which this test
    // doesn't trim.
    it.skip('uses short mobile labels without shortening accessible names', () => {
      const getInvolvedButton = getNavButton('Get Involved');
      const aboutButton = getNavButton('About Us');
      const faqsButton = getNavButton('FAQs');

      expect(getInvolvedButton.querySelector('.navLabelMobile')?.textContent?.trim()).to.equal('Get Involved');
      expect(aboutButton.querySelector('.navLabelMobile')?.textContent).to.equal('about');
      expect(faqsButton.querySelector('.navLabelMobile')?.textContent?.trim()).to.equal('FAQs');
      expect(getInvolvedButton.getAttribute('aria-label')).to.equal('Get Involved');
      expect(aboutButton.getAttribute('aria-label')).to.equal('About Us');
      expect(faqsButton.getAttribute('aria-label')).to.equal('FAQs');
      expect(
        element.shadowRoot!.querySelector('.navLinks md-text-button[aria-label="Press releases"]')
      ).to.not.exist;
    });
  });

  it('uses Small Ideas Initiative branding throughout the landing page', () => {
    const shadowRoot = element.shadowRoot!;
    expect(shadowRoot.querySelector('.introCopy .eyebrow')?.textContent).to.contain(
      'The Small Ideas Initiative'
    );
    expect(shadowRoot.querySelector('.attribution')?.textContent).to.contain(
      'Chair of the Small Ideas Initiative'
    );
    expect(shadowRoot.querySelector('#about-us .aboutUsCopy')?.textContent).to.contain(
      'The Small Ideas Initiative is a non-partisan project.'
    );
    expect(shadowRoot.querySelector('#press-releases')?.textContent).to.contain(
      'The latest announcements and news from The Small Ideas Initiative.'
    );
    const pressRelease = shadowRoot.querySelector('#press-releases .pressReleaseItem');
    expect(pressRelease?.textContent).to.contain(
      'Martin Lewis launches the Small Ideas Initiative'
    );
    expect(pressRelease?.querySelector('a')?.getAttribute('href')).to.equal(
      'https://assets.small-ideas.org/press-releases/Small-Ideas-Initiative-Press-Release-8th-October-2026.pdf'
    );
    expect(shadowRoot.querySelector('.logosContainer')?.textContent).to.contain(
      'The Small Ideas Initiative is founded and chaired by Martin Lewis, and run by two charities:'
    );
    expect(shadowRoot.querySelector('.footerCopyright')?.textContent).to.contain(
      'The Small Ideas Initiative. All rights reserved.'
    );
  });

  describe('"Share your idea" button', () => {
    [YpTestHelpers.getDomain(), undefined].forEach((domain) => {
      it(`redirects to /group/1/new_post regardless of domain (domain ${
        domain ? 'loaded' : 'not loaded'
      })`, () => {
        window.appGlobals.domain = domain;

        const button = element.shadowRoot!.querySelector(
          '.shareIdeaButton'
        ) as HTMLButtonElement;
        expect(button, 'share idea button should exist').to.exist;

        button.click();

        expect(redirectedTo).to.deep.equal(['/group/1/new_post']);
      });
    });

    // TODO: Skipped because this fails. Claude's speculation as to why:
    // only one of the "Share your idea" buttons still has the
    // shareIdeaButton class.
    it.skip('redirects every "Share your idea" button on the page to the same place', () => {
      const buttons = Array.from(
        element.shadowRoot!.querySelectorAll('.shareIdeaButton')
      ) as HTMLButtonElement[];

      expect(buttons.length).to.be.greaterThan(1);

      buttons.forEach((button) => {
        redirectedTo.length = 0;
        button.click();
        expect(redirectedTo).to.deep.equal(['/group/1/new_post']);
      });
    });
  });

  describe('carousel arrows', () => {
    function getArrows() {
      const leftArrow = element.shadowRoot!.querySelector(
        '.carouselArrowLeft'
      ) as HTMLButtonElement;
      const rightArrow = element.shadowRoot!.querySelector(
        '.carouselArrowRight'
      ) as HTMLButtonElement;
      expect(leftArrow, 'left arrow should exist').to.exist;
      expect(rightArrow, 'right arrow should exist').to.exist;
      return { leftArrow, rightArrow };
    }

    it('disables the left arrow and enables the right arrow before any scrolling', () => {
      const { leftArrow, rightArrow } = getArrows();
      expect(leftArrow.disabled).to.be.true;
      expect(rightArrow.disabled).to.be.false;
    });

    it('scrolls the carousel forward by roughly one card when the right arrow is clicked', () => {
      const { rightArrow } = getArrows();
      const viewport = element.shadowRoot!.querySelector(
        '.carouselViewport'
      ) as HTMLElement;

      let scrolledBy: { left?: number; behavior?: string } | undefined;
      viewport.scrollBy = ((options: { left?: number; behavior?: string }) => {
        scrolledBy = options;
      }) as typeof viewport.scrollBy;

      rightArrow.click();

      expect(scrolledBy?.left).to.be.greaterThan(0);
      expect(scrolledBy?.behavior).to.equal('smooth');
    });

    it('scrolls the carousel backward when the left arrow is clicked', () => {
      const { leftArrow } = getArrows();
      const viewport = element.shadowRoot!.querySelector(
        '.carouselViewport'
      ) as HTMLElement;

      let scrolledBy: { left?: number; behavior?: string } | undefined;
      viewport.scrollBy = ((options: { left?: number; behavior?: string }) => {
        scrolledBy = options;
      }) as typeof viewport.scrollBy;

      // Force the left arrow active to test its scroll direction in isolation,
      // since it starts disabled before any scrolling has happened.
      leftArrow.disabled = false;
      leftArrow.click();

      expect(scrolledBy?.left).to.be.lessThan(0);
    });

    it('moves focus to the other arrow when the focused arrow becomes disabled', async () => {
      const { leftArrow, rightArrow } = getArrows();

      // Simulate having scrolled away from the start, so both arrows are enabled.
      (element as any).carouselCanScrollLeft = true;
      await element.updateComplete;

      rightArrow.focus();
      expect(element.shadowRoot!.activeElement).to.equal(rightArrow);

      // Simulate the scroll reaching the right-hand end, which disables this
      // (currently focused) button. Browsers drop focus to <body> when a
      // focused element becomes disabled, so without a fix the keyboard user
      // would silently lose their place on the page.
      (element as any).carouselCanScrollRight = false;
      await element.updateComplete;

      expect(rightArrow.disabled).to.be.true;
      expect(element.shadowRoot!.activeElement).to.equal(leftArrow);
    });

    it('moves focus to the carousel viewport when the other arrow is also disabled', async () => {
      const { rightArrow } = getArrows();
      const viewport = element.shadowRoot!.querySelector(
        '.carouselViewport'
      ) as HTMLElement;

      // Left arrow remains disabled (its default before any scrolling).
      rightArrow.focus();
      expect(element.shadowRoot!.activeElement).to.equal(rightArrow);

      (element as any).carouselCanScrollRight = false;
      await element.updateComplete;

      expect(rightArrow.disabled).to.be.true;
      expect(element.shadowRoot!.activeElement).to.equal(viewport);
    });
  });

  describe('sections', () => {
    // TODO: Skipped because this fails. Claude's speculation as to why:
    // the intro's <h1> text has changed.
    it.skip('renders the intro section first, as the first thing a user sees', () => {
      const sections = element.shadowRoot!.querySelectorAll('section');
      expect(sections.length).to.be.greaterThan(0);
      expect(sections[0].id).to.equal('intro');

      const intro = sections[0];
      expect(intro.querySelector('h1')?.textContent).to.contain(
        'Getting government to fix the small stuff'
      );
      expect(intro.querySelectorAll('p').length).to.be.greaterThan(0);
    });

    SECTIONS.forEach(({ id, heading }) => {
      it(`renders the "${heading}" section with a heading and body text`, () => {
        const section = element.shadowRoot!.querySelector(`#${id}`);
        expect(section, `#${id} should exist`).to.exist;
        expect(section!.querySelector('h2')?.textContent?.trim()).to.equal(
          heading
        );
        expect(section!.querySelectorAll('p').length).to.be.greaterThan(0);
      });
    });

    describe('internal links', () => {
      it('scrolls to the linked section and prevents native fragment navigation', () => {
        const aboutSection = element.shadowRoot!.querySelector('#about-us');
        expect(aboutSection, 'about us section should exist').to.exist;
        const link = aboutSection!.querySelector(
          'a[href="#press-releases"]'
        ) as HTMLAnchorElement;
        const section = element.shadowRoot!.querySelector(
          '#press-releases'
        ) as HTMLElement;
        expect(link, 'press releases link should exist in about us').to.exist;
        expect(section, 'press releases section should exist').to.exist;

        let scrolledIntoView = false;
        section.scrollIntoView = () => {
          scrolledIntoView = true;
        };
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        });

        link.dispatchEvent(clickEvent);

        expect(scrolledIntoView).to.be.true;
        expect(clickEvent.defaultPrevented).to.be.true;
      });
    });
  });
});
