# Service Module: VoiceToTextWorker

This module provides a worker for processing speech-to-text work packages, specifically for generating transcripts from audio and video files using Google Cloud Speech-to-Text. It handles language selection, file upload to Google Cloud Storage, and transcript creation, updating the corresponding database models with the results.

---

## Exported Instance

| Name                | Type              | Description                                      |
|---------------------|-------------------|--------------------------------------------------|
| VoiceToTextWorker   | VoiceToTextWorker | Singleton instance for processing work packages.  |

---

## Class: VoiceToTextWorker

A worker class responsible for processing speech-to-text work packages. It supports creating transcripts for both audio and video files, handling language selection, file upload, and transcript storage.

### Methods

#### process

Processes a speech-to-text work package.

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| workPackage | object   | The work package containing processing details.   |
| callback    | function | Callback function `(error?: any) => void`.        |

**Supported workPackage types:**
- `create-video-transcript`: Triggers transcript creation for a video.
- `create-audio-transcript`: Triggers transcript creation for an audio file.

**Example Usage:**
```javascript
const worker = require('./voice_to_text_worker.cjs');
worker.process({ type: 'create-video-transcript', videoId: 123, appLanguage: 'en-US', browserLanguage: 'en-GB' }, (err) => {
  if (err) { /* handle error */ }
});
```

---

## Internal Functions

### createTranscriptForVideo

Creates a transcript for a video file, uploads the FLAC audio to Google Cloud Storage, and updates the video model with the transcript.

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| workPackage | object   | The work package containing videoId and language info. |
| callback    | function | Callback function `(error?: any) => void`.        |

### createTranscriptForAudio

Creates a transcript for an audio file, uploads the FLAC audio to Google Cloud Storage, and updates the audio model with the transcript.

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| workPackage | object   | The work package containing audioId and language info. |
| callback    | function | Callback function `(error?: any) => void`.        |

### createTranscriptForFlac

Creates a transcript for a FLAC audio file stored in Google Cloud Storage.

| Name      | Type     | Description                                      |
|-----------|----------|--------------------------------------------------|
| flacUrl   | string   | The Google Cloud Storage URI of the FLAC file.   |
| workPackage | object | The work package with language info.             |
| callback  | function | Callback `(error: any, response: object) => void`|

### uploadFlacToGoogleCloud

Downloads a FLAC file from a URL and uploads it to Google Cloud Storage.

| Name      | Type     | Description                                      |
|-----------|----------|--------------------------------------------------|
| flacUrl   | string   | The URL of the FLAC file to upload.              |
| callback  | function | Callback `(error: any, gsUri: string) => void`   |

---

## Language Selection Utilities

### getLanguageArray

Selects the best language code and alternatives for Google Speech-to-Text based on the work package's app and browser language.

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| workPackage | object   | The work package with `appLanguage` and `browserLanguage`. |
| returns     | object \| null | `{ languageCode: string, alternativeLanguageCodes: string[] }` or `null` if no match. |

### transformYrpriCode

Transforms a language code from YRPRI format to Google Speech-to-Text format.

| Name | Type   | Description                |
|------|--------|----------------------------|
| code | string | The language code to transform. |
| returns | string | The transformed code.    |

### exactLanguageMatch

Finds an exact match for a language code in the supported Google languages.

| Name | Type   | Description                |
|------|--------|----------------------------|
| code | string | The language code to match. |
| returns | string \| null | The matched code or `null`. |

### firstTwoLanguagePrimaryMatch

Finds a primary match for the first two letters of a language code.

| Name | Type   | Description                |
|------|--------|----------------------------|
| code | string | The language code to match. |
| returns | string \| null | The matched code or `null`. |

### firstTwoLanguageSecondaryMatch

Finds a secondary match for the first two letters of a language code.

| Name | Type   | Description                |
|------|--------|----------------------------|
| code | string | The language code to match. |
| returns | string \| null | The matched code or `null`. |

---

## Exported Constants

### supportedGoogleLanguges

An array of supported Google Speech-to-Text language codes and their properties.

| Index | Type    | Description                                      |
|-------|---------|--------------------------------------------------|
| 0     | string  | Language code (e.g., 'en-US')                    |
| 1     | boolean | Primary support flag                             |
| 2     | boolean | Secondary support flag                           |

---

## Configuration

- **Google Cloud Speech-to-Text**: Requires `GOOGLE_APPLICATION_CREDENTIALS_JSON` and `GOOGLE_TRANSCODING_FLAC_BUCKET` environment variables.
- **Airbrake**: If `AIRBRAKE_PROJECT_ID` is set, Airbrake error reporting is enabled.

---

## Dependencies

- [@google-cloud/speech](https://www.npmjs.com/package/@google-cloud/speech)
- [@google-cloud/storage](https://www.npmjs.com/package/@google-cloud/storage)
- [download-file](https://www.npmjs.com/package/download-file)
- [lodash](https://lodash.com/)
- [fs](https://nodejs.org/api/fs.html)
- [async](https://caolan.github.io/async/)
- [models](../../models/index.cjs)
- [logger](../utils/logger.cjs)
- [i18n](../utils/i18n.cjs)
- [to_json](../utils/to_json.cjs)
- [get_anonymous_system_user](../utils/get_anonymous_system_user.cjs)
- [airbrake](../utils/airbrake.cjs) (optional)

---

## Example Usage

```javascript
const worker = require('./voice_to_text_worker.cjs');

worker.process({
  type: 'create-audio-transcript',
  audioId: 456,
  appLanguage: 'es-ES',
  browserLanguage: 'en-US'
}, (err) => {
  if (err) {
    console.error('Error processing work package:', err);
  } else {
    console.log('Transcript created successfully.');
  }
});
```

---

## Related Models

- [Video](../../models/index.cjs) (see `models.Video`)
- [Audio](../../models/index.cjs) (see `models.Audio`)
- [Point](../../models/index.cjs) (see `models.Point`)
- [Post](../../models/index.cjs) (see `models.Post`)

---

## Notes

- The module expects FLAC audio files for transcription.
- Transcripts and errors are stored in the `meta.transcript` field of the corresponding model.
- Language selection is prioritized based on app and browser language, with fallbacks to English if necessary.
- Only a singleton instance of `VoiceToTextWorker` is exported.

---

**See also:**  
- [Google Cloud Speech-to-Text Documentation](https://cloud.google.com/speech-to-text/docs)
- [@google-cloud/storage Documentation](https://cloud.google.com/nodejs/docs/reference/storage/latest)
