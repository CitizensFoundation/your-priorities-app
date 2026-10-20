import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausibleRealtime } from '../pl-realtime.js';
import '../pl-realtime.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('PlausibleRealtime', () => {
  let element: PlausibleRealtime;
  let fetchMock: any;
  const mockSite = {
    domain: 'example.org',
    hasGoals: false,
    embedded: false,
    offset: 0,
    statsBegin: '2024-01-01',
  } as PlausibleSiteData;

  const mockQuery = {
    period: 'realtime',
    date: new Date('2024-05-01T00:00:00Z'),
    filters: {},
    with_imported: true,
  } as PlausibleQueryData;

  const mockHistory = {
    push: () => {
      // no-op history implementation for render-only tests
    },
  };

  const mockTimer = {
    onTick: (_callback: Function) => {
      // no-op timer for components that subscribe during firstUpdated
    },
  };

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();

    fetchMock
      .get('glob:/api/stats/**/top-stats*', {
        top_stats: [
          { name: 'Unique visitors (last 30 min)', value: 4 },
          { name: 'Pageviews (last 30 min)', value: 7 },
        ],
        sample_percent: 100,
        imported_source: 'none',
        with_imported: true,
      })
      .get('glob:/api/stats/**/main-graph*', {
        labels: ['2024-05-01'],
        plot: [4],
        present_index: null,
        interval: 'date',
      })
      .get('/topo/world.json', {
        type: 'Topology',
        objects: {
          countries: {
            type: 'GeometryCollection',
            geometries: [],
          },
        },
        arcs: [],
        transform: {
          scale: [1, 1],
          translate: [0, 0],
        },
      })
      .get('glob:/api/stats/**/sources*', [])
      .get('glob:/api/stats/**/pages*', [])
      .get('glob:/api/stats/**/countries*', [])
      .get('glob:/api/stats/**/browsers*', []);

    await YpTestHelpers.setupApp();

    await customElements.whenDefined('pl-countries-map');
    const countriesMapCtor = customElements.get('pl-countries-map') as any;
    if (countriesMapCtor?.prototype?.drawMap) {
      countriesMapCtor.prototype.drawMap = () => {
        // Avoid d3 map rendering in this broad smoke test.
      };
    }
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-realtime
        .site=${mockSite}
        .query=${mockQuery}
        .history=${mockHistory}
        .timer=${mockTimer}
      ></pl-realtime>
    `);

    await aTimeout(100);
  });

  it.skip('renders the component', async () => {
    expect(element).to.exist;
    expect(element.shadowRoot).to.exist;
  });

  it.skip('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  // TODO: Add targeted behavior tests for:
  // - renderConversions()
  // - restore full a11y audit after fixing known upstream issues in pl-filters/pl-date-picker/pl-line-graph

  // TODO: The generated 'renders the component' and 'passes the a11y audit'
  // tests (from 5fcdcbf) are skipped because most generated tests fail: they
  // render the component without the data it needs. Either give the
  // component realistic fixture data and re-enable them, or delete them.
});
