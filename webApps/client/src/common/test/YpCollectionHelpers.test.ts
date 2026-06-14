import { expect } from '@open-wc/testing';

import { YpCollectionHelpers } from '../YpCollectionHelpers.js';

const collectionItem = (
  id: number,
  status: string,
  optionalSortOrder?: number
) =>
  ({
    id,
    name: `Item ${id}`,
    status,
    configuration:
      optionalSortOrder !== undefined ? { optionalSortOrder } : {},
  } as YpCollectionData);

describe('YpCollectionHelpers', () => {
  it('sorts by optional sort order before splitting by status', () => {
    const splitItems = YpCollectionHelpers.splitByStatus(
      [
        collectionItem(1, 'active', 20),
        collectionItem(2, 'featured', 30),
        collectionItem(3, 'active', 10),
        collectionItem(4, 'archived', 5),
        collectionItem(5, 'hidden', 15),
        collectionItem(6, 'active'),
      ],
      { sortBySortOrder: true }
    );

    expect(splitItems.featured.map(item => item.id)).to.deep.equal([2]);
    expect(splitItems.active.map(item => item.id)).to.deep.equal([3, 5, 1, 6]);
    expect(splitItems.archived.map(item => item.id)).to.deep.equal([4]);
  });

  it('uses random ordering before sort order when both flags are set', () => {
    const originalRandom = Math.random;
    Math.random = () => 0;

    try {
      const splitItems = YpCollectionHelpers.splitByStatus(
        [
          collectionItem(1, 'active', 40),
          collectionItem(2, 'active', 10),
          collectionItem(3, 'active', 30),
          collectionItem(4, 'active', 20),
        ],
        { orderByRandom: true, sortBySortOrder: true }
      );

      expect(splitItems.active.map(item => item.id)).to.deep.equal([
        2,
        3,
        4,
        1,
      ]);
    } finally {
      Math.random = originalRandom;
    }
  });
});
