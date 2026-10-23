import { type IdahoRow } from "./idahoData.js";
import type { BrowserObservation } from "./interactiveBrowser.js";
export declare const idahoStages: string[];
export declare const idahoExperiment = "Please process everything using these agents: Normalize records, Split and verify job levels, Analyze requirements, Rewrite and validate, Compare datasets, Compare license and education, Export results.";
export declare const idahoResearchStages: string[];
export declare const idahoResearchExperiment: string;
export declare const idahoInstructions = "<details><summary>Idaho trial and estimate</summary><p>Upload idaho-first-100.csv in Data first. Then use the imported test key and send the experiment below. The trial samples five source records across input lengths, including both extremes. All non-web stages run; missing comparison evidence stays unknown. Review Results, download the artifacts, and estimate the whole 100-record run. Do not approve bulk spending.</p><pre>Please process everything using these agents: Normalize records, Split and verify job levels, Analyze requirements, Rewrite and validate, Compare datasets, Compare license and education, Export results.</pre></details>";
export declare const idahoResearchInstructions: string;
/** Scripted operator is only used by the offline rehearsal; live Codex writes its own adapter. */
export declare function offlineIdahoOperator(research?: boolean, detachedResearch?: boolean): (workspace: string) => Promise<string>;
export declare function verifyIdahoActions(observed: BrowserObservation[], downloads: string[]): void;
export declare function verifyIdahoResults(source: IdahoRow[], assetId: string, sampled: string[], adapted: unknown, output: unknown, research?: boolean): {
    sampledParents: number;
    outputRecords: number;
    unknown: number;
    allSevenAnalyses: boolean;
    reviewedRewrites: boolean;
};
