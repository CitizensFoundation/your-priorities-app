"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IEngineConstants = void 0;
const gpt4InTokenPrice = 0.01 / 1000;
const gpt4OutTokenPrice = 0.03 / 1000;
const gpt35_16kInTokenPrice = 0.001 / 1000;
const gpt35_16kOutTokenPrice = 0.002 / 1000;
// The total limit is 128k but we'll use the first 70k
const gpt4TotalTokenLimit = 70000;
const adaInTokenPrice = 0.0001;
const gpt35_16k_TPM = 1000000;
const gpt35_16k_RPM = 10000;
const gpt35_TPM = 750000;
const gpt35_RPM = 10000;
const gpt4_TPM = 150000;
const gpt4_RPM = 10000;
class IEngineConstants {
    static createSubProblemsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.7,
        maxOutputTokens: 4096,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: true,
    };
    static policiesSeedModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.7,
        maxOutputTokens: 4096,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static analyseExternalSolutionsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 256,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static createEntitiesModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.7,
        maxOutputTokens: 2048,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: true,
    };
    static topicMapSolutionsModel = {
        inTokenCostsUSD: adaInTokenPrice,
    };
    static createSolutionImagesModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.7,
        maxOutputTokens: 256,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static createSearchQueriesModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.7,
        maxOutputTokens: 1024,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: true,
    };
    static createEvidenceSearchQueriesModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.5,
        maxOutputTokens: 1024,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static createRootCauseSearchQueriesModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.7,
        maxOutputTokens: 1024,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: true
    };
    static searchQueryRankingsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 2,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static searchResultsRankingsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 2,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static subProblemsRankingsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 2,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static entitiesRankingsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 2,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: true,
    };
    static solutionsRankingsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 2,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static prosConsRankingsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 2,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static getPageAnalysisModel = {
        name: "gpt-3.5-turbo-1106",
        temperature: 0.0,
        maxOutputTokens: 2048,
        tokenLimit: 16385,
        inTokenCostUSD: gpt35_16kInTokenPrice,
        outTokenCostUSD: gpt35_16kOutTokenPrice,
        limitTPM: gpt35_16k_TPM,
        limitRPM: gpt35_16k_RPM,
        verbose: false,
    };
    static getSolutionsPagesAnalysisModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 4000,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static rankWebSolutionsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 2048,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static reduceSubProblemsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.1,
        maxOutputTokens: 4096,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static rateWebEvidenceModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 2048,
        tokenLimit: 4096,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static rateWebRootCausesModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 2048,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static rankWebEvidenceModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 2048,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static rankWebRootCausesModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 2048,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static getRefinedEvidenceModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 2048,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static getRefinedRootCausesModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 3048,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static reapSolutionsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 128,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static groupSolutionsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 4095,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static rateSolutionsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.0,
        maxOutputTokens: 1024,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static createSolutionsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.5,
        maxOutputTokens: 1200,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static evolveSolutionsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.5,
        maxOutputTokens: 1200,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static createProsConsModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.7,
        maxOutputTokens: 2048,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static evolutionMutateModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.7,
        maxOutputTokens: 1024,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static evolutionRecombineModel = {
        name: "gpt-4-1106-preview",
        temperature: 0.7,
        maxOutputTokens: 1024,
        tokenLimit: gpt4TotalTokenLimit,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static getPageCacheExpiration = 60 * 60 * 24 * 7 * 4 * 6; // 6 months
    static maxSubProblems = 7;
    static maxNumberGeneratedOfEntities = 7;
    static maxStabilityRetryCount = 14;
    static mainLLMmaxRetryCount = 40;
    static limitedLLMmaxRetryCount = 10;
    static rankingLLMmaxRetryCount = 40;
    // See also hardcoded 3 for project 1 in createSolutions
    static maxTopEntitiesToSearch = 4;
    static maxTopEntitiesToRender = 3;
    static maxTopQueriesToSearchPerType = 5;
    static maxTopEvidenceQueriesToSearchPerType = 4;
    static maxTopRootCauseQueriesToSearchPerType = 5;
    static maxRootCausePercentOfSearchResultWebPagesToGet = 0.65;
    static maxRootCausesToUseForRatingRootCauses = 5;
    static topWebPagesToGetForRefineRootCausesScan = 10;
    static mainSearchRetryCount = 40;
    static maxDalleRetryCount = 7;
    static maxTopWebPagesToGet = 5;
    static maxBingSearchResults = 10;
    static maxTopProsConsUsedForRating = 2;
    static maxNumberGeneratedProsConsForSolution = 3;
    static minSleepBeforeBrowserRequest = 50;
    static maxAdditionalRandomSleepBeforeBrowserRequest = 100;
    static numberOfSearchTypes = 4;
    static webPageNavTimeout = 30 * 1000;
    static subProblemsRankingMinNumberOfMatches = 10;
    static currentUserAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36";
    static topItemsToKeepForTopicClusterPruning = 3;
    static chances = {
        createSolutions: {
            searchQueries: {
                useMainProblemSearchQueries: 0.01,
                useOtherSubProblemSearchQueries: 0.01,
                useSubProblemSearchQueries: 0.38,
                useRandomEntitySearchQueries: 0.58,
            },
            webSolutions: {
                top: 0.05,
                topThree: 0.25,
                topSeven: 0.50,
                all: 0.20,
            },
            notUsingTopSearchQueries: 0.1,
            vectorSearchAcrossAllProblems: 0.001,
        },
    };
    static maxTopSearchQueriesForSolutionCreation = 8;
    static maxPercentOfSolutionsWebPagesToGet = 0.25;
    static limits = {
        webPageVectorResultsForNewSolutions: 14,
        useRandomTopFromVectorSearchResults: 14,
    };
    static enable = {
        refine: {
            createSubProblems: true,
            createEntities: true,
            createSolutions: true,
            createProsCons: true,
            policiesSeed: true,
        },
    };
    static evolution = {
        populationSize: 80,
        limitTopTopicClusterElitesToEloRating: 850,
        // Population split
        keepElitePercent: 0.1,
        randomImmigrationPercent: 0.4,
        mutationOffspringPercent: 0.35,
        crossoverPercent: 0.15,
        // General mutation rate split
        lowMutationRate: 0.5,
        mediumMutationRate: 0.3,
        highMutationRate: 0.2,
        selectParentTournamentSize: 7,
        crossoverMutationPercent: 0.05,
    };
    static maxPercentOfEloMatched = 0.75;
    static minimumNumberOfPairwiseVotesForPopulation = 10;
    static maxNumberOfPairwiseRankingPrompts = IEngineConstants.evolution.populationSize * IEngineConstants.minimumNumberOfPairwiseVotesForPopulation;
    static maxTopSolutionsToCreatePolicies = 3;
    static maxTopPoliciesToProcess = 1;
    static maxEvidenceToUseForRatingEvidence = 5;
    static policyEvidenceFieldTypes = [
        "allPossiblePositiveEvidenceIdentifiedInTextContext",
        "allPossibleNegativeEvidenceIdentifiedInTextContext",
        "allPossibleNeutralEvidenceIdentifiedInTextContext",
        "allPossibleEconomicEvidenceIdentifiedInTextContext",
        "allPossibleScientificEvidenceIdentifiedInTextContext",
        "allPossibleCulturalEvidenceIdentifiedInTextContext",
        "allPossibleEnvironmentalEvidenceIdentifiedInTextContext",
        "allPossibleLegalEvidenceIdentifiedInTextContext",
        "allPossibleTechnologicalEvidenceIdentifiedInTextContext",
        "allPossibleGeopoliticalEvidenceIdentifiedInTextContext",
        "allPossibleCaseStudiesIdentifiedInTextContext",
        "allPossibleStakeholderOpinionsIdentifiedInTextContext",
        "allPossibleExpertOpinionsIdentifiedInTextContext",
        "allPossiblePublicOpinionsIdentifiedInTextContext",
        "allPossibleHistoricalContextIdentifiedInTextContext",
        "allPossibleEthicalConsiderationsIdentifiedInTextContext",
        "allPossibleLongTermImpactIdentifiedInTextContext",
        "allPossibleShortTermImpactIdentifiedInTextContext",
        "allPossibleLocalPerspectiveIdentifiedInTextContext",
        "allPossibleGlobalPerspectiveIdentifiedInTextContext",
        "allPossibleCostAnalysisIdentifiedInTextContext",
        "allPossibleImplementationFeasibilityIdentifiedInTextContext",
    ];
    static rootCauseFieldTypes = [
        "allPossibleHistoricalRootCausesIdentifiedInTextContext",
        "allPossibleEconomicRootCausesIdentifiedInTextContext",
        "allPossibleScientificRootCausesIdentifiedInTextContext",
        "allPossibleCulturalRootCausesIdentifiedInTextContext",
        "allPossibleSocialRootCausesIdentifiedInTextContext",
        "allPossibleEnvironmentalRootCausesIdentifiedInTextContext",
        "allPossibleLegalRootCausesIdentifiedInTextContext",
        "allPossibleTechnologicalRootCausesIdentifiedInTextContext",
        "allPossibleGeopoliticalRootCausesIdentifiedInTextContext",
        "allPossibleEthicalRootCausesIdentifiedInTextContext",
        "allPossibleRootCausesCaseStudiesIdentifiedInTextContext",
    ];
    static simplifyEvidenceType(evidenceType) {
        let type = evidenceType.replace(/allPossible/g, "").replace(/IdentifiedInTextContext/g, "");
        type = type.charAt(0).toLowerCase() + type.slice(1);
        return type;
    }
    static simplifyRootCauseType(rootCauseType) {
        let type = rootCauseType.replace(/allPossible/g, "").replace(/IdentifiedInTextContext/g, "");
        type = type.charAt(0).toLowerCase() + type.slice(1);
        if (type != "rootCausesCaseStudies") {
            type = type.slice(0, -1);
        }
        return type;
    }
}
exports.IEngineConstants = IEngineConstants;
