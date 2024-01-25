import { YpCodeBase } from '../common/YpCodeBaseclass.js';
export declare class YpAnalytics extends YpCodeBase {
    pixelTrackerId: string | undefined;
    communityTrackerId: string | undefined;
    communityTrackerIds: Record<string, boolean>;
    setupGoogleAnalytics(domain: YpDomainData): void;
    facebookPixelTracking(event: string, detailedEvent?: string | undefined): void;
    setCommunityPixelTracker(trackerId: string | undefined): void;
    setCommunityAnalyticsTracker(trackerId: string | undefined): void;
    sendToAnalyticsTrackers(a: string | object, b: string | object, c: string | object, d?: string | object | undefined, e?: string | object | undefined, f?: string | object | undefined): void;
    sendLoginAndSignup(userId: number, eventType: string, authProvider: string, validationError?: string | undefined): void;
}
//# sourceMappingURL=YpAnalytics.d.ts.map