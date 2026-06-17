import { css } from "lit";
import { DateTime } from "luxon";

export const notificationTimeStyles = css`
  .notificationHeaderLine {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
    align-items: start;
  }

  .notificationHeaderMain {
    min-width: 0;
  }

  .notificationTimeChip {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    max-width: 126px;
    height: 20px;
    box-sizing: border-box;
    padding: 0 6px 0 5px;
    border-radius: 999px;
    background: color-mix(
      in srgb,
      var(--md-sys-color-primary-container) 62%,
      var(--md-sys-color-surface-container-lowest)
    );
    box-shadow: inset 0 0 0 1px
      color-mix(in srgb, var(--md-sys-color-primary) 18%, transparent);
    color: var(--md-sys-color-on-primary-container);
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    overflow: hidden;
    white-space: nowrap;
  }

  .notificationTimeChip md-icon {
    flex: 0 0 auto;
    width: 13px;
    height: 13px;
    font-size: 13px;
  }

  .notificationTimeChip span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

function locale() {
  return window.appGlobals?.locale?.replace(/_/g, "-") || undefined;
}

function parseDateTime(value: Date | string | undefined) {
  if (!value) return undefined;

  let dateTime =
    value instanceof Date
      ? DateTime.fromJSDate(value)
      : DateTime.fromISO(value);

  if (!dateTime.isValid && !(value instanceof Date)) {
    dateTime = DateTime.fromJSDate(new Date(value));
  }

  return dateTime.isValid ? dateTime.setLocale(locale()) : undefined;
}

export function getNotificationDateTime(
  notification: AcNotificationData | undefined
) {
  return parseDateTime(
    notification?.created_at || notification?.AcActivities?.[0]?.created_at
  );
}

export function getNotificationLongTime(
  notification: AcNotificationData | undefined
) {
  const dateTime = getNotificationDateTime(notification);
  return dateTime
    ? dateTime.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
    : "";
}

export function getNotificationShortTime(
  notification: AcNotificationData | undefined
) {
  const dateTime = getNotificationDateTime(notification);
  if (!dateTime) return "";

  const now = DateTime.now().setLocale(locale());
  const secondsAgo = Math.max(
    0,
    Math.floor(now.diff(dateTime, "seconds").seconds)
  );
  const time = dateTime.toFormat("HH:mm");

  let dateText: string;
  if (secondsAgo < 60) {
    dateText = "now";
  } else if (secondsAgo < 60 * 60) {
    dateText = `${Math.floor(secondsAgo / 60)}m`;
  } else if (secondsAgo < 24 * 60 * 60) {
    dateText = `${Math.floor(secondsAgo / (60 * 60))}h`;
  } else if (secondsAgo < 7 * 24 * 60 * 60) {
    dateText = `${Math.floor(secondsAgo / (24 * 60 * 60))}d`;
  } else if (dateTime.hasSame(now, "year")) {
    dateText = dateTime.toLocaleString({
      day: "numeric",
      month: "short",
    });
  } else {
    dateText = dateTime.toLocaleString({
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  }

  return `${dateText} @ ${time}`;
}
