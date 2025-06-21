import ISO6391 from "iso-639-1";

export class YpLanguages {
  static get allLanguages(): YpLanguageData[] {
    const allLanguages = ISO6391.getLanguages(ISO6391.getAllCodes()).map(
      (language) => {
        return {
          englishName: language.name,
          nativeName: language.nativeName,
          code: language.code as string,
        };
      }
    );

    YpLanguages.additionalLanguages.map((language) => {
      if (!allLanguages.find((lang) => lang.code === language.code)) {
        allLanguages.push(language as YpLanguageData);
      } else {
        //log.info("additionaLanguage already exists:", language.code);
      }
    });

    YpLanguages.googleTranslateLanguages.map((language) => {
      if (!allLanguages.find((lang) => lang.code === language.code)) {
        allLanguages.push(language as YpLanguageData);
      } else {
        //log.info("googleTranslateLanguages already exists:", language.code);
      }
    });

    return allLanguages;
  }

  static get isoCodesNotInGoogleTranslate() {
    return YpLanguages.allLanguages
      .map((languages) => languages.code)
      .filter(
        (code) =>
          !this.googleTranslateLanguages
            .map((languages) => languages.code)
            .includes(code)
      );
  }

  static getEnglishName(code: string): string | undefined {
    let name = YpLanguages.allLanguages.find(
      (language) => language.code.toLowerCase() === code.toLowerCase()
    )?.englishName;

    if (!name) {
      name = YpLanguages.allLanguages.find(
        (language) => language.code.toLowerCase() === code.toLowerCase().replace("_","-")
      )?.englishName;
    }

    return name;
  }

  static getNativeName(code: string): string | undefined {
    return YpLanguages.allLanguages.find(
      (language) => language.code.toLowerCase() === code.toLowerCase()
    )?.nativeName;
  }

  static additionalLanguages = [
    {
      englishName: "Arabic - Egypt",
      nativeName: "العربية",
      code: "ar-eg",
    },
    {
      englishName: "Portuguese - Brazil",
      nativeName: "Português",
      code: "pt-br",
    },
    {
      englishName: "Canadian",
      nativeName: "English",
      code: "en-ca",
    },
    {
      englishName: "British",
      nativeName: "English",
      code: "en-gb",
    },
    {
      englishName: "Serbian - Latin",
      nativeName: "Srpski",
      code: "sr-latin",
    },
    {
      englishName: "Mandarin",
      nativeName: "官话",
      code: "mnd",
    },
    {
      englishName: "Moldovan",
      nativeName: "Moldovenească",
      code: "ro-md",
    },
  ];

