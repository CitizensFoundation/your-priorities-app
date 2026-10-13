# Skills First manual test

## Interactive browser test (run on command)

The [interactive executable](../skillsFirst.browser.manual.ts) serves the real Lit workflow UI and waits for a person or a browser-control agent to use it. It is excluded from all automatic suites. Unless you explicitly add `--case ui-features --drive`, it never opens a browser, submits prompts, uploads files or starts processing automatically. Its simplest case is **API-key login → hello → upload one job description → ask Codex to run Skills First → download results**.

From `server_api`, in an interactive terminal:

```sh
npm run test:live-workflows:browser-manual -- --prepare
sg docker -c 'npm run test:live-workflows:browser-manual -- --offline'
# Paid run, only when explicitly requested:
sg docker -c 'YP_WORKFLOW_MANUAL_LIVE=1 npm run test:live-workflows:browser-manual -- --live'
```

Open the printed loopback URL in a real browser. The page provides two exact prompts, a download of the fictional [text fixture](fixtures/library-program-assistant.txt), and these steps:

1. Choose **Use imported test key** and check that the UI shows **OpenAI API key connected**.
2. Send the greeting and wait for Codex's reply.
3. Open **Data** and upload the text document using the file chooser.
4. Send the experiment prompt. Codex must inspect the data, validate the package and start exactly one one-record trial using the workflow CLI. Do not click **Run trial**.
5. Watch progress, then review **Results**. In **Data**, download and open the JSON, CSV and Markdown exports.
6. Press Enter in the terminal to verify and finish. Failed verification leaves the session available to finish missing steps. Ctrl+C stops and cleans up an incomplete test.

Live mode defaults to importing the repository-root `.envForAgentDoNotViewOnlyImport`, using the existing allowlisted importer. It does not display, source or execute the file. The local import button submits a public marker through the normal API-key form. Only the disposable manual server replaces that marker with its in-memory key, after checking the request origin. The actual key never enters the browser, browser-control tool arguments, chat, reports or source. It is encrypted in the disposable database and supplied to Codex through app-server RPC; inference sends it to OpenAI. The helper is never mounted by the production server. Offline mode uses a fake key through the same login/controller/resolver path and simulated model replies; it imports no real credentials.

The [browser config](browser.config.example.json) defaults both independent model choices to `gpt-6-luna`, `max` reasoning and `fast` service. It gives processing a $2 hard allowance. Codex is limited to two user turns and 32,768 output tokens per model response, with separately reported estimated costs; there is no per-turn dollar cap or combined Codex/processing dollar cap. Use `--config`, `--env` or `--port` to override settings; port 0 chooses a free loopback port. The entire interactive session has a 90-minute cleanup deadline. Existing Docker/PostgreSQL/processing images are required; live mode also needs the Codex image and Sysbox. No automatic image builds or pulls occur.

Evidence is saved under `.live-workflow-manual/results/browser-<mode>-<random>/`: `report.json`, incremental `codex-usage.json`, and verified output copies. Acceptance checks observe successful login, two chat requests, upload order and all three browser download deliveries **before** the verifier fetches its own copies. It also checks the completed five-stage trial, original text and IDs, quoted evidence, independent rewrite review, export checksums and settled usage. Pressing Enter confirms the operator reviewed the files saved by the browser; HTTP delivery alone does not prove they were opened. An incomplete test cannot report a pass.

Your Priorities user/group membership is a local fixture. API-key login is real in live mode; ChatGPT sign-in, public hosting and real Your Priorities account login remain separate tests. Product users can connect ChatGPT or save their own OpenAI key for Codex. Processing agents still use the workflow's configured provider credentials, independently of Codex login.

### Ten-job interactive batch case

Use `--case approved-bulk` for **messy upload → Codex creates an adapter and updates the graph → two-job degree/evidence trial → browser estimate and spending approval → pause → refresh → resume → review and downloads**. The original one-document case remains the default (`--case simple`). Neither case opens a browser or operates the UI automatically.

```sh
npm run test:live-workflows:browser-manual -- --prepare --case approved-bulk
sg docker -c 'npm run test:live-workflows:browser-manual -- --offline --case approved-bulk'
sg docker -c 'YP_WORKFLOW_MANUAL_LIVE=1 npm run test:live-workflows:browser-manual -- --live --case approved-bulk'
```

