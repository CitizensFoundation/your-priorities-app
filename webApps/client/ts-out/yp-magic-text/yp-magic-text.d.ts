import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/button/filled-tonal-button.js";
export declare class YpMagicText extends YpBaseElement {
    content: string | undefined;
    truncatedContent: string | undefined;
    postfixText: string;
    contentId: number | undefined;
    extraId: number | undefined;
    additionalId: number | undefined;
    unsafeHtml: boolean;
    textType: string | undefined;
    contentLanguage: string | undefined;
    processedContent: string | undefined;
    finalContent: string | undefined;
    autoTranslate: boolean;
    truncate: number | undefined;
    moreText: string | undefined;
    closeDialogText: string | undefined;
    textOnly: boolean;
    isDialog: boolean;
    disableTranslation: boolean;
    simpleFormat: boolean;
    skipSanitize: boolean;
    removeUrls: boolean;
    isFetchingTranslation: boolean;
    structuredQuestionsConfig: string | undefined;
    linkifyCutoff: number;
    widetext: boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    static get doubleWidthLanguages(): string[];
    static get cyrillicLanguages(): string[];
    static get widerLanguages(): string[];
    get showMoreText(): boolean;
    _openFullScreen(): void;
    subClassProcessing(): void;
    get translatedContent(): string;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _autoTranslateEvent(event: CustomEvent): void;
    _languageEvent(event: CustomEvent): void;
    get indexKey(): string;
    _startTranslationAndFinalize(): Promise<void>;
    _update(): void;
    _setupStructuredQuestions(): void;
    _finalize(): void;
    _linksAndEmojis(): void;
    static truncateText(input: string, length: number, killwords?: string | undefined, end?: number | undefined): string;
    static trim(input: string): string;
}
//# sourceMappingURL=yp-magic-text.d.ts.map