  static googleTranslateLanguages = [
    {
      englishName: "Afrikaans",
      nativeName: "Afrikaans",
      code: "af",
    },
    {
      englishName: "Albanian",
      nativeName: "Shqip",
      code: "sq",
    },
    {
      englishName: "Amharic",
      nativeName: "አማርኛ",
      code: "am",
    },
    {
      englishName: "Arabic",
      nativeName: "العربية",
      code: "ar",
    },
    {
      englishName: "Armenian",
      nativeName: "Հայերեն",
      code: "hy",
    },
    {
      englishName: "Assamese",
      nativeName: "অসমীয়া",
      code: "as",
    },
    {
      englishName: "Aymara",
      nativeName: "Aymar aru",
      code: "ay",
    },
    {
      englishName: "Azerbaijani",
      nativeName: "Azərbaycan dili",
      code: "az",
    },
    {
      englishName: "Bambara",
      nativeName: "Bamanankan",
      code: "bm",
    },
    {
      englishName: "Basque",
      nativeName: "Euskara",
      code: "eu",
    },
    {
      englishName: "Belarusian",
      nativeName: "Беларуская",
      code: "be",
    },
    {
      englishName: "Bengali",
      nativeName: "বাংলা",
      code: "bn",
    },
    {
      englishName: "Bhojpuri",
      nativeName: "भोजपुरी",
      code: "bho",
    },
    {
      englishName: "Bosnian",
      nativeName: "Bosanski",
      code: "bs",
    },
    {
      englishName: "Bulgarian",
      nativeName: "Български",
      code: "bg",
    },
    {
      englishName: "Catalan",
      nativeName: "Català",
      code: "ca",
    },
    {
      englishName: "Cebuano",
      nativeName: "Binisaya",
      code: "ceb",
    },
    {
      englishName: "Chinese (Simplified)",
      nativeName: "简体中文",
      code: "zh-cn",
    },
    {
      englishName: "Chinese (Traditional)",
      nativeName: "繁體中文",
      code: "zh-tw",
    },
    {
      englishName: "Corsican",
      nativeName: "Corsu",
      code: "co",
    },
    {
      englishName: "Croatian",
      nativeName: "Hrvatski",
      code: "hr",
    },
    {
      englishName: "Czech",
      nativeName: "Čeština",
      code: "cs",
    },
    {
      englishName: "Danish",
      nativeName: "Dansk",
      code: "da",
    },
    {
      englishName: "Dhivehi",
      nativeName: "ދިވެހި",
      code: "dv",
    },
    {
      englishName: "Dogri",
      nativeName: "डोगरी",
      code: "doi",
    },
    {
      englishName: "Dutch",
      nativeName: "Nederlands",
      code: "nl",
    },
    {
      englishName: "English",
      nativeName: "English",
      code: "en",
    },
    {
      englishName: "Esperanto",
      nativeName: "Esperanto",
      code: "eo",
    },
    {
      englishName: "Estonian",
      nativeName: "Eesti",
      code: "et",
    },
    {
      englishName: "Ewe",
      nativeName: "Eʋegbe",
      code: "ee",
    },
    {
      englishName: "Filipino (Tagalog)",
      nativeName: "Filipino",
      code: "fil",
    },
    {
      englishName: "Finnish",
      nativeName: "Suomi",
      code: "fi",
    },
    {
      englishName: "French",
      nativeName: "Français",
      code: "fr",
    },
    {
      englishName: "Frisian",
      nativeName: "Frysk",
      code: "fy",
    },
    {
      englishName: "Galician",
      nativeName: "Galego",
      code: "gl",
    },
    {
      englishName: "Georgian",
      nativeName: "ქართული",
      code: "ka",
    },
    {
      englishName: "German",
      nativeName: "Deutsch",
      code: "de",
    },
    {
      englishName: "Greek",
      nativeName: "Ελληνικά",
      code: "el",
    },
    {
      englishName: "Guarani",
      nativeName: "Avañe'ẽ",
      code: "gn",
    },
    {
      englishName: "Gujarati",
      nativeName: "ગુજરાતી",
      code: "gu",
    },
    {
      englishName: "Haitian Creole",
      nativeName: "Kreyòl ayisyen",
      code: "ht",
    },
    {
      englishName: "Hausa",
      nativeName: "Hausa",
      code: "ha",
    },
    {
      englishName: "Hawaiian",
      nativeName: "ʻŌlelo Hawaiʻi",
      code: "haw",
    },
    {
      englishName: "Hebrew",
      nativeName: "עברית",
      code: "he",
    },
    {
      englishName: "Hindi",
      nativeName: "हिन्दी",
      code: "hi",
    },
    {
      englishName: "Hmong",
      nativeName: "Hmoob",
      code: "hmn",
    },
    {
      englishName: "Hungarian",
      nativeName: "Magyar",
      code: "hu",
    },
    {
      englishName: "Icelandic",
      nativeName: "Íslenska",
      code: "is",
    },
    {
      englishName: "Igbo",
      nativeName: "Igbo",
      code: "ig",
    },
    {
      englishName: "Ilocano",
      nativeName: "Ilokano",
      code: "ilo",
    },
    {
      englishName: "Indonesian",
      nativeName: "Bahasa Indonesia",
      code: "id",
    },
    {
      englishName: "Irish",
      nativeName: "Gaeilge",
      code: "ga",
    },
    {
      englishName: "Italian",
      nativeName: "Italiano",
      code: "it",
    },
    {
      englishName: "Japanese",
      nativeName: "日本語",
      code: "ja",
    },
    {
      englishName: "Javanese",
      nativeName: "Basa Jawa",
      code: "jv",
    },
    {
      englishName: "Kannada",
      nativeName: "ಕನ್ನಡ",
      code: "kn",
    },
    {
      englishName: "Kazakh",
      nativeName: "Қазақ тілі",
      code: "kk",
    },
    {
      englishName: "Khmer",
      nativeName: "ខ្មែរ",
      code: "km",
    },
    {
      englishName: "Kinyarwanda",
      nativeName: "Ikinyarwanda",
      code: "rw",
    },
    {
      englishName: "Konkani",
      nativeName: "कोंकणी",
      code: "gom",
    },
    {
      englishName: "Korean",
      nativeName: "한국어",
      code: "ko",
    },
    {
      englishName: "Krio",
      nativeName: "Krio",
      code: "kri",
    },
    {
      englishName: "Kurdish",
      nativeName: "Kurdî",
      code: "ku",
    },
    {
      englishName: "Kurdish (Sorani)",
      nativeName: "کوردی سۆرانی",
      code: "ckb",
    },
    {
      englishName: "Kyrgyz",
      nativeName: "Кыргызча",
      code: "ky",
    },
    { englishName: "Lao", nativeName: "ລາວ", code: "lo" },
    {
      englishName: "Latin",
      nativeName: "Latina",
      code: "la",
    },
    {
      englishName: "Latvian",
      nativeName: "Latviešu",
      code: "lv",
    },
    {
      englishName: "Lingala",
      nativeName: "Lingála",
      code: "ln",
    },
    {
      englishName: "Lithuanian",
      nativeName: "Lietuvių",
      code: "lt",
    },
    {
      englishName: "Luganda",
      nativeName: "Luganda",
      code: "lg",
    },
    {
      englishName: "Luxembourgish",
      nativeName: "Lëtzebuergesch",
      code: "lb",
    },
    {
      englishName: "Macedonian",
      nativeName: "Македонски",
      code: "mk",
    },
    {
      englishName: "Maithili",
      nativeName: "मैथिली",
      code: "mai",
    },
    {
      englishName: "Malagasy",
      nativeName: "Malagasy",
      code: "mg",
    },
    {
      englishName: "Malay",
      nativeName: "Bahasa Melayu",
      code: "ms",
    },
    {
      englishName: "Malayalam",
      nativeName: "മലയാളം",
      code: "ml",
    },
    {
      englishName: "Maltese",
      nativeName: "Malti",
      code: "mt",
    },
    {
      englishName: "Maori",
      nativeName: "Māori",
      code: "mi",
    },
    {
      englishName: "Marathi",
      nativeName: "मराठी",
      code: "mr",
    },
    {
      englishName: "Meiteilon (Manipuri)",
      nativeName: "মৈতৈলোন্",
      code: "mni-mtei",
    },
    {
      englishName: "Mizo",
      nativeName: "Mizo ṭawng",
      code: "lus",
    },
    {
      englishName: "Mongolian",
      nativeName: "Монгол хэл",
      code: "mn",
    },
    {
      englishName: "Myanmar (Burmese)",
      nativeName: "ဗမာစာ",
      code: "my",
    },
    {
      englishName: "Nepali",
      nativeName: "नेपाली",
      code: "ne",
    },
    {
      englishName: "Norwegian",
      nativeName: "Norsk",
      code: "no",
    },
    {
      englishName: "Nyanja (Chichewa)",
      nativeName: "Chichewa",
      code: "ny",
    },
    {
      englishName: "Odia (Oriya)",
      nativeName: "ଓଡ଼ିଆ",
      code: "or",
    },
    {
      englishName: "Oromo",
      nativeName: "Afaan Oromoo",
      code: "om",
    },
    {
      englishName: "Pashto",
      nativeName: "پښتو",
      code: "ps",
    },
    {
      englishName: "Persian",
      nativeName: "فارسی",
      code: "fa",
    },
    {
      englishName: "Polish",
      nativeName: "Polski",
      code: "pl",
    },
    {
      englishName: "Portuguese (Portugal, Brazil)",
      nativeName: "Português",
      code: "pt",
    },
    {
      englishName: "Punjabi",
      nativeName: "ਪੰਜਾਬੀ",
      code: "pa",
    },
    {
      englishName: "Quechua",
      nativeName: "Runasimi",
      code: "qu",
    },
    {
      englishName: "Romanian",
      nativeName: "Română",
      code: "ro",
    },
    {
      englishName: "Russian",
      nativeName: "Русский",
      code: "ru",
    },
    {
      englishName: "Samoan",
      nativeName: "Gagana fa'a Sāmoa",
      code: "sm",
    },
    {
      englishName: "Sanskrit",
      nativeName: "संस्कृतम्",
      code: "sa",
    },
    {
      englishName: "Scots Gaelic",
      nativeName: "Gàidhlig",
      code: "gd",
    },
    {
      englishName: "Sepedi",
      nativeName: "Sepedi",
      code: "nso",
    },
    {
      englishName: "Serbian",
      nativeName: "Српски",
      code: "sr",
    },
    {
      englishName: "Sesotho",
      nativeName: "Sesotho",
      code: "st",
    },
    {
      englishName: "Shona",
      nativeName: "chiShona",
      code: "sn",
    },
    {
      englishName: "Sindhi",
      nativeName: "سنڌي",
      code: "sd",
    },
    {
      englishName: "Sinhala (Sinhalese)",
      nativeName: "සිංහල",
      code: "si",
    },
    {
      englishName: "Slovak",
      nativeName: "Slovenčina",
      code: "sk",
    },
    {
      englishName: "Slovenian",
      nativeName: "Slovenščina",
      code: "sl",
    },
    {
      englishName: "Somali",
      nativeName: "Soomaali",
      code: "so",
    },
    {
      englishName: "Spanish",
      nativeName: "Español",
      code: "es",
    },
    {
      englishName: "Sundanese",
      nativeName: "Basa Sunda",
      code: "su",
    },
    {
      englishName: "Swahili",
      nativeName: "Kiswahili",
      code: "sw",
    },
    {
      englishName: "Swedish",
      nativeName: "Svenska",
      code: "sv",
    },
    {
      englishName: "Tagalog (Filipino)",
      nativeName: "Tagalog",
      code: "tl",
    },
    {
      englishName: "Tajik",
      nativeName: "Тоҷикӣ",
      code: "tg",
    },
    {
      englishName: "Tamil",
      nativeName: "தமிழ்",
      code: "ta",
    },
    {
      englishName: "Tatar",
      nativeName: "Татар теле",
      code: "tt",
    },
    {
      englishName: "Telugu",
      nativeName: "తెలుగు",
      code: "te",
    },
    { englishName: "Thai", nativeName: "ไทย", code: "th" },
    {
      englishName: "Tigrinya",
      nativeName: "ትግርኛ",
      code: "ti",
    },
    {
      englishName: "Tsonga",
      nativeName: "Xitsonga",
      code: "ts",
    },
    {
      englishName: "Turkish",
      nativeName: "Türkçe",
      code: "tr",
    },
    {
      englishName: "Turkmen",
      nativeName: "Türkmen",
      code: "tk",
    },
    {
      englishName: "Twi (Akan)",
      nativeName: "Twi",
      code: "ak",
    },
    {
      englishName: "Ukrainian",
      nativeName: "Українська",
      code: "uk",
    },
    {
      englishName: "Urdu",
      nativeName: "اردو",
      code: "ur",
    },
    {
      englishName: "Uyghur",
      nativeName: "ئۇيغۇرچە",
      code: "ug",
    },
    {
      englishName: "Uzbek",
      nativeName: "O‘zbek",
      code: "uz",
    },
    {
      englishName: "Vietnamese",
      nativeName: "Tiếng Việt",
      code: "vi",
    },
    {
      englishName: "Welsh",
      nativeName: "Cymraeg",
      code: "cy",
    },
    {
      englishName: "Xhosa",
      nativeName: "isiXhosa",
      code: "xh",
    },
    {
      englishName: "Yiddish",
      nativeName: "ייִדיש",
      code: "yi",
    },
    {
      englishName: "Yoruba",
      nativeName: "Yorùbá",
      code: "yo",
    },
    {
      englishName: "Zulu",
      nativeName: "isiZulu",
      code: "zu",
    },
  ];
}
