import { YpServerApiBase } from './YpServerApiBase.js';
export class YpServerApi extends YpServerApiBase {
    boot() {
        return this.fetchWrapper(this.baseUrlPath + '/domains');
    }
    isloggedin() {
        return this.fetchWrapper(this.baseUrlPath + '/users/loggedInUser/isloggedin');
    }
    getAdminRights() {
        return this.fetchWrapper(this.baseUrlPath + '/users/loggedInUser/adminRights');
    }
    getMemberships() {
        return this.fetchWrapper(this.baseUrlPath + '/users/loggedInUser/memberships');
    }
    getAdminRightsWithNames() {
        return this.fetchWrapper(this.baseUrlPath + '/users/loggedInUser/adminRightsWithNames');
    }
    getMembershipsWithNames() {
        return this.fetchWrapper(this.baseUrlPath + '/users/loggedInUser/membershipsWithNames');
    }
    logout() {
        return this.fetchWrapper(this.baseUrlPath + '/users/logout', {
            method: 'POST',
        });
    }
    setLocale(body) {
        return this.fetchWrapper(this.baseUrlPath + '/users/loggedInUser/setLocale', {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    getRecommendationsForGroup(groupId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/recommendations/groups/${groupId}/getPostRecommendations`, {
            method: 'PUT',
            body: JSON.stringify({}),
        });
    }
    hasVideoUploadSupport() {
        return this.fetchWrapper(this.baseUrlPath + '/videos/hasVideoUploadSupport');
    }
    hasAudioUploadSupport() {
        return this.fetchWrapper(this.baseUrlPath + '/audios/hasAudioUploadSupport');
    }
    sendVideoView(body) {
        return this.fetchWrapper(this.baseUrlPath + '/videos/videoView', {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    sendAudioView(body) {
        return this.fetchWrapper(this.baseUrlPath + '/audios/videoView', {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    createActivityFromApp(body) {
        return this.fetchWrapper(this.baseUrlPath + '/users/createActivityFromApp', {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    marketingTrackingOpen(groupId, body) {
        return this.fetchWrapper(this.baseUrlPath + `/groups/${groupId}/marketingTrackingOpen`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    createApiKey() {
        return this.fetchWrapper(this.baseUrlPath + `/users/createApiKey`, {
            method: 'POST',
            body: JSON.stringify({}),
        }, false);
    }
    triggerTrackingGoal(groupId, body) {
        return this.fetchWrapper(this.baseUrlPath + `/groups/${groupId}/triggerTrackingGoal`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    startGeneratingAiImage(collectionType, collectionId, imageType, prompt) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${YpServerApi.transformCollectionTypeToApi(collectionType)}/${collectionId}/start_generating/ai_image`, {
            method: 'POST',
            body: JSON.stringify({ prompt, imageType }),
        });
    }
    getPromoterRights() {
        return this.fetchWrapper(this.baseUrlPath + '/users/loggedInUser/promoterRights');
    }
    pollForGeneratingAiImage(collectionType, collectionId, jobId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${YpServerApi.transformCollectionTypeToApi(collectionType)}/${collectionId}/${jobId}/poll_for_generating_ai_image`);
    }
    getCollection(collectionType, collectionId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${YpServerApi.transformCollectionTypeToApi(collectionType)}/${collectionId}`);
    }
    getCategoriesCount(id, tabName) {
        return this.fetchWrapper(this.baseUrlPath + `/groups/${id}/categories_count/${tabName}`);
    }
    getGroupPosts(searchUrl) {
        return this.fetchWrapper(searchUrl);
    }
    getPost(postId) {
        return this.fetchWrapper(this.baseUrlPath + `/post/${postId}`);
    }
    getGroup(groupId) {
        return this.fetchWrapper(this.baseUrlPath + `/groups/${groupId}`);
    }
    endorsePost(postId, method, body) {
        return this.fetchWrapper(this.baseUrlPath + `/posts/${postId}/endorse`, {
            method: method,
            body: JSON.stringify(body),
        }, false);
    }
    getHasNonOpenPosts(groupId) {
        return this.fetchWrapper(this.baseUrlPath + `/groups/${groupId}/checkNonOpenPosts`);
    }
    getHelpPages(collectionType, collectionId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${YpServerApi.transformCollectionTypeToApi(collectionType)}/${collectionId}/pages`);
    }
    getTranslation(translateUrl) {
        return this.fetchWrapper(translateUrl);
    }
    getTranslatedRegistrationQuestions(groupId, targetLanguage) {
        return this.fetchWrapper(this.baseUrlPath +
            `/groups/${groupId}/translatedRegistrationQuestions?targetLanguage=${targetLanguage}`);
    }
    sendRegistrationQuestions(registrationAnswers) {
        return this.fetchWrapper(this.baseUrlPath + `/users/setRegistrationAnswers`, {
            method: "PUT",
            body: JSON.stringify({
                registration_answers: registrationAnswers,
            }),
        }, true);
    }
    savePostTranscript(postId, body) {
        return this.fetchWrapper(this.baseUrlPath + `/posts/${postId}/editTranscript`, {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    getPostTranscriptStatus(groupId, tabName) {
        return this.fetchWrapper(this.baseUrlPath + `/groups/${groupId}/categories_count/${tabName}`);
    }
    addPoint(groupId, body) {
        return this.fetchWrapper(this.baseUrlPath + `/points/${groupId}`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    completeMediaPoint(mediaType, pointId, body) {
        return this.fetchWrapper(this.baseUrlPath + `/${mediaType}/${pointId}/completeAndAddToPoint`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    completeMediaPost(mediaType, method, postId, body) {
        return this.fetchWrapper(this.baseUrlPath + `/${mediaType}/${postId}/completeAndAddToPost`, {
            method: method,
            body: JSON.stringify(body),
        }, false);
    }
    getPoints(postId) {
        return this.fetchWrapper(this.baseUrlPath + `/posts/${postId}/points`);
    }
    getMorePoints(postId, offsetUp, offsetDown) {
        return this.fetchWrapper(this.baseUrlPath +
            `/posts/${postId}/points?offsetUp=${offsetUp}&offsetDown=${offsetDown}`);
    }
    getNewPoints(postId, latestPointCreatedAt) {
        return this.fetchWrapper(this.baseUrlPath +
            `/posts/${postId}/newPoints?latestPointCreatedAt=${latestPointCreatedAt}`);
    }
    getSurveyTranslations(post, language) {
        return this.fetchWrapper(this.baseUrlPath +
            `/posts/${post.id}/translatedSurvey?targetLanguage=${language}&groupId=${post.Group.id}`);
    }
    getSurveyQuestionsTranslations(group, language) {
        return this.fetchWrapper(this.baseUrlPath +
            `/groups/${group.id}/translatedSurveyQuestions?targetLanguage=${language}`);
    }
    getVideoFormatsAndImages(videoId) {
        return this.fetchWrapper(this.baseUrlPath + `/videos/${videoId}/formatsAndImages`);
    }
    getGroupConfiguration(groupId) {
        return this.fetchWrapper(this.baseUrlPath + `/groups/${groupId}/configuration`);
    }
    setVideoCover(videoId, body) {
        return this.fetchWrapper(this.baseUrlPath + `/videos/${videoId}/setVideoCover`, {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    getTranscodingJobStatus(mediaType, mediaId, jobId) {
        return this.fetchWrapper(this.baseUrlPath + `/${mediaType}/${mediaId}/getTranscodingJobStatus`, {
            method: 'PUT',
            body: JSON.stringify({ jobId }),
        });
    }
    startTranscoding(mediaType, mediaId, startType, body) {
        return this.fetchWrapper(this.baseUrlPath + `/${mediaType}/${mediaId}/${startType}`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    createPresignUrl(mediaUrl, body = {}) {
        return this.fetchWrapper(mediaUrl, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    updatePoint(pointId, body) {
        return this.fetchWrapper(this.baseUrlPath + `/points/${pointId}`, {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    updatePointAdminComment(groupId, pointId, body) {
        return this.fetchWrapper(this.baseUrlPath + `/groups/${groupId}/${pointId}/adminComment`, {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    deletePoint(pointId) {
        return this.fetchWrapper(this.baseUrlPath + `/points/${pointId}`, {
            method: 'DELETE',
            body: JSON.stringify({}),
        }, false);
    }
    checkPointTranscriptStatus(type, pointId) {
        return this.fetchWrapper(this.baseUrlPath + `/$points/${pointId}/${type}`);
    }
    registerUser(body) {
        return this.fetchWrapper(this.baseUrlPath + `/users/register`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    async registerAnonymously(body) {
        return this.fetchWrapper(this.baseUrlPath + `/users/register_anonymously`, {
            method: "POST",
            body: JSON.stringify(body),
        }, false);
    }
    loginUser(body) {
        return this.fetchWrapper(this.baseUrlPath + `/users/login`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    getAoiTotalStats(domainId) {
        return this.fetchWrapper(`/api/allOurIdeas/${domainId}/getAoiSiteStats`);
    }
    submitForm(url, method, headers, body) {
        return this.fetchWrapper(this.baseUrlPath + url, {
            method: method,
            headers: headers,
            body: body,
        }, false, "formError");
    }
    getSurveyGroup(surveyGroupId) {
        return this.fetchWrapper(this.baseUrlPath + `/groups/${surveyGroupId}/survey`);
    }
    postSurvey(surveyGroupId, body) {
        return this.fetchWrapper(this.baseUrlPath + `/groups/${surveyGroupId}/survey`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    deleteActivity(type, collectionId, activityId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${type}/${collectionId}/${activityId}/delete_activity`, {
            method: 'DELETE',
            body: JSON.stringify({}),
        }, false);
    }
    getAcActivities(url) {
        return this.fetchWrapper(url);
    }
    getRecommendations(typeName, typeId) {
        return this.fetchWrapper(this.baseUrlPath + `/recommendations/${typeName}/${typeId}`);
    }
    setNotificationsAsViewed(body) {
        return this.fetchWrapper(this.baseUrlPath + `/notifications/setIdsViewed`, {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    setNotificationsAllAsViewed() {
        return this.fetchWrapper(this.baseUrlPath + `/notifications/markAllViewed`, {
            method: 'PUT',
            body: JSON.stringify({}),
        }, false);
    }
    getAcNotifications(url) {
        return this.fetchWrapper(url);
    }
    getComments(type, pointId) {
        return this.fetchWrapper(this.baseUrlPath + `/${type}/${pointId}/comments`);
    }
    getCommentsCount(type, pointId) {
        return this.fetchWrapper(this.baseUrlPath + `/${type}/${pointId}/commentsCount`);
    }
    postComment(type, id, body) {
        return this.fetchWrapper(this.baseUrlPath + `/${type}/${id}/comment`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    setPointQuality(pointId, method, body) {
        return this.fetchWrapper(this.baseUrlPath + `/points/${pointId}/pointQuality`, {
            method: method,
            body: JSON.stringify(body),
        }, false);
    }
    postNewsStory(url, body) {
        return this.fetchWrapper(url, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    pointUrlPreview(urlParams) {
        return this.fetchWrapper(this.baseUrlPath + `/points/url_preview?${urlParams}`);
    }
    disconnectSamlLogin() {
        return this.fetchWrapper(this.baseUrlPath + '/users/disconnectSamlLogin', {
            method: 'DELETE',
            body: JSON.stringify({}),
        }, false);
    }
    disconnectFacebookLogin() {
        return this.fetchWrapper(this.baseUrlPath + '/users/disconnectFacebookLogin', {
            method: 'DELETE',
            body: JSON.stringify({}),
        }, false);
    }
    deleteUser() {
        return this.fetchWrapper(this.baseUrlPath + '/users/delete_current_user', {
            method: 'DELETE',
            body: JSON.stringify({}),
        }, false);
    }
    anonymizeUser() {
        return this.fetchWrapper(this.baseUrlPath + '/users/anonymize_current_user', {
            method: 'DELETE',
            body: JSON.stringify({}),
        }, false);
    }
    resetPassword(token, body) {
        return this.fetchWrapper(this.baseUrlPath + `/users/reset/${token}`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    setEmail(body) {
        return this.fetchWrapper(this.baseUrlPath + `/users/missingEmail/setEmail`, {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    linkAccounts(body) {
        return this.fetchWrapper(this.baseUrlPath + `/users/missingEmail/linkAccounts`, {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    confirmEmailShown() {
        return this.fetchWrapper(this.baseUrlPath + `/users/missingEmail/emailConfirmationShown`, {
            method: 'PUT',
            body: JSON.stringify({}),
        }, false, 'forgotPassword');
    }
    forgotPassword(body) {
        return this.fetchWrapper(this.baseUrlPath + `/users/forgot_password`, {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    acceptInvite(token) {
        return this.fetchWrapper(this.baseUrlPath + `/users/accept_invite/${token}`, {
            method: 'POST',
            body: JSON.stringify({}),
        }, false, 'acceptInvite');
    }
    getInviteSender(token) {
        return this.fetchWrapper(this.baseUrlPath + `/users/get_invite_info/${token}`, { method: 'GET' }, false, 'acceptInvite');
    }
    getPostLocations(type, id) {
        return this.fetchWrapper(this.baseUrlPath + `/${type}/${id}/post_locations`);
    }
    hasAutoTranslation() {
        return this.fetchWrapper(this.baseUrlPath + `/users/has/AutoTranslation`);
    }
    apiAction(url, method, body) {
        return this.fetchWrapper(url, {
            method: method,
            body: JSON.stringify(body),
        }, false);
    }
    getImages(postId) {
        return this.fetchWrapper(this.baseUrlPath + `/images/${postId}/user_images`);
    }
    postRating(postId, ratingIndex, body) {
        return this.fetchWrapper(this.baseUrlPath + `/ratings/${postId}/${ratingIndex}`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    deleteRating(postId, ratingIndex) {
        return this.fetchWrapper(this.baseUrlPath + `/ratings/${postId}/${ratingIndex}`, {
            method: 'DELETE',
            body: JSON.stringify({}),
        }, false);
    }
}
//# sourceMappingURL=YpServerApi.js.map