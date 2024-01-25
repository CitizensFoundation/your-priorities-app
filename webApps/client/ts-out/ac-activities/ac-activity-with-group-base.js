var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { YpBaseElement } from '../common/yp-base-element.js';
import { property } from 'lit/decorators.js';
export class AcActivityWithGroupBase extends YpBaseElement {
    get hasGroupHeader() {
        return (this.activity &&
            this.activity.Group &&
            this.activity.Group.name !=
                'hidden_public_group_for_domain_level_points' &&
            !this.postId &&
            !this.groupId);
    }
    get groupTitle() {
        if (this.activity.Group && !!this.postId && !this.groupId) {
            let title = '';
            if (!this.communityId &&
                this.activity.Community &&
                this.activity.Community.name != this.activity.Group.name) {
                title += this.activity.Community.name + ' - ';
            }
            title += this.activity.Group.name;
            return title;
        }
        else {
            return '';
        }
    }
}
__decorate([
    property({ type: Number })
], AcActivityWithGroupBase.prototype, "postId", void 0);
__decorate([
    property({ type: Number })
], AcActivityWithGroupBase.prototype, "groupId", void 0);
__decorate([
    property({ type: Number })
], AcActivityWithGroupBase.prototype, "communityId", void 0);
__decorate([
    property({ type: Object })
], AcActivityWithGroupBase.prototype, "activity", void 0);
//# sourceMappingURL=ac-activity-with-group-base.js.map