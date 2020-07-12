import { YpBaseMixin } from '../@yrpri/YpBaseMixin.js'

export class YpServerApi extends YpBaseMixin(class {})  {

  protected baseUrlPath = "/api"

  public fetchWrapper(url: string, options = {}) {
    return fetch(url, options).then(this.handleResponse);
  }

  public handleResponse (response: Response) {
    if (response.ok) {
      return response.json();
    } else {
      this.fire('yp-network-error', response);
      throw new Error(response.statusText);
    }
  }

  public boot() {
    return new Promise((resolve, reject)=>{
      this.fetchWrapper(this.baseUrlPath+'/domains')
      .then(data => resolve(data))
      .catch(error => reject(error)
      )
    });
  }
}
