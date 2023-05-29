import { YpServerApi } from "./@yrpri/common/YpServerApi";
import { YpAppGlobals } from "./@yrpri/yp-app/YpAppGlobals";

export class LandUseAppGlobals extends YpAppGlobals {
  async setupGroup() {
    // Get the ID from the URL like /ID or /ID/ or /ID? or /ID/? or /ID/anything
    let groupId;

    if (window.location.href.indexOf("/land_use/")>-1) {
      groupId = window.location.pathname.split("/")[2];
    } else {
      groupId = window.location.pathname.split("/")[1];
    }

    if (groupId) {
      groupId = groupId.split("?")[0];
    }
    if (groupId) {
      const groupResults = await this.serverApi.getGroup(parseInt(groupId)) as YpGroupResults;
      this.currentGroup = groupResults.group;
      this.currentAnonymousGroup = groupResults.group;
      setTimeout(() => {
        this.setRegistrationQuestionGroup(this.currentGroup );
      }, 1000);
      return this.currentGroup;
    } else {
      console.error("No group ID found in URL");
      return undefined;
    }
  }
}
