import { YpBaseMixin } from '../@yrpri/YpBaseMixin.js'
import { YpCodeBase } from './YpCodeBase.js';

export class YpServerApi extends YpCodeBase  {

  protected baseUrlPath = "/api"

  private async fetchWrapper(url: string, options = {}, showUserError = true) {
    const response = await fetch(url, options);
    this.handleResponse(response, showUserError);
  }

  private handleResponse (response: Response, showUserError: boolean) {
    if (response.ok) {
      return response.json();
    } else {
      this.fireGlobal('yp-network-error', { response: response, showUserError });
      return null;
    }
  }

  public boot() {
    return this.fetchWrapper(this.baseUrlPath+'/domains');
  }

  public getRecommendationsForGroup(groupId: number) {
    return this.fetchWrapper(this.baseUrlPath+`/recommendations/groups/${groupId}/getPostRecommendations`);
  }

  public hasVideoUploadSupport() {
    return this.fetchWrapper(this.baseUrlPath+'/videos/hasVideoUploadSupport');
  }

  public hasAudioUploadSupport() {
    return this.fetchWrapper(this.baseUrlPath+'/videos/hasAudioUploadSupport');
  }

  public sendVideoView(body: object) {
    return this.fetchWrapper(this.baseUrlPath+'/videos/videoView', {
      method: "PUT",
      body: { body }
    }, false);
  }

  public sendAudioView(body: object) {
    return this.fetchWrapper(this.baseUrlPath+'/audios/videoView', {
      method: "PUT",
      body: { body }
    }, false);
  }

  public createActivityFromApp(body: object) {
    return this.fetchWrapper(this.baseUrlPath+'/users/createActivityFromApp', {
      method: "POST",
      body: { body }
    }, false);
  }

  public marketingTrackingOpen(groupId: number, body: object) {
    return this.fetchWrapper(this.baseUrlPath+`/groups/${groupId}/marketingTrackingOpen`, {
      method: "POST",
      body: { body }
    }, false);
  }

  public triggerTrackingGoal(groupId: number, body: object) {
    return this.fetchWrapper(this.baseUrlPath+`/groups/${groupId}/triggerTrackingGoal`, {
      method: "POST",
      body: { body }
    }, false);
  }

}
