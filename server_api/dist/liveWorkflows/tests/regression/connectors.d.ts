import type { GroupCreationContinuation } from "../manual/groupCreationDriver.js";
import { type ManualHarness } from "../manual/harness.js";
import { type connectorFixtures } from "./connectorFixtures.js";
export declare function connectorsScenario(harness: ManualHarness, output: string, signal: AbortSignal, fixtures: ReturnType<typeof connectorFixtures>): GroupCreationContinuation;