The fixed [ten-job recruitment export](fixtures/recruitment-batch.json) varies field order, duties, requirements and preferences. It includes required and preferred degrees, experience alternatives, an explicit license requirement and missing evidence. The browser page supplies the two prompts and exact steps. Codex adds `adapt-import` before normalize, exports standard input records and requests only evidence analysis through `analyze`; its degree prerequisite runs automatically. Rewriting, later analyses and external research are outside this case. Inspect the new node and dependencies in Agents, then review the trial in Results before approving bulk. Select only the original upload in Data and choose the scope through the analysis agent when requesting the estimate.

The [batch config](browser-bulk.config.example.json) requests Luna, max reasoning and fast service independently for Codex and processing, with **$5 total processing allowance across trial and bulk**. Codex remains limited to two user turns, with separate cost reporting; this is not a combined dollar cap. Bulk processes all ten jobs, including the two separately charged trial records. The browser operator must review the estimate and choose an approved cap within the remaining allowance. No approval or budget increase is automatic.

The manual harness holds acknowledgement of the batch's durable levels checkpoint, after all ten level calls settle, so the browser operator has time to use the real Pause button. A read-only notice shows when to pause. Refresh the page while paused, review saved chat and progress, then resume using the same approved cap. The harness never pauses/resumes itself or kills the container in this case. This verifies acknowledged UI controls and page refresh, not host restart or uncertain provider billing.

Review and search the final results, inspect quoted evidence and unknown findings, then download and open **adapted-jobs.json and results-0.json for each run** (four JSON documents, named with their run IDs). These targeted analyses do not run the full-pipeline CSV/Markdown export agent. Press Enter only after reviewing the browser-saved files. Verification requires observed browser login/chat/upload, trial review before approval, estimate/start/pause/refresh/resume order, final result search and all four downloads before the verifier's own reads. It checks source preservation, dependencies, both result sets, the generated adapter and graph revision, unchanged approval/checkpoint across resume, 36 accounted model calls, and zero repeated paid calls. Reports, verifier output copies, adapter source and graph are saved under `.live-workflow-manual/results/browser-bulk-<mode>-<random>/`. Save browser screenshots and downloaded files alongside the report when reviewing the case.

### Feature coverage and model comparison

Use `--case ui-features` for two short trials on the same fictional job description. Codex greets you, reads the upload, selects only evidence analysis (including its degree prerequisite), and starts the first trial. The browser operator then changes **Analyze requirements** from Luna to Sol in **Models & settings**, saves, refreshes, and starts the second trial using the UI. Only normalize, level detection, degrees and evidence run: **six processing calls total**, with no retries or bulk approval.

```sh
npm run test:live-workflows:browser-manual -- --prepare --case ui-features
sg docker -c 'npm run test:live-workflows:browser-manual -- --offline --case ui-features --drive'
# Explicit paid execution; imports the key on the server, never into the browser:
sg docker -c 'YP_WORKFLOW_MANUAL_LIVE=1 npm run test:live-workflows:browser-manual -- --live --case ui-features --drive'
```

`--drive` runs the [on-demand Chromium driver](browserFeaturesDriver.ts). It operates the real UI and asserts its behavior; it does not mock network responses or change workflow state through direct API calls. Add `--headed` to watch its browser, or omit `--drive` for an interactive session using the page's checklist and terminal completion. The offline driver uses scripted providers with a short response delay to make live progress observable. The live driver uses the real Codex VM and processing providers. Neither invocation is part of `npm test` or the ordinary browser suite.

Coverage includes API-key login, the package's assistant name, chat rendering and replay after refresh, upload/preview/source download, graph Fit/zoom, live messages and agent filtering, keyboard popup access, read-only saved runs, cancelling edits, independent processing/review selections, max reasoning, a $4 agent cap, save/refresh persistence, immutable model history, targeted trial controls, result selection/comparison/model tables, evidence details, search, empty filters, pagination bounds, settled usage, package revision inspection, independent Codex settings, VM storage, both result downloads, and a narrow-screen model popup. The verifier checks actual ledger model IDs, source lineage, task dependencies, quoted evidence, frozen catalog prices, six settled calls and no outstanding reservations. The driver additionally opens and parses browser-saved documents and checks their byte counts and checksums. Interactive mode records operator confirmation of visual/file review separately from HTTP delivery evidence.

The [feature config](browser-features.config.example.json) keeps Codex and initial agents on Luna, with Sol exposed as `comparisonProcessingModel`. Both choices use max reasoning and fast service. The two trials share a **$5 processing ceiling**; Codex remains bounded to two user turns with separate usage/cost reporting. The alternative must be a different priced OpenAI model from the backend catalog. Existing simple/batch configs still expose one processing model.

