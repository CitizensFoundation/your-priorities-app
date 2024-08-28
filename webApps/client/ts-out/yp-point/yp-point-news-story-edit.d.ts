import { nothing } from "lit";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/text-button.js";
import "../yp-user/yp-user-image.js";
import "./yp-point-news-story-embed.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
export declare class YpPointNewsStoryEdit extends YpBaseElementWithLogin {
    loadingUrlPreview: boolean;
    loadingPostStory: boolean;
    label: string | undefined;
    addLabel: string | undefined;
    point: YpPointData | undefined;
    postId: number | undefined;
    postGroupId: number | undefined;
    groupId: number | undefined;
    communityId: number | undefined;
    domainId: number | undefined;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
    _clearButtonStat(): void;
    connectedCallback(): void;
    firstUpdated(props: Map<string | number | symbol, unknown>): void;
    get newPointContent(): string;
    disconnectedCallback(): void;
    _reset(): void;
    _sendStory(): Promise<void>;
    _clearButtonState(): void;
    _keyDown(event: KeyboardEvent): void;
    _clearEmbed(): void;
    _checkForUrl(): Promise<void>;
}
//# sourceMappingURL=yp-point-news-story-edit.d.ts.map