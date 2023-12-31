const gpt4InTokenPrice = 0.03 / 1000;
const gpt4OutTokenPrice = 0.06 / 1000;
const gpt35_16kInTokenPrice = 0.003 / 1000;
const gpt35_16kOutTokenPrice = 0.004 / 1000;
const gpt35InTokenPrice = 0.0015 / 1000;
const adaInTokenPrice = 0.0001;
const gpt35kOutTokenPrice = 0.002 / 1000;
const gpt35_16k_TPM = 750000;
const gpt35_16k_RPM = 10000;
const gpt35_TPM = 180000;
const gpt35_RPM = 3500;
const gpt4_TPM = 40000;
const gpt4_RPM = 200;
export class IEngineConstants {
    static createSubProblemsModel = {
        name: "gpt-4",
        temperature: 0.7,
        maxOutputTokens: 4500,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: true
    };
    static policiesSeedModel = {
        name: "gpt-4",
        temperature: 0.7,
        maxOutputTokens: 4096,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static analyseExternalSolutionsModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 256,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static createEntitiesModel = {
        name: "gpt-4",
        temperature: 0.7,
        maxOutputTokens: 2048,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: true
    };
    static topicMapSolutionsModel = {
        inTokenCostsUSD: adaInTokenPrice
    };
    static createSolutionImagesModel = {
        name: "gpt-4",
        temperature: 0.7,
        maxOutputTokens: 256,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static createSearchQueriesModel = {
        name: "gpt-4",
        temperature: 0.7,
        maxOutputTokens: 1024,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: true,
    };
    static createEvidenceSearchQueriesModel = {
        name: "gpt-4",
        temperature: 0.5,
        maxOutputTokens: 1024,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static searchQueryRankingsModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 2,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: true,
    };
    static searchResultsRankingsModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 2,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static subProblemsRankingsModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 2,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: true,
    };
    static entitiesRankingsModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 2,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: true,
    };
    static solutionsRankingsModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 2,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static prosConsRankingsModel = {
        name: "gpt-3.5-turbo",
        temperature: 0.0,
        maxOutputTokens: 2,
        tokenLimit: 8192,
        inTokenCostUSD: gpt35InTokenPrice,
        outTokenCostUSD: gpt35kOutTokenPrice,
        limitTPM: gpt35_TPM,
        limitRPM: gpt35_RPM,
        verbose: false,
    };
    static getPageAnalysisModel = {
        name: "gpt-3.5-turbo-16k",
        temperature: 0.0,
        maxOutputTokens: 2048,
        tokenLimit: 16385,
        inTokenCostUSD: gpt35_16kInTokenPrice,
        outTokenCostUSD: gpt35_16kOutTokenPrice,
        limitTPM: gpt35_16k_TPM,
        limitRPM: gpt35_16k_RPM,
        verbose: false,
    };
    static rankWebSolutionsModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 2048,
        tokenLimit: 4096,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static rateWebEvidenceModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 2048,
        tokenLimit: 4096,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static rankWebEvidenceModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 2048,
        tokenLimit: 4096,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static getRefinedEvidenceModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 1750,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static reapSolutionsModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 128,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static groupSolutionsModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 2048,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static rateSolutionsModel = {
        name: "gpt-4",
        temperature: 0.0,
        maxOutputTokens: 1024,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false
    };
    static createSolutionsModel = {
        name: "gpt-4",
        temperature: 0.5,
        maxOutputTokens: 1200,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static evolveSolutionsModel = {
        name: "gpt-4",
        temperature: 0.5,
        maxOutputTokens: 1200,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static createProsConsModel = {
        name: "gpt-4",
        temperature: 0.7,
        maxOutputTokens: 2048,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static evolutionMutateModel = {
        name: "gpt-4",
        temperature: 0.7,
        maxOutputTokens: 1024,
        tokenLimit: 8192,
        inTokenCostUSD: gpt4InTokenPrice,
        outTokenCostUSD: gpt4OutTokenPrice,
        limitTPM: gpt4_TPM,
        limitRPM: gpt4_RPM,
        verbose: false,
    };
    static evolutionRecombineModel = {
        name: "gpt-4",
        temperature: 0.7,
        maxOutputTokens: 1024,
        tokenLimit: 8192,
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
    static maxTopQueriesToSearchPerType = 4;
    static maxTopEvidenceQueriesToSearchPerType = 4;
    static mainSearchRetryCount = 40;
    static maxDalleRetryCount = 7;
    static maxTopWebPagesToGet = 10;
    static maxWebPagesToGetByTopSearchPosition = 10;
    static maxEvidenceWebPagesToGetByTopSearchPosition = 10;
    static maxBingSearchResults = 10;
    static maxTopProsConsUsedForRating = 2;
    static maxNumberGeneratedProsConsForSolution = 3;
    static minSleepBeforeBrowserRequest = 50;
    static maxAdditionalRandomSleepBeforeBrowserRequest = 100;
    static numberOfSearchTypes = 4;
    static webPageNavTimeout = 60 * 1000;
    static currentUserAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36";
    static topItemsToKeepForTopicClusterPruning = 5;
    static chances = {
        createSolutions: {
            searchQueries: {
                useMainProblemSearchQueries: 0.01,
                useOtherSubProblemSearchQueries: 0.09,
                useSubProblemSearchQueries: 0.45,
                useRandomEntitySearchQueries: 0.45,
            },
            webSolutions: {
                top: 0.20,
                topThree: 0.45,
                topSeven: 0.25,
                all: 0.10
            },
            notUsingTopSearchQueries: 0.50,
            vectorSearchAcrossAllProblems: 0.01,
        },
    };
    static maxTopSearchQueriesForSolutionCreation = 8;
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
            policiesSeed: true
        },
    };
    static evolution = {
        populationSize: 80,
        limitTopTopicClusterElitesToEloRating: 850,
        // Population split
        keepElitePercent: 0.1,
        randomImmigrationPercent: 0.40,
        mutationOffspringPercent: 0.40,
        crossoverPercent: 0.1,
        // General mutation rate split
        lowMutationRate: 0.4,
        mediumMutationRate: 0.4,
        highMutationRate: 0.2,
        selectParentTournamentSize: 7,
        crossoverMutationPercent: 0.1,
    };
    static maxPercentOfEloMatched = 0.75;
    static minimumNumberOfPairwiseVotesForPopulation = 8;
    static maxNumberOfPairwiseRankingPrompts = IEngineConstants.evolution.populationSize *
        IEngineConstants.minimumNumberOfPairwiseVotesForPopulation;
    static maxTopSolutionsToCreatePolicies = 3;
    static maxTopPoliciesToProcess = 1;
    static maxEvidenceToUseForRatingEvidence = 5;
    static policyEvidenceFieldTypes = [
        'allPossiblePositiveEvidenceIdentifiedInTextContext',
        'allPossibleNegativeEvidenceIdentifiedInTextContext',
        'allPossibleNeutralEvidenceIdentifiedInTextContext',
        'allPossibleEconomicEvidenceIdentifiedInTextContext',
        'allPossibleScientificEvidenceIdentifiedInTextContext',
        'allPossibleCulturalEvidenceIdentifiedInTextContext',
        'allPossibleEnvironmentalEvidenceIdentifiedInTextContext',
        'allPossibleLegalEvidenceIdentifiedInTextContext',
        'allPossibleTechnologicalEvidenceIdentifiedInTextContext',
        'allPossibleGeopoliticalEvidenceIdentifiedInTextContext',
        'allPossibleCaseStudiesIdentifiedInTextContext',
        'allPossibleStakeholderOpinionsIdentifiedInTextContext',
        'allPossibleExpertOpinionsIdentifiedInTextContext',
        'allPossiblePublicOpinionsIdentifiedInTextContext',
        'allPossibleHistoricalContextIdentifiedInTextContext',
        'allPossibleEthicalConsiderationsIdentifiedInTextContext',
        'allPossibleLongTermImpactIdentifiedInTextContext',
        'allPossibleShortTermImpactIdentifiedInTextContext',
        'allPossibleLocalPerspectiveIdentifiedInTextContext',
        'allPossibleGlobalPerspectiveIdentifiedInTextContext',
        'allPossibleCostAnalysisIdentifiedInTextContext',
        'allPossibleImplementationFeasibilityIdentifiedInTextContext'
    ];
    static simplifyEvidenceType(evidenceType) {
        let type = evidenceType
            .replace(/allPossible/g, "")
            .replace(/IdentifiedInTextContext/g, "");
        type = type.charAt(0).toLowerCase() + type.slice(1);
        return type;
    }
}
