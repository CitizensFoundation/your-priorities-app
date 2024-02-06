// Assuming data.js exports a record with language codes as keys and objects with name and nativeName as values
import {LANGUAGES_LIST} from './languageData.js';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const LANGUAGES: Record<string, Language> = {};
const LANGUAGES_BY_NAME: Record<string, Language> = {};
const LANGUAGE_CODES: string[] = [];
const LANGUAGE_NAMES: string[] = [];
const LANGUAGE_NATIVE_NAMES: string[] = [];

for (const code in LANGUAGES_LIST) {
  const { name, nativeName } = LANGUAGES_LIST[code];
  const language: Language = { code, name, nativeName };
  LANGUAGES[code] = LANGUAGES_BY_NAME[name.toLowerCase()] = LANGUAGES_BY_NAME[nativeName.toLowerCase()] = language;
  LANGUAGE_CODES.push(code);
  LANGUAGE_NAMES.push(name);
  LANGUAGE_NATIVE_NAMES.push(nativeName);
}

export class ISO6391 {
  static getLanguages(codes: string[] = []): Language[] {
    return codes.map(code =>
      ISO6391.validate(code)
        ? { ...LANGUAGES[code] }
        : { code, name: '', nativeName: '' }
    );
  }

  static getName(code: string): string {
    return ISO6391.validate(code) ? LANGUAGES_LIST[code].name : '';
  }

  static getAllNames(): string[] {
    return [...LANGUAGE_NAMES];
  }

  static getNativeName(code: string): string {
    return ISO6391.validate(code) ? LANGUAGES_LIST[code].nativeName : '';
  }

  static getAllNativeNames(): string[] {
    return [...LANGUAGE_NATIVE_NAMES];
  }

  static getCode(name: string): string {
    name = name.toLowerCase();
    return LANGUAGES_BY_NAME.hasOwnProperty(name)
      ? LANGUAGES_BY_NAME[name].code
      : '';
  }

  static getAllCodes(): string[] {
    return [...LANGUAGE_CODES];
  }

  static validate(code: string): boolean {
    return LANGUAGES_LIST.hasOwnProperty(code);
  }
}
