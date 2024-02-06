// Assuming data.js exports a record with language codes as keys and objects with name and nativeName as values
import { LANGUAGES_LIST } from './languageData.js';
const LANGUAGES = {};
const LANGUAGES_BY_NAME = {};
const LANGUAGE_CODES = [];
const LANGUAGE_NAMES = [];
const LANGUAGE_NATIVE_NAMES = [];
for (const code in LANGUAGES_LIST) {
    const { name, nativeName } = LANGUAGES_LIST[code];
    const language = { code, name, nativeName };
    LANGUAGES[code] = LANGUAGES_BY_NAME[name.toLowerCase()] = LANGUAGES_BY_NAME[nativeName.toLowerCase()] = language;
    LANGUAGE_CODES.push(code);
    LANGUAGE_NAMES.push(name);
    LANGUAGE_NATIVE_NAMES.push(nativeName);
}
export class ISO6391 {
    static getLanguages(codes = []) {
        return codes.map(code => ISO6391.validate(code)
            ? { ...LANGUAGES[code] }
            : { code, name: '', nativeName: '' });
    }
    static getName(code) {
        return ISO6391.validate(code) ? LANGUAGES_LIST[code].name : '';
    }
    static getAllNames() {
        return [...LANGUAGE_NAMES];
    }
    static getNativeName(code) {
        return ISO6391.validate(code) ? LANGUAGES_LIST[code].nativeName : '';
    }
    static getAllNativeNames() {
        return [...LANGUAGE_NATIVE_NAMES];
    }
    static getCode(name) {
        name = name.toLowerCase();
        return LANGUAGES_BY_NAME.hasOwnProperty(name)
            ? LANGUAGES_BY_NAME[name].code
            : '';
    }
    static getAllCodes() {
        return [...LANGUAGE_CODES];
    }
    static validate(code) {
        return LANGUAGES_LIST.hasOwnProperty(code);
    }
}
//# sourceMappingURL=iso6391.js.map