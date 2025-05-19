# Controller: AllOurIdeasController

The `AllOurIdeasController` class provides a comprehensive set of API endpoints for managing "All Our Ideas" (AOI) group-based idea generation, voting, moderation, and reporting. It integrates with the Pairwise API, OpenAI moderation, and internal services for analytics, translation, and background job processing. The controller is designed for use in an Express.js application and supports both HTTP and WebSocket-based workflows.

---

## Table of Contents

- [Routes](#routes)
- [Constructor](#constructor)
- [Methods](#methods)
- [Internal Utility Functions](#internal-utility-functions)
- [Configuration and Constants](#configuration-and-constants)
- [Dependencies](#dependencies)
- [Related Models and Services](#related-models-and-services)

---

## Routes

The controller registers the following routes (all prefixed with `/api/allOurIdeas`):

| Method | Path                                                                                                 | Description                                      | Auth Policy                | Handler Method                |
|--------|------------------------------------------------------------------------------------------------------|--------------------------------------------------|----------------------------|-------------------------------|
| GET    | `/:groupId`                                                                                          | Show AOI question and prompt for a group         | `view group`               | `showEarl`                    |
| PUT    | `/:groupId/:type/start_report_creation`                                                              | Start XLS report creation                        | `edit group`               | `exportXls`                   |
| GET    | `/:groupId/:jobId/report_creation_progress`                                                          | Get XLS export progress                          | `edit group`               | `getXlsExportProgress`        |
| GET    | `/:domainId/getAoiSiteStats`                                                                         | Get AOI site statistics                          | `view domain`              | `getAoiSiteStats`             |
| POST   | `/:domainId/questions/throughDomain`                                                                 | Create question (domain context)                 | `create community`         | `createQuestion`              |
| POST   | `/:communityId/questions`                                                                            | Create question (community context)              | `create group`             | `createQuestion`              |
| PUT    | `/:domainId/generateIdeas/throughDomain`                                                            | Generate ideas (domain context)                  | `create community`         | `generateIdeas`               |
| PUT    | `/:communityId/generateIdeas`                                                                       | Generate ideas (community context)               | `create group`             | `generateIdeas`               |
| PUT    | `/:groupId/llmAnswerExplain`                                                                         | Explain LLM answers                              | `view group`               | `llmAnswerExplain`            |
| GET    | `/:domainId/choices/:questionId/throughDomain`                                                       | Get choices (domain context)                     | `create community`         | `getChoices`                  |
| GET    | `/:groupId/choices/:questionId/throughGroup`                                                         | Get choices (group context)                      | `view group`               | `getChoices`                  |
| GET    | `/:communityId/choices/:questionId`                                                                  | Get choices (community context)                  | `create group`             | `getChoices`                  |
| POST   | `/:groupId/questions/:questionId/prompts/:promptId/votes`                                            | Vote on a prompt                                 | `view group`               | `vote`                        |
| POST   | `/:groupId/questions/:questionId/prompts/:promptId/skips`                                            | Skip a prompt                                    | `view group`               | `skip`                        |
| POST   | `/:groupId/questions/:questionId/addIdea`                                                            | Add a new idea                                   | `view group`               | `addIdea`                     |
| GET    | `/:groupId/questions/:wsClientSocketId/:analysisIndex/:analysisTypeIndex/analysis`                   | Get AI analysis                                  | `view group`               | `analysis`                    |
| PUT    | `/:communityId/questions/:questionId/choices/:choiceId`                                              | Update choice data (community context)           | `create group`             | `updateChoiceData`            |
| PUT    | `/:domainId/questions/:questionId/choices/:choiceId/throughDomain`                                   | Update choice data (domain context)              | `create community`         | `updateChoiceData`            |
| PUT    | `/:groupId/questions/:questionId/choices/:choiceId/throughGroup`                                     | Update choice data (group context)               | `view group`               | `updateChoiceData`            |
| PUT    | `/:communityId/questions/:questionId/choices/:choiceId/active`                                       | Update choice active status (community context)  | `create group`             | `updateActive`                |
| PUT    | `/:domainId/questions/:questionId/choices/:choiceId/active/throughDomain`                            | Update choice active status (domain context)     | `create community`         | `updateActive`                |
| PUT    | `/:communityId/questions/:questionId/name`                                                           | Update question name (community context)         | `create group`             | `updateQuestionName`          |
| PUT    | `/:domainId/questions/:questionId/name/throughDomain`                                                | Update question name (domain context)            | `create community`         | `updateQuestionName`          |
| GET    | `/:groupId/content/:extraId/:questionId/translatedText`                                              | Get translated text (with question)              | `view group`               | `getTranslatedText`           |
| GET    | `/:groupId/content/:extraId/translatedText`                                                          | Get translated text (without question)           | `view group`               | `getTranslatedText`           |

---

## Constructor

```typescript
constructor(wsClients: Map<string, WebSocket>)
```
- **wsClients**: `Map<string, WebSocket>`  
  A map of WebSocket client connections, keyed by client socket ID.

Initializes the controller, sets up the Express router, and registers all routes.

---

## Methods

### async getAoiSiteStats(req, res)
Fetches AOI site statistics from the Pairwise API and augments them with legacy stats.

#### Request

- **Method**: `GET`
- **Path**: `/:domainId/getAoiSiteStats`
- **Auth**: `view domain`

#### Response

- **Success**:  
  ```json
  {
    "choices_count": number,
    "total_questions": number,
    "votes_count": number,
    ...
  }
  ```
- **Error**:  
  ```json
  { "error": "Failed to fetch total vote and questions count" }
  ```

---

### async addIdea(req, res)
Adds a new idea (choice) to a question, with AI moderation and possible deactivation.

#### Request

- **Method**: `POST`
- **Path**: `/:groupId/questions/:questionId/addIdea`
- **Auth**: `view group`
- **Body**:
  ```json
  {
    "newIdea": "string",
    "id": "string"
  }
  ```

#### Response

- **Success**:  
  ```json
  {
    "active": boolean,
    "flagged": boolean,
    "choice": { ... },
    "choice_status": "active" | "inactive",
    "message": "You just submitted: ..."
  }
  ```
- **Error**:  
  ```json
  { "error": "Addition of new idea failed" }
  ```

---

### async getModerationFlag(data)
Checks if the provided text is flagged by OpenAI moderation.

#### Parameters

| Name | Type   | Description         |
|------|--------|---------------------|
| data | string | Text to moderate    |

#### Returns

- `boolean` (true if flagged)

---

### async getModerationResults(data)
(Stub) Calls OpenAI completions API for moderation results.

#### Parameters

| Name | Type   | Description         |
|------|--------|---------------------|
| data | string | Text to analyze     |

---

### async deactivateChoice(req, choice)
Deactivates a choice (sets `active: false`) via the Pairwise API.

#### Parameters

| Name   | Type         | Description         |
|--------|--------------|---------------------|
| req    | Request      | Express request     |
| choice | AoiChoiceData| Choice to deactivate|

---

### async getTranslatedText(req, res)
Fetches translated text for a given content ID (and optionally question ID).

#### Request

- **Method**: `GET`
- **Path**: `/:groupId/content/:extraId/:questionId/translatedText` or `/:groupId/content/:extraId/translatedText`
- **Auth**: `view group`

#### Response

- **Success**:  
  `string` (translated text)
- **Error**:  
  `"A getTranslatedText error occurred"`

---

### async generateIdeas(req, res)
Triggers AI-based idea generation for a question, sending results via WebSocket.

#### Request

- **Method**: `PUT`
- **Path**: `/:communityId/generateIdeas` or `/:domainId/generateIdeas/throughDomain`
- **Auth**: `create group` or `create community`
- **Body**:
  ```json
  {
    "currentIdeas": [...],
    "wsClientSocketId": "string",
    "question": "string"
  }
  ```

#### Response

- **Success**: HTTP 200
- **Error**: HTTP 404 if WebSocket not found

---

### async getXlsExportProgress(req, res)
Returns the progress of an XLS export background job.

#### Request

- **Method**: `GET`
- **Path**: `/:groupId/:jobId/report_creation_progress`
- **Auth**: `edit group`

#### Response

- **Success**:  
  ```json
  {
    "id": number,
    "progress": number,
    "error": string,
    "data": any
  }
  ```
- **Error**: HTTP 500

---

### async exportXls(req, res)
Starts a background job for XLS report generation.

#### Request

- **Method**: `PUT`
- **Path**: `/:groupId/:type/start_report_creation`
- **Auth**: `edit group`
- **Body**:
  ```json
  {
    "selectedFraudAuditId": number
  }
  ```
- **Query**:
  - `questionId`: string
  - `translateLanguage`: string

#### Response

- **Success**:  
  ```json
  { "jobId": number }
  ```
- **Error**: HTTP 500

---

### async llmAnswerExplain(req, res)
Triggers an LLM-based explanation of a chat log, sending results via WebSocket.

#### Request

- **Method**: `PUT`
- **Path**: `/:groupId/llmAnswerExplain`
- **Auth**: `view group`
- **Body**:
  ```json
  {
    "wsClientId": "string",
    "chatLog": [...],
    "languageName": "string"
  }
  ```

#### Response

- **Success**: HTTP 200

---

### async showEarl(req, res)
Fetches and returns the AOI question and prompt for a group.

#### Request

- **Method**: `GET`
- **Path**: `/:groupId`
- **Auth**: `view group`
- **Query**:
  - `locale`: string

#### Response

- **Success**:  
  ```json
  {
    "prompt": { ... },
    "question": { ... }
  }
  ```
- **Error**: HTTP 404 or 500

---

### async vote(req, res)
Submits a vote for a prompt.

#### Request

- **Method**: `POST`
- **Path**: `/:groupId/questions/:questionId/prompts/:promptId/votes`
- **Auth**: `view group`
- **Body**:
  ```json
  {
    "id": string,
    "question_id": string,
    "direction": "left" | "right",
    "time_viewed": number,
    "appearance_lookup": string
  }
  ```

#### Response

- **Success**:  
  ```json
  {
    "newleft": string,
    "newright": string,
    "left_choice_id": number,
    "left_choice_url": string,
    "right_choice_id": number,
    "right_choice_url": string,
    "appearance_lookup": string,
    "prompt_id": number
  }
  ```
- **Error**: HTTP 422

---

### async createQuestion(req, res)
Creates a new AOI question with initial ideas.

#### Request

- **Method**: `POST`
- **Path**: `/:domainId/questions/throughDomain` or `/:communityId/questions`
- **Auth**: `create community` or `create group`
- **Body**:
  ```json
  {
    "question": "string",
    "ideas": ["string", ...]
  }
  ```

#### Response

- **Success**:  
  ```json
  { "question_id": number }
  ```
- **Error**: HTTP 400 or 500

---

### async updateChoiceData(req, res)
Updates the data field of a choice.

#### Request

- **Method**: `PUT`
- **Path**: see [Routes](#routes)
- **Auth**: varies
- **Body**:
  ```json
  { "data": any }
  ```

#### Response

- **Success**:  
  `{ "message": "Choice data updated" }`
- **Error**: HTTP 422

---

### async updateActive(req, res)
Updates the active status of a choice.

#### Request

- **Method**: `PUT`
- **Path**: see [Routes](#routes)
- **Auth**: varies
- **Body**:
  ```json
  { "active": boolean }
  ```

#### Response

- **Success**:  
  `{ "message": "Choice active updated" }`
- **Error**: HTTP 422

---

### async updateQuestionName(req, res)
Updates the name of a question.

#### Request

- **Method**: `PUT`
- **Path**: see [Routes](#routes)
- **Auth**: varies
- **Body**:
  ```json
  { "name": string }
  ```

#### Response

- **Success**:  
  `{ "message": "Question name updated" }`
- **Error**: HTTP 422

---

### async skip(req, res)
Skips a prompt, optionally providing a reason.

#### Request

- **Method**: `POST`
- **Path**: `/:groupId/questions/:questionId/prompts/:promptId/skips`
- **Auth**: `view group`
- **Body**:
  ```json
  {
    "id": string,
    "question_id": string,
    "cant_decide_reason": string,
    "time_viewed": number,
    "appearance_lookup": string
  }
  ```

#### Response

- **Success**:  
  (Same as [vote](#async-votereq-res))
- **Error**: HTTP 422

---

### async analysis(req, res)
Performs AI-based analysis on a set of choices for a question.

#### Request

- **Method**: `GET`
- **Path**: `/:groupId/questions/:wsClientSocketId/:analysisIndex/:analysisTypeIndex/analysis`
- **Auth**: `view group`
- **Query**:
  - `languageName`: string

#### Response

- **Success**:  
  ```json
  {
    "selectedChoices": [ ... ],
    "cachedAnalysis": any
  }
  ```
- **Error**: HTTP 500

---

### async getChoices(req, res)
Fetches choices for a question, optionally including inactive ones.

#### Request

- **Method**: `GET`
- **Path**: see [Routes](#routes)
- **Auth**: varies
- **Query**:
  - `showAll`: boolean

#### Response

- **Success**:  
  `[ ... ]` (array of choices)
- **Error**: HTTP 500

---

## Internal Utility Functions

### getQuestionChoicePath(questionId, choiceId)
Returns the API path for a specific choice.

| Name      | Type   | Description         |
|-----------|--------|---------------------|
| questionId| number | Question ID         |
| choiceId  | number | Choice ID           |

**Returns**: `string` (e.g., `/questions/123/choices/456.json`)

---

### getNextPromptOptions(req)
Builds the options object for requesting the next prompt.

| Name | Type    | Description         |
|------|---------|---------------------|
| req  | Request | Express request     |

**Returns**: `object`

---

### getVoteRequestOptions(req, requestType)
Builds the options object for voting or skipping.

| Name        | Type   | Description         |
|-------------|--------|---------------------|
| req         | Request| Express request     |
| requestType | string | "vote" \| "skip" \| "skip_after_flag" |

**Returns**: `object`

---

## Configuration and Constants

- **PAIRWISE_API_HOST**: string (from env)
- **PAIRWISE_USERNAME**: string (from env)
- **PAIRWISE_PASSWORD**: string (from env)
- **defaultAuthHeader**: object (for Pairwise API requests)
- **defaultHeader**: object (for Pairwise API requests)

---

## Dependencies

- [express](https://expressjs.com/)
- [ws](https://github.com/websockets/ws)
- [redis](https://github.com/redis/node-redis)
- [uuid](https://github.com/uuidjs/uuid)
- [crypto](https://nodejs.org/api/crypto.html)
- [OpenAI](https://github.com/openai/openai-node)
- [authorization.cjs](../authorization.cjs)
- [models](../models/index.cjs)
- [queue](../services/workers/queue.cjs)
- [AiHelper](../services/engine/allOurIdeas/aiHelper.js)
- [ExplainAnswersAssistant](../services/engine/allOurIdeas/explainAnswersAssistant.js)

---

## Related Models and Services

- **Group**: [Group Model](../models/index.cjs)  
- **User**: [User Model](../models/index.cjs)  
- **AcBackgroundJob**: [AcBackgroundJob Model](../models/index.cjs)  
- **AiHelper**: [AiHelper Service](../services/engine/allOurIdeas/aiHelper.js)  
- **ExplainAnswersAssistant**: [ExplainAnswersAssistant Service](../services/engine/allOurIdeas/explainAnswersAssistant.js)  
- **AcTranslationCache**: [AcTranslationCache Model](../models/index.cjs)  

---

## Example Usage

```typescript
import { AllOurIdeasController } from './controllers/allOurIdeasController';
import express from 'express';
import WebSocket from 'ws';

const wsClients = new Map<string, WebSocket>();
const controller = new AllOurIdeasController(wsClients);

const app = express();
app.use(controller.path, controller.router);
```

---

## Types Used

- `AoiSiteStats`, `AoiChoiceData`, `AoiQuestionData`, `AoiPromptData`, `AoiAnswerToVoteOnData`, `AnalysisTypeData`, `YpGroupData`, `YpUserData`  
  (These should be defined in your application's type definitions.)

---

## Notes

- All endpoints require appropriate authentication and authorization, enforced via the `auth.can()` middleware.
- Many endpoints interact with the Pairwise API and may require valid credentials and network access.
- WebSocket integration is used for real-time AI idea generation and answer explanation.
- AI moderation uses OpenAI's Moderation API if enabled in configuration.
- Some endpoints rely on background job processing and Redis caching.

---

For more details on the models and services referenced, see their respective documentation files.