Evidence is saved in `.live-workflow-manual/results/browser-features-<mode>-<random>/`: `report.json`, `codex-usage.json`, incremental `browser-checks.json`, five screenshots, `browser-downloads/`, and independent verifier copies under `trial-1/` and `trial-2/`. A driver failure writes `failure.png` and `browser-error.json`, stops without paid retries, and cleans up the disposable VM/database. This case focuses on comparing agent configurations; the existing approved-bulk case covers approval and pause/resume, and external connections and ChatGPT sign-in remain separate scenarios.

## Browser-free scenarios

Run the [headless manual suite](../skillsFirst.headless.manual.ts) before UI testing. It drives the HTTP API, persisted events and downloads directly, with a disposable PostgreSQL database, the real broker and isolated processing containers. No browser, Playwright installation or UI bundle is used.

| Case | What it proves |
| --- | --- |
| `codex-trial` | Upload two jobs; Codex inspects input through the VM CLI, validates and starts exactly one trial; all five stages complete; download JSON/CSV/Markdown; ask Codex for a follow-up summary without another run. |
| `mixed-records` | Three source jobs become four outputs, including two independently analyzed levels. Preferred degrees remain optional, experience alternatives survive, missing degree/license evidence remains unknown, and costs remain attributed to original records. |
| `run-controls` | A one-microdollar analysis-node allowance pauses before dispatching that stage. Resume within the existing workspace cap preserves paid level-analysis results. Bulk drafting requires a trial, explicit spending approval is required, excessive caps are refused, graph edits invalidate approval, and trial allowances stay cumulative. This case does not start a bulk run. |
| `adapt-format` | Codex reads an unfamiliar nested recruitment export, writes an `adapt-import` TypeScript agent and graph dependencies, exports standard job records, validates, then requests a two-record trial targeting `analyze` with `tasks: ["evidence"]`. Degree analysis is included automatically. Later analyses, rewriting and research must remain unexecuted. |
| `approved-bulk` | Ten varied nested jobs; Codex creates the adapter and starts a two-record degree/evidence trial. The test admin approves an estimated bulk run. After ten level calls settle and their checkpoint is saved, kill that processing container, observe a pause, resume the same approved run, and verify downloads and no repeated model requests. |

The unfamiliar-format fixture has nested fields and differing field order, with duties, mandatory requirements and preferences in separate arrays. Keeping this example fixed makes failures reproducible. Its adapter is created inside the disposable workspace by Codex in live mode. The test checks immutable IDs, every original qualification passage, the saved adapter source/graph revision, the standard-format download and exactly four analysis calls (degrees plus evidence for each job). The offline operator is explicitly scripted and is not evidence of model capabilities.

From `server_api`:

```sh
npm run test:live-workflows:headless -- --prepare
sg docker -c 'npm run test:live-workflows:headless -- --offline'
# Select a single scenario with --case adapt-format (or any name above).
sg docker -c 'YP_WORKFLOW_MANUAL_LIVE=1 npm run test:live-workflows:headless -- --live --env ../.envForAgentDoNotViewOnlyImport --config .live-workflow-manual/config.json'
```

The same independent Codex/processing model choices and backend prices described below apply. `trialBudgetMicros` is the **whole suite's processing ceiling**, divided equally across selected cases. The example $2 allowance gives each of five fresh workspaces at most $0.40. The format-adaptation case runs first. Cases run sequentially and stop on the first failure; there is no automatic paid retry or transfer of unused allowance. The run-control scenario deliberately approves a higher per-agent cap on resume, within its existing run/workspace allowance.

For `--case approved-bulk`, use a separate config (up to $5 processing). The fixed fictional fixture covers mandatory/preferred degrees, experience alternatives, a license requirement and unstated qualifications. Bulk processes **all ten records**, including the two trial records; reports separate trial charges from the ten-record estimate and actual cost. No sample-result reuse is claimed. The test admin approves the existing workspace allowance minus trial charges; if the estimate upper bound exceeds it, the case stops. Codex has no bulk-approval capability. A manual-only gate holds acknowledgement after a durable level checkpoint, verifies no unsettled reservation, then sends SIGKILL to the one owned processing container. The server and Codex VM stay running: this tests processing-container recovery, not host restart or ambiguous in-flight billing. Resume must preserve source, approval and checkpoint, change execution ID, and send only the twenty remaining analysis requests. JSON results and adapted inputs are downloaded for both runs. Major phases write `progress.json` for diagnostics if the harness is interrupted.

