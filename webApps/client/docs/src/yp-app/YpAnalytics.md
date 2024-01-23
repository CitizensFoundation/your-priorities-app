# YpAnalytics

This class extends `YpCodeBase` and is responsible for handling analytics tracking, including Google Analytics and Facebook Pixel tracking.

## Properties

| Name                 | Type                        | Description                                      |
|----------------------|-----------------------------|--------------------------------------------------|
| pixelTrackerId       | string \| undefined         | The ID used for Facebook Pixel tracking.         |
| communityTrackerId   | string \| undefined         | The ID used for community-specific analytics tracking. |
| communityTrackerIds  | Record<string, boolean>     | A record of community tracker IDs that have been set up. |

## Methods

| Name                        | Parameters                                      | Return Type | Description                                                                 |
|-----------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| setupGoogleAnalytics        | domain: YpDomainData                            | void        | Sets up Google Analytics tracking based on the provided domain data.        |
| facebookPixelTracking       | event: string, detailedEvent: string \| undefined | void        | Tracks an event using Facebook Pixel.                                       |
| setCommunityPixelTracker    | trackerId: string \| undefined                  | void        | Sets the Facebook Pixel tracker ID for the community.                       |
| setCommunityAnalyticsTracker| trackerId: string \| undefined                  | void        | Sets the analytics tracker ID for the community.                            |
| sendToAnalyticsTrackers     | a: string\|object, b: string\|object, c: string\|object, d: string\|object\|undefined, e: string\|object\|undefined, f: string\|object\|undefined | void | Sends tracking information to the configured analytics trackers.            |
| sendLoginAndSignup          | userId: number, eventType: string, authProvider: string, validationError: string\|undefined | void | Sends login and signup event information to the analytics trackers. |

## Examples

```typescript
// Example usage of setting up community analytics tracker
const analytics = new YpAnalytics();
analytics.setCommunityAnalyticsTracker('your-community-tracker-id');

// Example usage of sending a pageview event to analytics trackers
analytics.sendToAnalyticsTrackers('send', 'pageview', '/your-page-path');

// Example usage of tracking a Facebook Pixel event
analytics.facebookPixelTracking('pageview');
```