import { YpServerApi } from "../common/YpServerApi.js";
import { YpCodeBase } from "../common/YpCodeBaseclass.js";
export declare class YpAppUser extends YpCodeBase {
    serverApi: YpServerApi;
    loginForAcceptInviteParams: {
        token: string;
        editDialog: HTMLElement;
    } | null;
    loginForEditParams: {
        editDialog: HTMLElement;
        newOrUpdate: boolean;
        params: object;
        refreshFunction: Function;
    } | null;
    loginForNewPointParams: {
        postPointsElement: HTMLElement;
        params: {
            value: number;
            content: string;
        };
    } | null;
    loginForEndorseParams: {
        postActionElement: HTMLElement;
        params: {
            value: number;
        };
    } | null;
    loginForRatingsParams: {
        postActionElement: HTMLElement;
    } | null;
    loginForPointQualityParams: {
        pointActionElement: HTMLElement;
        params: {
            value: number;
        };
    } | null;
    loginForMembershipParams: {
        membershipActionElement: HTMLElement;
        params: {
            value: string;
            content: string;
        };
    } | null;
    loginFor401refreshFunction: Function | undefined;
    loginForNotificationSettingsParams: boolean;
    toastLoginTextCombined: string | undefined;
    toastLogoutTextCombined: string | undefined;
    user: YpUserData | null | undefined;
    endorsementPostsIndex: Record<number, YpEndorsement>;
    groupCurrentVoteCountIndex: Record<number, number>;
    ratingPostsIndex: Record<number, Record<number, YpRatingData>>;
    membershipsIndex: Record<string, Record<number, boolean>>;
    pointQualitiesIndex: Record<number, YpPointQuality>;
    adminRights: YpAdminRights | undefined;
    promoterRights: YpPromoterRights | undefined;
    memberships: YpMemberships | undefined;
    completeExternalLoginText: string | undefined;
    isPollingForLogin: boolean;
    lastLoginMethod: string | undefined;
    facebookPopupWindow: Window | null;
    samlPopupWindow: Window | null;
    pollingStartedAt: number | undefined;
    hasIssuedLogout: boolean;
    sessionPrefix: string;
    sessionStorage: Storage;
    browserFingerprint: string | undefined;
    browserFingerprintConfidence: number | undefined;
    constructor(serverApi: YpServerApi, skipRegularInit?: boolean);
    getBrowserId(): string | null;
    _setupBrowserFingerprint(): void;
    _generateRandomString(length: number): string | null;
    sessionHas(key: string): boolean;
    sessionGet(key: string): any;
    sessionSet(key: string, value: string | object): void;
    sessionUnset(key: string): void;
    sessionClear(): void;
    loginForAcceptInvite(editDialog: HTMLElement, token: string, email: string, collectionConfiguration: object | undefined): void;
    loginForEdit(editDialog: HTMLElement, newOrUpdate: boolean, params: object, refreshFunction: Function): void;
    loginForNewPoint(postPointsElement: HTMLElement, params: {
        value: number;
        content: string;
    }): void;
    loginForEndorse(postActionElement: HTMLElement, params: {
        value: number;
    }): void;
    loginForRatings(postActionElement: HTMLElement): void;
    loginForPointQuality(pointActionElement: HTMLElement, params: {
        value: number;
    }): void;
    loginForMembership(membershipActionElement: HTMLElement, params: {
        value: string;
        content: string;
    }): void;
    loginFor401(refreshFunction: Function): void;
    loginForNotificationSettings(): void;
    openUserlogin(email?: string | undefined, collectionConfiguration?: object | undefined): void;
    autoAnonymousLogin(): void;
    _closeUserLogin(): void;
    _setUserLoginSpinner(): void;
    _handleLogin(user: YpUserData): void;
    _checkLoginForParameters(): void;
    openNotificationSettings(): void;
    _forgotPassword(event: CustomEvent): void;
    _resetPassword(event: CustomEvent): void;
    setLoggedInUser(user: YpUserData): void;
    removeAnonymousUser(): void;
    removeUserSession(): void;
    loggedIn(): boolean;
    setLocale(locale: string): Promise<void>;
    cancelLoginPolling(): void;
    _closeAllPopups(): void;
    pollForLogin(): Promise<void>;
    startPollingForLogin(): void;
    loginFromFacebook(): void;
    loginFromSaml(): void;
    _completeExternalLogin(fromString: string): void;
    checkLogin(): void;
    recheckAdminRights(): void;
    getPromoterRights(): Promise<void>;
    updateEndorsementForPost(postId: number, newEndorsement: YpEndorsement, group?: YpGroupData | undefined): void;
    calculateVotesLeftForGroup(group: YpGroupData): void;
    _updateEndorsementPostsIndex(user: YpUserData): void;
    _updateRatingPostsIndex(user: YpUserData): void;
    updateRatingForPost(postId: number, typeIndex: number, newRating: YpRatingData | undefined): void;
    updatePointQualityForPost(pointId: number, newPointQuality: YpPointQuality): void;
    _updatePointQualitiesIndex(user: YpUserData): void;
    _onUserChanged(event: CustomEvent): void;
    logout(): Promise<void>;
    checkRegistrationAnswersCurrent(): void;
    setHasRegistrationAnswers(): void;
    _checkRegistrationAnswers(user: YpUserData): void;
    isloggedin(): Promise<void>;
    getAdminRights(): Promise<void>;
    _updateMembershipsIndex(memberships: YpMemberships): void;
    getMemberShips(): Promise<void>;
}
//# sourceMappingURL=YpAppUser.d.ts.map