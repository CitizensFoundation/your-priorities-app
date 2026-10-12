import { expect } from '@open-wc/testing';

import {
  MODERATION_LIST_LIMIT,
  mayBeCapped,
  moderationCountLabel,
} from '../moderationCount.js';

const words = { items: 'items', showingNewest: 'showing newest', of: 'of' };

describe('moderation count label', () => {
  it('matches the server cap of 7,500 rows', () => {
    expect(MODERATION_LIST_LIMIT).to.equal(7500);
  });

  it('only asks for a total when the list may have been capped', () => {
    expect(mayBeCapped(7499)).to.equal(false);
    expect(mayBeCapped(7500)).to.equal(true);
    expect(mayBeCapped(7820)).to.equal(true);
  });

  it('shows the plain count when the whole list is loaded', () => {
    expect(moderationCountLabel(120, undefined, words)).to.equal('120 items');
  });

  it('shows how many of the total are listed when the list was capped', () => {
    expect(moderationCountLabel(7500, 17237, words)).to.equal(
      'showing newest 7,500 of 17,237 items'
    );
  });

  it('shows the plain count when the total turns out to match', () => {
    expect(moderationCountLabel(7500, 7500, words)).to.equal('7,500 items');
  });

  it('marks a capped list with no total as a lower bound', () => {
    expect(moderationCountLabel(7500, undefined, words)).to.equal('7,500+ items');
  });
});
