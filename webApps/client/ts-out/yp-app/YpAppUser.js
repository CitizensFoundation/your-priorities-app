import { YpCodeBase } from "../common/YpCodeBaseclass.js";
import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
export class YpAppUser extends YpCodeBase {
    constructor(serverApi, skipRegularInit = false) {
        super();
        this.loginForAcceptInviteParams = null;
        this.loginForEditParams = null;
        this.loginForNewPointParams = null;
        this.loginForEndorseParams = null;
        this.loginForRatingsParams = null;
        this.loginForPointQualityParams = null;
        this.loginForMembershipParams = null;
        this.loginForNotificationSettingsParams = false;
        this.endorsementPostsIndex = {};
        this.groupCurrentVoteCountIndex = {};
        this.ratingPostsIndex = {};
        this.membershipsIndex = {};
        this.pointQualitiesIndex = {};
        this.isPollingForLogin = false;
        this.facebookPopupWindow = null;
        this.samlPopupWindow = null;
        this.hasIssuedLogout = false;
        this.sessionPrefix = "session_";
        this.sessionStorage = window.localStorage;
        this.serverApi = serverApi;
        this._setupBrowserFingerprint();
        if (!skipRegularInit) {
            if (!window.location.pathname.startsWith("/survey/")) {
                this.checkLogin();
            }
            else {
                console.log("Not checking login in survey mode");
            }
            this.addGlobalListener("yp-forgot-password", this._forgotPassword.bind(this));
            this.addGlobalListener("yp-reset-password", this._resetPassword.bind(this));
        }
    }
    getBrowserId() {
        var currentId = localStorage.getItem("aoi-brid");
        if (!currentId) {
            currentId = this._generateRandomString(32);
            if (currentId)
                localStorage.setItem("yp-brid", currentId);
            else
                console.error("Could not generate browser id");
        }
        return currentId;
    }
    _setupBrowserFingerprint() {
        try {
            var fpPromise = FingerprintJS.load({
                monitoring: false,
            });
            fpPromise
                .then((fp) => fp.get())
                .then((result) => {
                this.browserFingerprint = result.visitorId;
                this.browserFingerprintConfidence = result.confidence.score;
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    _generateRandomString(length) {
        if (!length)
            length = 36;
        if (window.crypto) {
            var a = window.crypto.getRandomValues(new Uint32Array(3)), token = "";
            for (var i = 0, l = a.length; i < l; i++)
                token += a[i].toString(36);
            return token;
        }
        else {
            console.log("Not checking login in survey mode");
            return null;
        }
    }
    sessionHas(key) {
        const prefixed_key = this.sessionPrefix + key;
        const value = this.sessionStorage.getItem(prefixed_key);
        return value !== null;
    }
    sessionGet(key) {
        const prefixed_key = this.sessionPrefix + key;
        const value = this.sessionStorage.getItem(prefixed_key);
        let parsed;
        if (value) {
            try {
                parsed = JSON.parse(value);
            }
            catch (e) {
                parsed = null;
            }
        }
        return parsed;
    }
    sessionSet(key, value) {
        const prefixed_key = this.sessionPrefix + key;
        const stringfied = JSON.stringify(value);
        this.sessionStorage.setItem(prefixed_key, stringfied);
    }
    sessionUnset(key) {
        const prefixed_key = this.sessionPrefix + key;
        this.sessionStorage.removeItem(prefixed_key);
    }
    sessionClear() {
        this.sessionStorage.clear();
    }
    loginForAcceptInvite(editDialog, token, email, collectionConfiguration) {
        this.loginForAcceptInviteParams = { editDialog: editDialog, token: token };
        this.openUserlogin(email, collectionConfiguration);
    }
    loginForEdit(editDialog, newOrUpdate, params, refreshFunction) {
        this.loginForEditParams = {
            editDialog: editDialog,
            newOrUpdate: newOrUpdate,
            params: params,
            refreshFunction: refreshFunction,
        };
        this.openUserlogin();
    }
    loginForNewPoint(postPointsElement, params) {
        this.loginForNewPointParams = {
            postPointsElement: postPointsElement,
            params: params,
        };
        this.openUserlogin();
    }
    loginForEndorse(postActionElement, params) {
        this.loginForEndorseParams = {
            postActionElement: postActionElement,
            params: params,
        };
        this.openUserlogin();
    }
    loginForRatings(postActionElement) {
        this.loginForRatingsParams = { postActionElement: postActionElement };
        this.openUserlogin();
    }
    loginForPointQuality(pointActionElement, params) {
        this.loginForPointQualityParams = {
            pointActionElement: pointActionElement,
            params: params,
        };
        this.openUserlogin();
    }
    loginForMembership(membershipActionElement, params) {
        this.loginForMembershipParams = {
            membershipActionElement: membershipActionElement,
            params: params,
        };
        this.openUserlogin();
    }
    loginFor401(refreshFunction) {
        this.loginFor401refreshFunction = refreshFunction;
        this.openUserlogin();
    }
    loginForNotificationSettings() {
        this.loginForNotificationSettingsParams = true;
        this.openUserlogin();
    }
    openUserlogin(email = undefined, collectionConfiguration = undefined) {
        if (!window.appDialogs) {
            this.addGlobalListener("yp-app-dialogs-ready", this.openUserlogin.bind(this));
        }
        else {
            window.appDialogs.getDialogAsync("userLogin", (dialog) => {
                dialog.setup(this._handleLogin.bind(this), window.appGlobals.domain);
                dialog.openDialog(undefined, email, collectionConfiguration);
            });
        }
    }
    autoAnonymousLogin() {
        setTimeout(() => {
            if (this.user == null) {
                window.appDialogs.getDialogAsync("userLogin", (dialog) => {
                    dialog.setup(this._handleLogin.bind(this), window.appGlobals.domain);
                    dialog.anonymousLogin();
                });
            }
            else {
                console.log("Not doing auto anon login as user already exists");
            }
        }, 1);
    }
    _closeUserLogin() {
        window.appDialogs.closeDialog("userLogin");
    }
    _setUserLoginSpinner() {
        window.appDialogs.getDialogAsync("userLogin", (dialog) => {
            dialog.userSpinner = false;
        });
    }
    _handleLogin(user) {
        this._closeUserLogin();
        this.setLoggedInUser(user);
        if (user.profile_data && user.profile_data.isAnonymousUser) {
            console.debug("Do not fetch admin or memberships for anonymous users");
        }
        else {
            this.getAdminRights();
            this.getPromoterRights();
            this.getMemberShips();
            this.toastLoginTextCombined =
                this.t("user.loginCompleteFor") + " " + this.user?.name;
            this.fireGlobal("yp-open-toast", { text: this.toastLoginTextCombined });
        }
        this._checkLoginForParameters();
        // Redirect to another local service after login, for example the analytics app
        setTimeout(() => {
            if (window.appGlobals.originalQueryParameters &&
                window.appGlobals.originalQueryParameters["raLogin"]) {
                window.location.href = window.appGlobals.originalQueryParameters["raLogin"];
            }
        });
        setTimeout(() => {
            this._checkRegistrationAnswers(user);
        }, 450);
    }
    _checkLoginForParameters() {
        //TODO: Get working again
        if (this.loginForEditParams) {
            const loginParams = this.loginForEditParams;
            // TODO: Remove any
            window.appDialogs.getDialogAsync(loginParams.editDialog, (dialog) => {
                dialog.setup(null, true, loginParams.refreshFunction);
                dialog.open('new', loginParams.params);
                this.loginForEditParams = null;
            });
        }
        else if (this.loginForNewPointParams) {
            const newPointParams = this.loginForNewPointParams;
            //newPointParams.postPointsElement.addPoint(newPointParams.params.content, newPointParams.params.value);
            this.loginForNewPointParams = null;
        }
        else if (this.loginForEndorseParams) {
            const endorseParams = this.loginForEndorseParams;
            endorseParams.postActionElement.generateEndorsementFromLogin(endorseParams.params.value);
            this.loginForEndorseParams = null;
        }
        else if (this.loginForRatingsParams) {
            const ratingsParams = this.loginForRatingsParams;
            ratingsParams.postActionElement.openRatingsDialog();
            this.loginForRatingsParams = null;
        }
        else if (this.loginForPointQualityParams) {
            const pointQualityParams = this.loginForPointQualityParams;
            pointQualityParams.pointActionElement.generatePointQualityFromLogin(pointQualityParams.params.value);
            this.loginForPointQualityParams = null;
        }
        else if (this.loginForMembershipParams) {
            const membershipParams = this.loginForMembershipParams;
            //(membershipParams.membershipActionElement as YpMemberships).generateMembershipFromLogin(membershipParams.params.value);
            this.loginForMembershipParams = null;
        }
        else if (this.loginForAcceptInviteParams) {
            const acceptInviteParams = this.loginForAcceptInviteParams;
            // TODO: Remove any
            window.appDialogs.getDialogAsync("acceptInvite", (dialog) => {
                dialog.reOpen(acceptInviteParams.token);
                dialog.afterLogin(acceptInviteParams.token);
                this.loginForAcceptInviteParams = null;
            });
        }
        else if (this.loginFor401refreshFunction) {
            this.loginFor401refreshFunction();
        }
        else if (this.loginForNotificationSettingsParams) {
            this.openNotificationSettings();
        }
    }
    openNotificationSettings() {
        // TODO: Remove any
        window.appDialogs.getDialogAsync("userEdit", (dialog) => {
            dialog.setup(window.appUser.user, false, null, true);
            dialog.open("edit", { userId: window.appUser.user?.id });
        });
    }
    _forgotPassword(event) {
        // TODO: Remove any
        window.appDialogs.getDialogAsync("forgotPassword", (dialog) => {
            dialog.open(event.detail);
        });
    }
    _resetPassword(event) {
        // TODO: Remove any
        window.appDialogs.getDialogAsync("resetPassword", (dialog) => {
            dialog.open(event.detail);
        });
    }
    getUser() {
        return this.sessionGet("user");
    }
    setLoggedInUser(user) {
        this.sessionSet("user", user);
        this.user = user;
        this.fireGlobal("yp-logged-in", this.user);
        // TODO: Look at this. Fire another signal a bit later in case some components had not set up their listeners
        //setTimeout(() => {
        //  this.fireGlobal('yp-logged-in', this.user);
        //}, 1000);
        window.appGlobals.analytics.sendLoginAndSignup(user.id, "Login Success", this.lastLoginMethod ? this.lastLoginMethod : "Email");
        this.lastLoginMethod = undefined;
        if (user && user.profile_data && user.profile_data.isAnonymousUser) {
            window.appGlobals.setAnonymousUser(user);
        }
        else {
            window.appGlobals.setAnonymousUser(undefined);
        }
        window.appGlobals.offline.checkContentToSendForLoggedInUser();
    }
    removeAnonymousUser() {
        console.log("Remove anon user");
        this.removeUserSession();
    }
    removeUserSession() {
        this.sessionUnset("user");
        this.user = null;
        window.appGlobals.setAnonymousUser(undefined);
        this.fireGlobal("yp-logged-in", null);
    }
    loggedIn() {
        let isCorrectLoginProviderAndAgency = true;
        if (window.appGlobals.currentForceSaml && window.appGlobals.currentGroup) {
            if (!YpAccessHelpers.checkGroupAccess(window.appGlobals.currentGroup)) {
                if (this.user) {
                    if (this.user.loginProvider !== "saml")
                        isCorrectLoginProviderAndAgency = false;
                    if (window.appGlobals.currentGroup &&
                        window.appGlobals.currentGroup.configuration &&
                        window.appGlobals.currentGroup.configuration
                            .forceSecureSamlEmployeeLogin) {
                        if (!this.user.isSamlEmployee) {
                            isCorrectLoginProviderAndAgency = false;
                        }
                    }
                }
                else {
                    isCorrectLoginProviderAndAgency = false;
                }
            }
        }
        return this.user != null && isCorrectLoginProviderAndAgency;
    }
    async setLocale(locale) {
        await this.serverApi.setLocale({ locale: locale });
    }
    cancelLoginPolling() {
        this.pollingStartedAt = undefined;
    }
    _closeAllPopups() {
        if (this.facebookPopupWindow) {
            try {
                this.facebookPopupWindow.close();
            }
            catch (error) {
                console.error(error);
            }
            this.facebookPopupWindow = null;
        }
        if (this.samlPopupWindow) {
            try {
                this.samlPopupWindow.close();
            }
            catch (error) {
                console.error(error);
            }
            this.samlPopupWindow = null;
        }
    }
    async pollForLogin() {
        if (this.pollingStartedAt) {
            const user = (await this.serverApi.isloggedin());
            if (user && user.notLoggedIn === true && this.pollingStartedAt) {
                const timeSpent = Date.now() - this.pollingStartedAt;
                if (timeSpent < 5 * 60 * 1000) {
                    setTimeout(() => {
                        this.pollForLogin();
                    }, 1200);
                }
                else {
                    this.pollingStartedAt = undefined;
                }
            }
            else if (user && user.name) {
                this.fireGlobal("yp-logged-in-via-polling", user);
                this.cancelLoginPolling();
                if (this.facebookPopupWindow) {
                    this.loginFromFacebook();
                }
                else if (this.samlPopupWindow) {
                    this.loginFromSaml();
                }
                this._closeAllPopups();
            }
        }
        else {
            console.error("Unkown state in polling...");
            this._closeAllPopups();
            this.cancelLoginPolling();
        }
    }
    startPollingForLogin() {
        this.pollingStartedAt = Date.now();
        setTimeout(() => {
            this.pollForLogin();
        }, 1000);
    }
    loginFromFacebook() {
        this.cancelLoginPolling();
        this.lastLoginMethod = "Facebook";
        this._completeExternalLogin(this.t("user.loggedInWithFacebook"));
    }
    loginFromSaml() {
        this.cancelLoginPolling();
        this.lastLoginMethod = "Saml2";
        this._completeExternalLogin(this.t("user.loggedInWithSaml"));
    }
    _completeExternalLogin(fromString) {
        this.checkLogin();
        this._setUserLoginSpinner();
        this.completeExternalLoginText = fromString;
    }
    checkLogin() {
        this.isloggedin();
        this.getMemberShips();
        this.getAdminRights();
        this.getPromoterRights();
    }
    recheckAdminRights() {
        this.getAdminRights();
        this.getPromoterRights();
    }
    async getPromoterRights() {
        const response = (await this.serverApi.getPromoterRights());
        if (response) {
            this.promoterRights = response;
            this.fireGlobal("yp-got-promoter-rights", true);
        }
        else {
            this.promoterRights = undefined;
            this.fireGlobal("yp-got-promoter-rights", false);
        }
    }
    updateEndorsementForPost(postId, newEndorsement, group = undefined) {
        if (this.user) {
            if (!this.user.Endorsements) {
                this.user.Endorsements = [];
            }
            let hasChanged = false;
            for (let i = 0; i < this.user.Endorsements.length; i++) {
                if (this.user.Endorsements[i].post_id === postId) {
                    if (newEndorsement) {
                        this.user.Endorsements[i] = newEndorsement;
                    }
                    else {
                        this.user.Endorsements.splice(i, 1);
                    }
                    hasChanged = true;
                    break;
                }
            }
            if (!hasChanged && newEndorsement)
                this.user.Endorsements.push(newEndorsement);
            this._updateEndorsementPostsIndex(this.user);
        }
        else {
            console.error("Can't find user for updateEndorsementForPost");
        }
        if (group &&
            group.configuration &&
            group.configuration.maxNumberOfGroupVotes) {
            this.calculateVotesLeftForGroup(group);
        }
        else {
            this.fireGlobal("got-endorsements-and-qualities", null);
        }
    }
    calculateVotesLeftForGroup(group) {
        setTimeout(() => {
            if (this.user && this.user.Endorsements) {
                const lastVoteCount = this.groupCurrentVoteCountIndex[group.id];
                this.groupCurrentVoteCountIndex[group.id] =
                    this.user.Endorsements.filter(function (endorsement) {
                        return (endorsement.Post &&
                            endorsement.Post.group_id === group.id &&
                            endorsement.value !== -1 &&
                            endorsement.value !== 0);
                    }).length;
                if (lastVoteCount != this.groupCurrentVoteCountIndex[group.id]) {
                    const text = `${this.t("youHaveUsed")} ${this.groupCurrentVoteCountIndex[group.id]} ${this.t("ofNumber")} ${group.configuration.maxNumberOfGroupVotes} ${this.t("votesForGroup")}`;
                    window.appDialogs.getDialogAsync("masterToast", (toast) => {
                        toast.labelText = text;
                        toast.open = true;
                        toast.timeoutMs = 4000;
                    });
                }
                this.fireGlobal("got-endorsements-and-qualities", {
                    maxGroupId: group.id,
                    groupCurrentVoteCount: this.groupCurrentVoteCountIndex[group.id],
                });
            }
            else {
                console.warn("No user or endorsements for calculateVotesLeftForGroup");
            }
        });
    }
    _updateEndorsementPostsIndex(user) {
        if (user && user.Endorsements && user.Endorsements.length > 0) {
            this.endorsementPostsIndex = {};
            for (let i = 0; i < user.Endorsements.length; i++) {
                this.endorsementPostsIndex[user.Endorsements[i].post_id] =
                    user.Endorsements[i];
            }
        }
        else {
            this.endorsementPostsIndex = {};
        }
    }
    _updateRatingPostsIndex(user) {
        if (user && user.Ratings && user.Ratings.length > 0) {
            this.ratingPostsIndex = {};
            for (let i = 0; i < user.Ratings.length; i++) {
                if (!this.ratingPostsIndex[user.Ratings[i].post_id])
                    this.ratingPostsIndex[user.Ratings[i].post_id] = {};
                this.ratingPostsIndex[user.Ratings[i].post_id][user.Ratings[i].type_index] = user.Ratings[i];
            }
        }
        else {
            this.ratingPostsIndex = {};
        }
    }
    updateRatingForPost(postId, typeIndex, newRating) {
        if (this.user) {
            if (!this.user.Ratings) {
                this.user.Ratings = [];
            }
            let hasChanged = false;
            for (let i = 0; i < this.user.Ratings.length; i++) {
                if (this.user.Ratings[i].post_id === postId &&
                    this.user.Ratings[i].type_index === typeIndex) {
                    if (newRating) {
                        this.user.Ratings[i] = newRating;
                    }
                    else {
                        this.user.Ratings.splice(i, 1);
                    }
                    hasChanged = true;
                    break;
                }
            }
            if (!hasChanged && newRating)
                this.user.Ratings.push(newRating);
            this._updateRatingPostsIndex(this.user);
        }
        else {
            console.error("Can't find user for updateRatingForPost");
        }
    }
    updatePointQualityForPost(pointId, newPointQuality) {
        if (this.user) {
            if (this.user.PointQualities) {
                let hasChanged = false;
                for (let i = 0; i < this.user.PointQualities.length; i++) {
                    if (this.user.PointQualities[i].point_id === pointId) {
                        if (newPointQuality) {
                            this.user.PointQualities[i] = newPointQuality;
                        }
                        else {
                            this.user.PointQualities.splice(i, 1);
                        }
                        hasChanged = true;
                        break;
                    }
                }
                if (hasChanged)
                    this._updatePointQualitiesIndex(this.user);
            }
        }
        else {
            console.error("Can't find user for updatePointQualityForPost");
        }
    }
    _updatePointQualitiesIndex(user) {
        if (user && user.PointQualities && user.PointQualities.length > 0) {
            this.pointQualitiesIndex = {};
            for (let i = 0; i < user.PointQualities.length; i++) {
                this.pointQualitiesIndex[user.PointQualities[i].point_id] =
                    user.PointQualities[i];
            }
        }
        else {
            this.pointQualitiesIndex = {};
        }
    }
    _onUserChanged(user) {
        if (user) {
            this._updateEndorsementPostsIndex(user);
            this._updatePointQualitiesIndex(user);
            this._updateRatingPostsIndex(user);
            this.fireGlobal("got-endorsements-and-qualities", null);
        }
    }
    async logout() {
        this.hasIssuedLogout = true;
        (await this.serverApi.logout());
        this.removeUserSession();
        const moveUserToHomePageLocation = true;
        if (moveUserToHomePageLocation) {
            window.location.href = "/";
        }
        else {
            this.toastLogoutTextCombined =
                this.t("user.logoutCompleteFor") + " " + this.user?.name;
            this.fireGlobal("yp-open-toast", { text: this.toastLogoutTextCombined });
            this.fireGlobal("yp-close-right-drawer", true);
            this.recheckAdminRights();
        }
    }
    checkRegistrationAnswersCurrent() {
        if (this.user) {
            this._checkRegistrationAnswers(this.user);
        }
    }
    setHasRegistrationAnswers() {
        if (this.user) {
            this.user.hasRegistrationAnswers = true;
        }
    }
    _checkRegistrationAnswers(user) {
        if (user &&
            !user.notLoggedIn &&
            window.appGlobals.registrationQuestionsGroup &&
            !user.hasRegistrationAnswers &&
            (!window.appGlobals.currentAnonymousUser ||
                (window.appGlobals.currentAnonymousUser &&
                    window.appGlobals.registrationQuestionsGroup.configuration
                        .anonymousAskRegistrationQuestions))) {
            window.appDialogs.getDialogAsync("registrationQuestions", (dialog /*YpRegistrationQuestionsDialog*/) => {
                dialog.open(window.appGlobals.registrationQuestionsGroup);
            });
        }
        else {
            this.fireGlobal("yp-registration-questions-done");
        }
    }
    async isloggedin() {
        const user = (await this.serverApi.isloggedin());
        if (user && user.notLoggedIn === true) {
            this.removeUserSession();
        }
        else if (user &&
            user.name &&
            user.profile_data &&
            user.profile_data.isAnonymousUser) {
            setTimeout(() => {
                if (window.appGlobals.currentAnonymousGroup) {
                    this.setLoggedInUser(user);
                }
                else {
                    window.appGlobals.setAnonymousUser(user);
                }
            }, 500);
        }
        else if (user && user.name) {
            this.setLoggedInUser(user);
        }
        if (user && user.missingEmail) {
            // TODO: Remove any
            window.appDialogs.getDialogAsync("missingEmail", (dialog) => {
                dialog.open(user.loginProvider);
            });
        }
        else if (user &&
            user.profile_data &&
            user.profile_data.saml_show_confirm_email_completed === false) {
            // TODO: Remove any
            window.appDialogs.getDialogAsync("missingEmail", (dialog) => {
                dialog.open(user.loginProvider, true, user.email);
            });
        }
        setTimeout(() => {
            if (this.lastLoginMethod === "Saml2" ||
                this.lastLoginMethod === "Facebook") {
                this._checkRegistrationAnswers(user);
            }
        }, 250);
        if (user) {
            if (user.customSamlDeniedMessage) {
                window.appGlobals.currentSamlDeniedMessage =
                    user.customSamlDeniedMessage;
            }
            else {
                window.appGlobals.currentSamlDeniedMessage = undefined;
            }
            if (user.customSamlLoginMessage) {
                window.appGlobals.currentSamlLoginMessage = user.customSamlLoginMessage;
            }
            else {
                window.appGlobals.currentSamlLoginMessage = undefined;
            }
            if (user.forceSecureSamlLogin) {
                window.appGlobals.currentForceSaml = true;
            }
            else {
                window.appGlobals.currentForceSaml = false;
            }
        }
        if (this.completeExternalLoginText) {
            window.appGlobals.notifyUserViaToast(this.completeExternalLoginText);
            this._closeUserLogin();
            this.completeExternalLoginText = undefined;
            this._checkLoginForParameters();
        }
    }
    async getAdminRights() {
        const response = (await this.serverApi.getAdminRights());
        if (response) {
            this.adminRights = response;
            this.fireGlobal("yp-got-admin-rights", true);
            //TODO: Check this outFire another signal a bit later in case some components had not set up their listeners TODO: Find a better way
            /*setTimeout(() => {
              this.fireGlobal('yp-got-admin-rights', true);
            }, 1000);*/
        }
        else {
            if (this.adminRights) {
                this.adminRights = undefined;
                this.fireGlobal("yp-got-admin-rights", false);
            }
        }
        this.fireGlobal("yp-have-checked-admin-rights");
    }
    _updateMembershipsIndex(memberships) {
        if (memberships) {
            let i;
            this.membershipsIndex = { groups: {}, communities: {}, domains: {} };
            for (i = 0; i < memberships.GroupUsers.length; i++) {
                this.membershipsIndex.groups[memberships.GroupUsers[i].id] = true;
            }
            for (i = 0; i < memberships.CommunityUsers.length; i++) {
                this.membershipsIndex.communities[memberships.CommunityUsers[i].id] = true;
            }
            for (i = 0; i < memberships.DomainUsers.length; i++) {
                this.membershipsIndex.domains[memberships.DomainUsers[i].id] = true;
            }
        }
        else {
            this.membershipsIndex = { groups: {}, communities: {}, domains: {} };
        }
    }
    async getMemberShips() {
        const response = (await this.serverApi.getMemberships());
        if (response) {
            this.memberships = response;
            this._updateMembershipsIndex(this.memberships);
            this.fireGlobal("yp-got-memberships", true);
        }
        else if (this.memberships) {
            this.memberships = undefined;
            this.fireGlobal("yp-got-memberships", false);
        }
    }
}
//# sourceMappingURL=YpAppUser.js.map