Codex API charges are separate from that processing ceiling. Only the three chat scenarios start Codex, with at most two user turns each, a twenty-minute deadline and 120-item limit per turn (including reasoning, messages and commands), a 32,768-token output setting per model response and web search disabled. These bounds are not a combined dollar cap. Unexpected approvals or model errors fail the case. Live mode uses the previously authorized manual API-key profile; production now also supports explicit, per-user API-key login for Codex; environment fallback remains disabled.

Each scenario saves a report, downloaded outputs, and (when applicable) two chat transcripts, activity counts and the generated adapter/graph under `.live-workflow-manual/results/headless-<mode>-<random>/`. The suite report totals processing usage, records incomplete scenarios and reports cleanup failures. No credential file is read during preparation or offline rehearsal. Offline processing usage is simulated ledger data; only a live run establishes provider cost and model behavior.

Codex usage is also saved incrementally to `codex-usage.json`, before the disposable database and VM are removed. Reports include input, cached-input, cache-write, output and reasoning token counts, per-response estimates, and `codexEstimatedCostMicros` for the suite. Replayed cumulative counters are deduplicated; reasoning tokens are already included in output and are not charged twice. Missing prices or incomplete usage are flagged instead of reported as zero. Codex costs are estimates using the requested tier and backend prices: app-server usage events do not establish the provider's actual applied tier. They are separate from the enforced processing allowance and are not an invoice.

Set `codexServiceTier` and `processingServiceTier` independently to `fast` for a faster paid test; both default to `regular`. The Codex adapter sends `serviceTier: "fast"`; processing uses Policy Synth's `inferenceType: "priority"`. Fast processing selects the backend's priority prices and reserves at those rates. If the provider reports a standard-tier downgrade, settlement uses the backend's standard prices. The reports preserve applied processing tiers. Unsupported fast-tier requests fail without an automatic paid retry; selecting fast never lowers reasoning effort.

Both Luna roles explicitly default to `max` reasoning. Set `codexReasoningEffort` and `processingReasoningEffort` independently in the manual config (`low`, `medium`, `high`, `xhigh`, or `max`). Reports retain both choices. In the product, group administrators select Codex effort and operators can override an agent's effort from its graph inspector. Agent overrides apply to all model roles in that node and require OpenAI reasoning models. The backend catalog supplies the default when a node has no override. Effort is captured in the run snapshot and request identity; changing it invalidates trial evidence for bulk approval. The processing output bound is 32,768 tokens, including reasoning and final output, with both covered by the reservation and usage ledger. OpenAI calls can take up to six minutes; the VM gateway and runner allow additional time for the outcome and ledger settlement. A headless processing run has a 45-minute deadline. Incomplete or timed-out calls pause with their reservation retained and are never automatically retried. Higher effort is a quality setting to evaluate, not a guarantee of correct output. Use an effort supported by the selected model.

## Original browser smoke case

This is the first real-account test case, adapted from Eidosoma's `sessionRealtimeA4RealCodex.manual.ts` and dataset/attachment manual tests. It tests **hello → upload two job descriptions → Skills First trial → download results**. The executable is [skillsFirst.manual.ts](../skillsFirst.manual.ts); it is excluded from the ordinary unit suite.

[The fixture](fixtures/skills-first-jobs.json) contains two fictional, single-level jobs: Library Program Assistant and IT Support Technician. It uses the Skills First input fields `id`, `name`, `text`, `jurisdiction`, and `source`. These are test records, not vacancies or legal guidance. The unmodified package runs normalize → split levels → seven analyses → rewrite and independent review → export. Research, Firecrawl, comparison and external writes remain disabled for this first case.

## Prepare and rehearse without credentials

From `server_api`:

```sh
npm run test:live-workflows:manual -- --prepare
sg docker -c 'npm run test:live-workflows:manual -- --offline'
```

Both commands leave `.envForImportOnly` unread. Preparation lists the fixture and requirements. Rehearsal uses deterministic Codex and processing responses, with the actual Lit UI, HTTP controller, PostgreSQL store/migration, VM WebSocket broker, package validation, isolated processing container, artifact persistence, SSE and browser downloads. It checks plumbing; fixture responses are not a model-quality evaluation.

Prerequisites: npm dependencies, Playwright Chromium, a running Docker daemon, and the existing `postgres:16-alpine` and `yp-live-workflow/processing-runtime:1` images. Live mode also needs `yp-live-workflow/codex-runtime:1` and `sysbox-runc`. The command builds the TypeScript VM modules. It never builds/pulls Docker images or starts the Docker daemon. The [runtime guide](../../../../live-workflow-runtime/README.md) covers those installations. Use `sg docker -c` only when your shell needs Docker group access.

