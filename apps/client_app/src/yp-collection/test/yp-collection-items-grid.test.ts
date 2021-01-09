/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCollectionItemsGrid } from '../yp-collection-items-grid.js';
import '../yp-collection-items-grid.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCollectionItemsGrid', () => {
  let element: YpCollectionItemsGrid;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });
  

  beforeEach(async () => {
    const collectionType = 'domain';

    element = await fixture(html`
    ${YpTestHelpers.renderCommonHeader()}
      <yp-collection-items-grid
        .collection="${YpTestHelpers.getDomain()}"
        .collectionType="${collectionType}"></yp-collection-items-grid>
    `);
    await aTimeout(100)
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
