import { YpCodeBase } from "./YpCodeBaseclass.js";

export class YpServerApiBase extends YpCodeBase {
  protected baseUrlPath = "/api";

  static transformCollectionTypeToApi(type: string): string {
    let transformedApiType;

    switch (type) {
      case "domain":
        transformedApiType = "domains";
        break;
      case "community":
        transformedApiType = "communities";
        break;
      case "group":
        transformedApiType = "groups";
        break;
      case "post":
        transformedApiType = "posts";
        break;
      case "user":
        transformedApiType = "users";
        break;
      default:
        transformedApiType = "";
        console.error(`Cant find collection type transform for ${type}`);
    }

    return transformedApiType;
  }

  protected async fetchWrapper(
    url: string,
    options: RequestInit = {},
    showUserError = true,
    errorId: string | undefined = undefined,
    throwError: boolean = false
  ) {
    if (!options.headers) {
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    if (
      !navigator.onLine &&
      options.method === "POST" &&
      window.fetch !== undefined
    ) {
      window.appGlobals.offline.sendWhenOnlineNext({
        body: options.body,
        method: options.method,
        params: {},
        url: url,
      });
      throw new Error("offlineSendLater");
    } else if (
      !navigator.onLine &&
      ["POST", "PUT", "DELETE"].indexOf(options.method!) > -1
    ) {
      this.showToast(this.t("youAreOfflineCantSend"));
      throw new Error("offlineSendLater");
    } else {
      const response = await fetch(url, options);
      return await this.handleResponse(
        response,
        showUserError,
        errorId,
        throwError
      );
    }
  }

  accessError() {
    if (!navigator.onLine) {
      this.showToast(this.t("youAreOffline"));
    } else {
      window.appUser.loginFor401(window.appGlobals.retryMethodAfter401Login);
    }
  }

  protected async handleResponse(
    response: Response,
    showUserError: boolean,
    errorId: string | undefined = undefined,
    throwError = false
  ) {
    if (response.ok) {
      let responseJson = null;
      try {
        responseJson = await response.json();
      } catch (error) {
        if (
          response.status === 200 || response.status === 204 ||
          (response.statusText === "OK" && response.status != 401)
        ) {
          // Do nothing
        } else if (response.status === 401) {
          this.accessError();
        } else {
          this.fireGlobal("yp-network-error", {
            response: response,
            jsonError: error,
            showUserError,
            errorId,
          });

          if (throwError) {
            throw error;
          }
        }
      }
      if (responseJson !== null) {
        return responseJson;
      } else {
        return true;
      }
    } else {
      if (response.status == 401) {
        this.accessError();
      } else {
        this.fireGlobal("yp-network-error", {
          response: response,
          showUserError,
          errorId,
        });

        if (throwError) {
          throw response.statusText;
        }
        return null;
      }
    }
  }
}
