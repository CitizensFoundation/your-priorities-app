# Model: Audio

Represents an audio file uploaded by a user, including metadata, formats, and associations with posts and points. Handles audio upload, transcoding, and association with collections. Integrates with AWS S3, AWS Elastic Transcoder, and optionally with a custom "Your Priorities" encoder.

## Properties

| Name           | Type      | Description                                                                 |
|----------------|-----------|-----------------------------------------------------------------------------|
| id             | number    | Primary key (auto-generated by Sequelize).                                  |
| name           | string    | Name of the audio file.                                                     |
| description    | string    | Description of the audio file.                                              |
| meta           | object    | JSONB metadata for internal use (e.g., S3 keys, duration, etc.).            |
| public_meta    | object    | JSONB metadata for public exposure.                                         |
| formats        | object    | JSONB array of available audio formats/URLs.                                |
| listens        | bigint    | Number of times the audio has been listened to.                             |
| long_listens   | bigint    | Number of long listens.                                                     |
| user_id        | number    | ID of the user who uploaded the audio.                                      |
| listenable     | boolean   | Whether the audio is available for listening.                               |
| ip_address     | string    | IP address of the uploader.                                                 |
| user_agent     | string    | User agent string of the uploader.                                          |
| deleted        | boolean   | Soft-delete flag.                                                           |
| created_at     | Date      | Timestamp of creation.                                                      |
| updated_at     | Date      | Timestamp of last update.                                                   |

## Indexes

- GIN indexes on `meta`, `public_meta`, and `formats` for efficient JSONB querying.
- Composite and single-field indexes for performance on common queries.

## Associations

- `Audio.belongsTo(User, { foreignKey: 'user_id' })`: Each audio belongs to a user.
- `Audio.belongsToMany(Post, { as: 'PostAudios', through: 'PostAudio' })`: Many-to-many with posts.
- `Audio.belongsToMany(Point, { as: 'PointAudios', through: 'PointAudio' })`: Many-to-many with points.

---

# Exported Constants

| Name                     | Type     | Description                                      |
|--------------------------|----------|--------------------------------------------------|
| defaultAttributesPublic  | string[] | Default public attributes: `["id","updated_at","formats"]` |

---

# Static Methods

## Audio.getRandomFileKey(id: number): string

Generates a random file key for an audio file, used for S3 storage.

**Parameters**

| Name | Type   | Description                |
|------|--------|----------------------------|
| id   | number | Audio ID                   |

**Returns**: `string` (e.g., `abc1234_audio42.mp4`)

---

## Audio.getFullUrl(meta: object): string

Constructs the full public URL for an audio file based on its metadata and environment.

**Parameters**

| Name | Type   | Description                |
|------|--------|----------------------------|
| meta | object | Audio metadata (must include `endPoint`, `publicBucket`, `fileKey`) |

**Returns**: `string` (URL to the audio file)

---

## Audio.createAndGetSignedUploadUrl(req: Request, res: Response): void

Creates a new audio record and returns a signed S3 upload URL to the client.

**Parameters**

| Name | Type     | Description                |
|------|----------|----------------------------|
| req  | Request  | Express request object (expects `user`, `useragent`, `clientIp`) |
| res  | Response | Express response object    |

**Response**

- `200 OK`: `{ presignedUrl: string, audioId: number }`
- `500 Internal Server Error`: On failure

---

## Audio.addToPost(audio: Audio, options: object, callback: Function): void

Associates an audio file with a post, optionally triggers a voice-to-text job if configured.

**Parameters**

| Name    | Type   | Description                                  |
|---------|--------|----------------------------------------------|
| audio   | Audio  | Audio instance                               |
| options | object | `{ postId, browserLanguage, appLanguage }`   |
| callback| Function | Callback function (error-first)            |

---

## Audio.addToCollection(audio: Audio, options: object, callback: Function): void

Adds an audio file to a collection (post or other). Delegates to `addToPost` if `postId` is present.

**Parameters**

| Name    | Type   | Description                                  |
|---------|--------|----------------------------------------------|
| audio   | Audio  | Audio instance                               |
| options | object | `{ postId? }`                                |
| callback| Function | Callback function (error-first)            |

---

## Audio.getTranscodingJobStatus(audio: Audio, req: Request, res: Response): void

Checks the status of an audio transcoding job, using either AWS Elastic Transcoder or the custom encoder.

**Parameters**

| Name | Type     | Description                |
|------|----------|----------------------------|
| audio| Audio    | Audio instance             |
| req  | Request  | Express request object (expects `body.jobId`) |
| res  | Response | Express response object    |

**Response**

- `200 OK`: `{ status: string, statusDetail: string }`
- `500 Internal Server Error`: On error
- `404 Not Found`: If job not found (custom encoder)

---

## Audio.startTranscoding(audio: Audio, options: object, req: Request, res: Response): void

Starts a transcoding job for the audio file, setting max duration based on options.

**Parameters**

| Name    | Type     | Description                                  |
|---------|----------|----------------------------------------------|
| audio   | Audio    | Audio instance                               |
| options | object   | `{ audioPostUploadLimitSec?, audioPointUploadLimitSec? }` |
| req     | Request  | Express request object                       |
| res     | Response | Express response object                      |

