import { YpBaseElement } from '../common/yp-base-element.js';
type Constructor<T> = new (...args: any[]) => T;
export declare class YpPostBaseWithAnswersInterface {
    autoTranslate: boolean;
    translatedQuestions: string[] | undefined;
    post: YpPostData | undefined;
    translatedAnswers: string[] | undefined;
    addGlobalListener?: Function;
    structuredAnswersFormatted: string;
    getIndexTranslationKey: Function;
}
export declare const YpPostBaseWithAnswers: <T extends Constructor<YpBaseElement>>(superClass: T) => Constructor<YpPostBaseWithAnswersInterface> & T;
export {};
//# sourceMappingURL=yp-post-base-with-answers.d.ts.map