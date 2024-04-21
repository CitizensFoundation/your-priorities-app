# Languages

Video.js includes localization support to present text in a language other than the default English where appropriate.

For an up-to-date list of the languages Video.js supports, see the [languages folder (`lang`)][lang-supported].
Some translations may be less complete than others - see the [translations needed doc][translations-needed] for a table of strings that are missing from the translations available.  Contributions are welcome to update those that are incomplete.

## Table of Contents

* [Using Video.js Languages](#using-videojs-languages)
* [Contributing to Video.js Translations](#contributing-to-videojs-translations)
  * [JSON Format](#json-format)
  * [File Naming](#file-naming)
  * [Updating an Existing Translation](#updating-an-existing-translation)
  * [Writing a New Translation](#writing-a-new-translation)
  * [Adding Languages via the API](#adding-languages-via-the-api)
  * [Per-Player Translations](#per-player-translations)
  * [Setting Player Language](#setting-player-language)
  * [Determining Player Language](#determining-player-language)
    * [Internal Language Selection](#internal-language-selection)
* [References](#references)

## Using Video.js Languages

Video.js ships with multiple translations (in `dist/lang/`) in JavaScript files.
Add the lang script for each language you need to support.
Each of these files can be included in a web page to provide support for that language in _all_ Video.js players:

```html
<script src="//example.com/path/to/video.min.js"></script>
<script src="//example.com/path/to/lang/es.js"></script>
```

## Contributing to Video.js Translations

We welcome new translations and improvements to existing ones! Please see the [contributing document](../../CONTRIBUTING.md) to get started contributing to Video.js and continue reading for specifics on how to contribute to translations of Video.js.

### JSON Format

Video.js uses a JSON object to describe a language, where the keys are English and the values are the target language. For example, a Spanish translation might look like this:

```JSON
{
  "Play": "Reproducción",
  "Pause": "Pausa",
  "Current Time": "Tiempo reproducido",
  "Duration": "Duración total",
  "Remaining Time": "Tiempo restante",
}
```

### File Naming

Translations are found in the `lang/` directory.

Each file's name should be the [standard language code][lang-codes] that is most appropriate, with a `.json` extension. For example, "es.json" for Spanish or "zh-CN.json" for simplified Chinese.

### Updating an Existing Translation

If there is a [missing translation](/docs/translations-needed.md), mistake, or room for improvement in an existing translation, don't hesitate to open a pull request!

1. Edit the relevant JSON file and make the necessary changes.
1. Verify the language compiles by running the language specific build `npm run build:lang` or the full build `npm run build`.
1. Verify the translation appears properly in the player UI.
1. Run `npm run docs:lang` to update the [missing translation document](/docs/translations-needed.md).
1. Commit and open a pull request on GitHub.

### Writing a New Translation

The process for writing an entirely new translation is virtually identical to the process for [updating an existing translation](#updating-an-existing-translation) except that the new translation JSON file needs to be created.

The template for new language files is the English file ([lang/en.json][lang-en]). This file is always up-to-date with strings that need translations.

The first step to writing a new translation is to copy the English file:

```sh
cp lang/en.json lang/${NEW_LANG_CODE}.json
```

Otherwise, the process is the same as [updating an existing translation](#updating-an-existing-translation).

### Adding Languages via the API

In addition to the stand-alone scripts provided by Video.js, the API supports manual definition of new languages via the `addLanguage` method. It takes two arguments: the [standard language code][lang-codes] and a [language definition object](#json-format).

```js
videojs.addLanguage('es', {
  Play: 'Reproducción',
  Pause: 'Pausa',
  'Current Time': 'Tiempo reproducido',
  'Duration': 'Duración total',
  'Remaining Time': 'Tiempo restante',
  ...
});
```

`addLanguage()` will overwrite existing translations if the object includes strings previously translated. However text that has already been localised will not be updated after generation.

### Per-Player Translations

In addition to providing languages to Video.js itself, individual `Player` instances can be provided custom language support via [the `languages` option](/docs/guides/options.md#languages):

```js
// Provide a custom definition of Spanish to this player.
videojs('my-player', {
  languages: {
    es: {
      Play: 'Reproducir'
    }
  }
});
```

### Setting Player Language

The language used by a player instance may be set via [the `language` option](/docs/guides/options.md#language):

```js
// Set the language to Spanish for this player.
videojs('my-player', {
  language: 'es'
});
```

The `language` method of the player _can_ be used to set the language after instantiation with `language('es')`. However, this is generally not useful as it does not update text that is already in place.

### Determining Player Language

The player language is set to one of the following in descending priority:

* The language [specified in options](#setting-default-player-language)
* The language specified by a `lang` attribute on the player element.
* The language specified by the closest parent element with a `lang` attribute, up to and including the `<html>` element.
* The browser language preference; the first language if more than one is configured
* English

#### Internal Language Selection

* Language codes are considered case-insensitively (e.g. `en-US` == `en-us`).
* If there is no match for a language code with a subcode (e.g. `en-us`), a match for the primary code (e.g. `en`) is used if available.

## References

For information on translation/localization in plugins, see [the plugins guide](/docs/guides/plugins.md).

Standard languages codes [are defined by the IANA][lang-codes].

For all existing/supported languages, please see the [languages folder (`lang/`)][lang-supported] folder located in the project root.

[lang-en]: /lang/en.json

[lang-supported]: /lang

[lang-codes]: https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry

[translations-needed]: https://github.com/videojs/video.js/blob/master/docs/translations-needed.md