**Response**

- `200 OK`: `{ transcodingJobId: string }`
- `500 Internal Server Error`: On error

---

## Audio.completeUploadAndAddToPoint(req: Request, res: Response, options: object, callback: Function): void

Completes the upload process and associates the audio with a point.

**Parameters**

| Name    | Type     | Description                                  |
|---------|----------|----------------------------------------------|
| req     | Request  | Express request object                       |
| res     | Response | Express response object                      |
| options | object   | `{ audioId, pointId }`                       |
| callback| Function | Callback function (error-first)              |

---

## Audio.completeUploadAndAddToCollection(req: Request, res: Response, options: object): void

Completes the upload process and adds the audio to a collection (post or other).

**Parameters**

| Name    | Type     | Description                                  |
|---------|----------|----------------------------------------------|
| req     | Request  | Express request object                       |
| res     | Response | Express response object                      |
| options | object   | `{ audioId, postId? }`                       |

**Response**

- `200 OK`: On success
- `401 Unauthorized`: If user does not own the audio
- `500 Internal Server Error`: On error

---

## Audio.startTranscodingJob(audio: Audio, callback: Function): void

Starts a transcoding job for the audio file using AWS Elastic Transcoder or the custom encoder.

**Parameters**

| Name     | Type     | Description                |
|----------|----------|----------------------------|
| audio    | Audio    | Audio instance             |
| callback | Function | Callback (error, data)     |

---

## Audio.startYrpriEncoderTranscodingJob(audio: Audio, callback: Function): void

Starts a transcoding job using the "Your Priorities" encoder and enqueues the job.

**Parameters**

| Name     | Type     | Description                |
|----------|----------|----------------------------|
| audio    | Audio    | Audio instance             |
| callback | Function | Callback (error, data)     |

---

## Audio.getYrpriEncoderTranscodingJobStatus(audio: Audio, req: Request, res: Response): void

Checks the status of a "Your Priorities" encoder transcoding job.

**Parameters**

| Name | Type     | Description                |
|------|----------|----------------------------|
| audio| Audio    | Audio instance             |
| req  | Request  | Express request object (expects `body.jobId`) |
| res  | Response | Express response object    |

**Response**

- `200 OK`: `{ status: string, statusDetail: string }`
- `500 Internal Server Error`: On error
- `404 Not Found`: If job not found

---

# Instance Methods

## audio.createFormats(audio: Audio): void

Populates the `formats` array with the full URL of the audio file.

**Parameters**

| Name  | Type  | Description         |
|-------|-------|---------------------|
| audio | Audio | Audio instance      |

---

## audio.getPreSignedUploadUrl(options: object, callback: Function): void

Generates a pre-signed S3 upload URL for the audio file and saves metadata.

**Parameters**

| Name     | Type     | Description                |
|----------|----------|----------------------------|
| options  | object   | `{ maxDuration? }`         |
| callback | Function | Callback (error, url)      |

---

# Configuration

- Uses environment variables for AWS, S3, Redis, and encoder settings:
  - `USE_YOUR_PRIORITIES_ENCODER`
  - `REDIS_URL`
  - `MINIO_ROOT_USER`
  - `NODE_ENV`
  - `S3_REGION`
  - `S3_ENDPOINT`
  - `S3_ACCELERATED_ENDPOINT`
  - `S3_FORCE_PATH_STYLE`
  - `S3_AUDIO_UPLOAD_BUCKET`
  - `S3_AUDIO_PUBLIC_BUCKET`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_TRANSCODER_AUDIO_PIPELINE_ID`
  - `AWS_TRANSCODER_AUDIO_PRESET_ID`
  - `AWS_TRANSCODER_FLAC_PRESET_ID`
  - `GOOGLE_TRANSCODING_FLAC_BUCKET`
  - `GOOGLE_APPLICATION_CREDENTIALS_JSON`

---

# Related Modules

- [logger.cjs](../utils/logger.cjs.md): Logging utility.
- [queue.cjs](../services/workers/queue.cjs.md): Job queue for background processing.
- [User](./User.md): User model.
- [Post](./Post.md): Post model.
- [Point](./Point.md): Point model.
- [AcBackgroundJob](./AcBackgroundJob.md): Background job model for custom encoder.

---

# Example Usage

```javascript
// Creating a new audio and getting a signed upload URL
Audio.createAndGetSignedUploadUrl(req, res);

// Adding audio to a post
Audio.addToPost(audio, { postId: 123, browserLanguage: 'en', appLanguage: 'en' }, callback);

// Starting a transcoding job
Audio.startTranscoding(audio, { audioPostUploadLimitSec: 120 }, req, res);

// Completing upload and adding to a point
Audio.completeUploadAndAddToPoint(req, res, { audioId: 42, pointId: 7 }, callback);
```

---

# Notes

- This model is tightly coupled with AWS S3 and Elastic Transcoder, but can also use a custom encoder if configured.
- All methods that interact with the database or external services are asynchronous and use callbacks or Promises.
- Soft-deletion is implemented via the `deleted` flag and default scope.
- The model is designed for use with Sequelize ORM.