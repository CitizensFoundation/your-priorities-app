import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-button.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/progress/linear-progress.js';
import { YpAdminPage } from './yp-admin-page.js';
export declare class YpAdminTranslations extends YpAdminPage {
    items: Array<YpTranslationTextData> | undefined;
    waitingOnData: boolean;
    editActive: Record<string, boolean>;
    collection: YpCollectionData | undefined;
    targetLocale: string | undefined;
    baseMaxLength: number | undefined;
    supportedLanguages: Record<string, string>;
    static get styles(): any[];
    getTranslationText(): Promise<void>;
    constructor();
    connectedCallback(): void;
    selectLanguage(event: CustomEvent): void;
    openEdit(item: YpTranslationTextData): void;
    cancelEdit(item: YpTranslationTextData): void;
    saveItem(item: YpTranslationTextData, options?: {
        saveDirectly: boolean;
    } | undefined): void;
    autoTranslate(item: YpTranslationTextData): Promise<void>;
    getUrlFromTextType(item: YpTranslationTextData): string | null;
    get languages(): {
        locale: string;
        name: string;
    }[];
    getMaxLength(item: YpTranslationTextData, baseLength: number): number;
    textChanged(event: CustomEvent): void;
    renderItem(item: YpTranslationTextData): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-admin-translations.d.ts.map