import { YpCodeBase } from './YpCodeBaseclass.js';

export class YpServerApi extends YpCodeBase {
  protected baseUrlPath = '/api';

  private async fetchWrapper(url: string, options: RequestInit =  {}, showUserError = true) {
    if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(url, options);
    this.handleResponse(response, showUserError);
  }

  private async handleResponse(response: Response, showUserError: boolean) {
    if (response.ok) {
      let responseJson = null;
      try {
        responseJson = await response.json();
      } catch (error) {
        this.fireGlobal('yp-network-error', {
          response: response,
          jsonError: error,
          showUserError,
        });
      }
      return responseJson;
    } else {
      this.fireGlobal('yp-network-error', {
        response: response,
        showUserError,
      });
      return null;
    }
  }

  public boot() {
    return this.fetchWrapper(this.baseUrlPath + '/domains');
  }

  public isloggedin() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/loggedInUser/isloggedin'
    );
  }

  public getAdminRights() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/loggedInUser/adminRights'
    );
  }

  public getMemberships() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/loggedInUser/memberships'
    );
  }

  public logout() {
    return this.fetchWrapper(this.baseUrlPath + '/users/logout', {
      method: 'POST',
    });
  }

  public setLocale(body: object) {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/loggedInUser/setLocale',
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getRecommendationsForGroup(groupId: number) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/recommendations/groups/${groupId}/getPostRecommendations`
    );
  }

  public hasVideoUploadSupport() {
    return this.fetchWrapper(
      this.baseUrlPath + '/videos/hasVideoUploadSupport'
    );
  }

  public hasAudioUploadSupport() {
    return this.fetchWrapper(
      this.baseUrlPath + '/audios/hasAudioUploadSupport'
    );
  }

  public sendVideoView(body: object) {
    return this.fetchWrapper(
      this.baseUrlPath + '/videos/videoView',
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public sendAudioView(body: object) {
    return this.fetchWrapper(
      this.baseUrlPath + '/audios/videoView',
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public createActivityFromApp(body: object) {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/createActivityFromApp',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public marketingTrackingOpen(groupId: number, body: object) {
    return this.fetchWrapper(
      this.baseUrlPath + `/groups/${groupId}/marketingTrackingOpen`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public triggerTrackingGoal(groupId: number, body: object) {
    return this.fetchWrapper(
      this.baseUrlPath + `/groups/${groupId}/triggerTrackingGoal`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getCollection(collectionApiType: string, collectionId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${collectionApiType}/${collectionId}`
    );
  }
}
