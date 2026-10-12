import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";

// The server returns at most this many ideas, and as many comments, newest
// first. Keep in step with MODERATION_LIST_LIMIT in
// server_api/src/utils/moderationOrder.cjs.
export const MODERATION_LIST_LIMIT = 7500;

export function mayBeCapped(shown: number): boolean {
  return shown >= MODERATION_LIST_LIMIT;
}

export function moderationCountLabel(
  shown: number,
  total: number | undefined,
  words: { items: string; showingNewest: string; of: string }
): string {
  const n = YpFormattingHelpers.number;
  if (total !== undefined && total > shown) {
    return `${words.showingNewest} ${n(shown)} ${words.of} ${n(total)} ${words.items}`;
  }
  if (total === undefined && mayBeCapped(shown)) {
    return `${n(shown)}+ ${words.items}`;
  }
  return `${n(shown)} ${words.items}`;
}
