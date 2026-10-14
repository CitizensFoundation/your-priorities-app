"use strict";

const _ = require("lodash");

const orderPostsByVotes = (posts) =>
  _.orderBy(posts, [(post) => post.endorsementsUp - post.endorsementsDown], ["desc"]);

// The row order of the group export: posts in each category (categories in
// name order), then posts with no category, each by net votes. Posts whose
// category is not in the list are left out, as the export always has. Both
// sheets are written from this list, so their rows stay in step.
const orderPostsForExport = (posts, categories) => {
  if (categories.length === 0) {
    return orderPostsByVotes(posts);
  }
  const byVotes = orderPostsByVotes(posts);
  const ordered = [];
  _.orderBy(categories, [(category) => category]).forEach((category) => {
    byVotes.forEach((post) => {
      if (post.category === category) ordered.push(post);
    });
  });
  return ordered.concat(byVotes.filter((post) => !post.category));
};

module.exports = { orderPostsByVotes, orderPostsForExport };