## Run together after the key arrives

The default credential path is **repository-root `.envForImportOnly`**. Its supported entries are `OPENAI_API_KEY` or `PS_AGENT_OVERRIDE_OPENAI_API_KEY`. The importer reads the value into the test process without executing shell syntax, printing it, or importing other settings. An existing `YP_WORKFLOW_MANUAL_OPENAI_KEY` or `OPENAI_API_KEY` in the process takes precedence. No key is copied into source, reports, processing containers, or Docker command arguments. The Codex test connection receives its key through app-server RPC. Temporary Codex credentials are removed on shutdown. The import file is git-ignored and is not deleted by the harness.

Copy the non-secret [config example](config.example.json) to `server_api/.live-workflow-manual/config.json`. Both models default to `gpt-6-luna`. Change `codexModel` for the greeting and `processingModel` for Skills First independently; changing either leaves the other unchanged. The standard GPT-6 Luna, Sol and Astra processing models use the same [definitions](../../../agents/managers/openAiGpt6Models.ts) as the backend's `NewAiModelSetup`, including cached-input and cache-write prices. No prices need to be copied into the manual config, and the test does not start or connect to the application database. `YP_LIVE_WORKFLOW_MODELS`, if set, replaces this catalog just as it does in production; the selected processing model must have positive prices and use OpenAI. Do not put credentials in the JSON file.

Once the credentials and model choices are ready, run explicitly:

```sh
sg docker -c 'YP_WORKFLOW_MANUAL_LIVE=1 npm run test:live-workflows:manual -- --live'
```

Both `--live` and the opt-in variable are required before any credential import. `--env /absolute/path` and `--config /absolute/path` override file locations. `--headed` displays the automated Chromium window when a graphical session is available. The harness also prints a loopback URL that can be opened while the test runs.

As requested, the default live test uses an API-key profile for **both Codex chat and processing**, following Eidosoma's manual-test approach. This profile is constructed only in the test executable through an in-process adapter dependency. For the interactive test above, the normal application login route and VM resolver handle the supplied key without this injection. A separate `--auth chatgpt` option waits up to ten minutes for the normal device-code login using the printed local URL; processing still uses the imported API key. API-key mode does not verify ChatGPT login.

## Cost and acceptance

The example gives processing a **$2 workspace and trial allowance**, with serial execution and two input records. The manual config accepts $0.10–$5; the production budget ledger reserves each call before dispatch and settles reported token usage. Model failures or exhausted allowances stop the test. There is no automatic budget increase, bulk approval, or whole-test retry. Single-level records normally use ten calls each; rewrite validation can add bounded retries.

The Codex greeting is separately billed in API-key mode, outside that processing allowance. The harness permits one greeting, configures a 4,096-token output limit, disables web search, requests no tools, and times out after five minutes. It does not claim a combined dollar cap for Codex plus processing. Processing has a 45-minute deadline to allow Luna's longer reasoning calls. Only the live run can establish actual model quality and costs.

The assertions require:

- A nonempty Codex reply delivered through the event stream and shown in chat.
- The uploaded file's checksum, preview record IDs, and denial of access through another group.
- Completion of all five enabled processing stages with settled usage within the allowance.
- Browser downloads of JSON, CSV and Markdown with matching filenames, byte counts and SHA-256 checksums.
- Both job IDs retained with the normal asset-version prefix, exact original text retained, all seven analyses present, all quoted evidence found in the original, nonempty proposed rewrites, and no per-record errors. `unknown` findings are allowed and counted.
- Results visible in the review UI and no browser JavaScript errors.

Reports, a results screenshot, greeting and downloaded exports are saved under the git-ignored `server_api/.live-workflow-manual/results/<mode>-<random>/`. A failed test exits nonzero and records status/progress/cost diagnostics. Reports omit account records and provider request/response dumps. Review the actual rewrites together after a live run; structural acceptance is not a semantic hiring-policy evaluation.

The harness creates its own loopback-only Postgres container/database, temporary workspace and fixture group/operator. It cleans them up on success, failure or interruption and reports cleanup failures. It never uses application `DATABASE_URL`, deployed groups, or existing user records. Your Priorities site sign-in and group membership are fixtures; real application membership, external connectors, host restart/in-flight recovery and public hosting remain separate tests. Avoid a forced kill, which prevents normal cleanup; any manual cleanup should target only the reported test resources.
