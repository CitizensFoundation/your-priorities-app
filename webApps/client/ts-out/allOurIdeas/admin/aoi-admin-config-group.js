var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from "lit/decorators";
import { YpAdminConfigGroup } from "../../admin/yp-admin-config-group";
let AoiAdminConfigGroup = class AoiAdminConfigGroup extends YpAdminConfigGroup {
    setupConfigTabs() {
        const tabs = [];
        tabs.push(this._getAccessTab());
        tabs.push(this._getThemeTab());
        const postsTab = this._getPostSettingsTab();
        if (!this.isGroupFolder) {
            tabs.push(postsTab);
        }
        tabs.push(this._getVoteSettingsTab());
        tabs.push(this._getPointSettingsTab());
        tabs.push(this._getAdditionalConfigTab());
        this.tabsPostSetup(tabs);
        return tabs;
    }
};
AoiAdminConfigGroup = __decorate([
    customElement("aoi-admin-config-group")
], AoiAdminConfigGroup);
export { AoiAdminConfigGroup };
//# sourceMappingURL=aoi-admin-config-group.js.map