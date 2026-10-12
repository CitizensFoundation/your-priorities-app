"use strict";

// The moderation screens load every matching idea and comment in one request,
// so each list is capped. Keep in step with MODERATION_LIST_LIMIT in
// webApps/client/src/yp-moderation/moderationCount.ts.
const MODERATION_LIST_LIMIT = 7500;

// Without a leading created_at the capped query returns whichever rows
// Postgres reaches first, so the newest items could be the ones left out.
function newestFirst(order) {
  return [["created_at", "DESC"], ["id", "DESC"], ...order];
}

module.exports = { MODERATION_LIST_LIMIT, newestFirst };
