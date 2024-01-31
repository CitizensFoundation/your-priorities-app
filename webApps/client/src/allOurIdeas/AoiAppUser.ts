import { YpServerApi } from "../common/YpServerApi.js";
import { YpAppUser } from "../yp-app/YpAppUser.js";

export class AoiAppUser extends YpAppUser {
  constructor(serverApi: YpServerApi, skipRegularInit = false) {
    super(serverApi, true);
  }
}