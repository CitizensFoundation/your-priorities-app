import { YpCodeBase } from './YpCodeBaseclass.js';

export class YpServerApiBase extends YpCodeBase {
  protected baseUrlPath = '/api';

  static transformCollectionTypeToApi(type: string): string {
    let transformedApiType;

    switch (type) {
      case 'domain':
        transformedApiType = 'domains';
        break;
      case 'community':
        transformedApiType = 'communities';
        break;
      case 'group':
        transformedApiType = 'groups';
        break;
      case 'post':
        transformedApiType = 'posts';
        break;
      case 'user':
        transformedApiType = 'users';
        break;
      default:
        transformedApiType = '';
        console.error(`Cant find collection type transform for ${type}`);
    }

    return transformedApiType;
  }

  protected async fetchWrapper(
    url: string,
    options: RequestInit = {},
    showUserError = true,
    errorId: string | undefined = undefined
  ) {
    if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/json',
      };
    }
    const response = await fetch(url, options);
    return this.handleResponse(response, showUserError, errorId);
  }

  protected async handleResponse(
    response: Response,
    showUserError: boolean,
    errorId: string | undefined = undefined
  ) {
    if (response.ok) {
      let responseJson = null;
      try {
        responseJson = await response.json();
      } catch (error) {
        if (response.status === 200 && response.statusText === 'OK') {
          // Do nothing
        } else {
          this.fireGlobal('yp-network-error', {
            response: response,
            jsonError: error,
            showUserError,
            errorId,
          });
        }
      }
      if (responseJson!==null) {
        return responseJson;
      } else {
        return true;
      }
    } else {
      this.fireGlobal('yp-network-error', {
        response: response,
        showUserError,
        errorId,
      });
      return null;
    }
  }
}
