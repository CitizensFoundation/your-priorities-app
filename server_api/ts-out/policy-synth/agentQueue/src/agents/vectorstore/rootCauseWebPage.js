"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootCauseWebPageVectorStore = void 0;
const weaviate_ts_client_1 = __importDefault(require("weaviate-ts-client"));
const base_js_1 = require("../../base.js");
const constants_js_1 = require("../../constants.js");
const promises_1 = __importDefault(require("fs/promises"));
class RootCauseWebPageVectorStore extends base_js_1.Base {
    static fieldsToExtract = "searchType groupId rootCauseRelevanceToProblemStatement \
    allPossibleHistoricalRootCausesIdentifiedInTextContext\
    allPossibleEconomicRootCausesIdentifiedInTextContext\
    allPossibleScientificRootCausesIdentifiedInTextContext\
    allPossibleCulturalRootCausesIdentifiedInTextContext\
    allPossibleSocialRootCausesIdentifiedInTextContext\
    allPossibleEnvironmentalRootCausesIdentifiedInTextContext\
    allPossibleLegalRootCausesIdentifiedInTextContext\
    allPossibleTechnologicalRootCausesIdentifiedInTextContext\
    allPossibleGeopoliticalRootCausesIdentifiedInTextContext\
    allPossibleEthicalRootCausesIdentifiedInTextContext\
    allPossibleRootCausesCaseStudiesIdentifiedInTextContext\
    rootCauseRelevanceToProblemStatementScore\
    rootCauseRelevanceToTypeScore\
    rootCauseQualityScore\
    rootCauseConfidenceScore\
    totalScore\
    url\
    _additional { id, distance }";
    //@ts-ignore
    static client = weaviate_ts_client_1.default.client({
        scheme: process.env.WEAVIATE_HTTP_SCHEME || "http",
        host: process.env.WEAVIATE_HOST || "localhost:8080",
    });
    async addSchema() {
        let classObj;
        try {
            const data = await promises_1.default.readFile("./schemas/rootCauseWebPage.json", "utf8");
            classObj = JSON.parse(data);
        }
        catch (err) {
            console.error(`Error reading file from disk: ${err}`);
            return;
        }
        try {
            const res = await RootCauseWebPageVectorStore.client.schema.classCreator().withClass(classObj).do();
            console.log(res);
        }
        catch (err) {
            console.error(`Error creating schema: ${err}`);
        }
    }
    async showScheme() {
        try {
            const res = await RootCauseWebPageVectorStore.client.schema.getter().do();
            console.log(JSON.stringify(res, null, 2));
        }
        catch (err) {
            console.error(`Error creating schema: ${err}`);
        }
    }
    async deleteScheme() {
        try {
            const res = await RootCauseWebPageVectorStore.client.schema.classDeleter().withClassName("RootCauseWebPage").do();
            console.log(res);
        }
        catch (err) {
            console.error(`Error creating schema: ${err}`);
        }
    }
    async testQuery() {
        const where = [];
        const res = await RootCauseWebPageVectorStore.client.graphql
            .get()
            .withClassName("RootCauseWebPage")
            .withFields(
        // TODO: confirm fields
        RootCauseWebPageVectorStore.fieldsToExtract)
            .withNearText({ concepts: ["literacy"] })
            .withLimit(100)
            .do();
        console.log(JSON.stringify(res, null, 2));
        return res;
    }
    async postWebPage(webPageAnalysis) {
        return new Promise((resolve, reject) => {
            RootCauseWebPageVectorStore.client.data
                .creator()
                .withClassName("RootCauseWebPage")
                .withProperties(webPageAnalysis)
                .do()
                .then((res) => {
                this.logger.info(`Weaviate: Have saved root cause web page ${webPageAnalysis.url}`);
                resolve(res);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    async updateWebPage(id, webPageAnalysis) {
        return new Promise((resolve, reject) => {
            RootCauseWebPageVectorStore.client.data
                .updater()
                .withId(id)
                .withClassName("RootCauseWebPage")
                .withProperties(webPageAnalysis)
                .do()
                .then((res) => {
                this.logger.info(`Weaviate: Have updated web page ${webPageAnalysis.url}`);
                resolve(res);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    async updateWebRootCause(id, rootCauseType, rootCauses, quiet = false) {
        const props = {};
        props[rootCauseType] = rootCauses;
        return new Promise((resolve, reject) => {
            RootCauseWebPageVectorStore.client.data
                .merger()
                .withId(id)
                .withClassName("RootCauseWebPage")
                .withProperties(props)
                .do()
                .then((res) => {
                if (!quiet)
                    this.logger.info(`Weaviate: Have updated web solutions for ${id}`);
                resolve(res);
            })
                .catch((err) => {
                this.logger.error(err.stack || err);
                reject(err);
            });
        });
    }
    async saveWebPageMetadata(id, metadata, quiet = false) {
        const props = {};
        return new Promise((resolve, reject) => {
            RootCauseWebPageVectorStore.client.data
                .merger()
                .withId(id)
                .withClassName("rootCauseWebPage")
                .withProperties(metadata)
                .do()
                .then((res) => {
                if (!quiet)
                    this.logger.info(`Weaviate: Have updated web solutions for ${id}`);
                resolve(res);
            })
                .catch((err) => {
                this.logger.error(err.stack || err);
                reject(err);
            });
        });
    }
    async updateRefinedAnalysis(id, refinedRootCause, quiet = false) {
        const totalScore = (refinedRootCause.rootCauseRelevanceToProblemStatementScore ?? 0) +
            (refinedRootCause.rootCauseRelevanceToTypeScore ?? 0) +
            (refinedRootCause.rootCauseQualityScore ?? 0) +
            (refinedRootCause.rootCauseConfidenceScore ?? 0);
        this.logger.debug(`Total score is ${totalScore} for ${id}`);
        return new Promise((resolve, reject) => {
            RootCauseWebPageVectorStore.client.data
                .merger()
                .withId(id)
                .withClassName("RootCauseWebPage")
                .withProperties(refinedRootCause)
                .do()
                .then((res) => {
                if (!quiet)
                    this.logger.info(`Weaviate: Have updated refined root cause type for ${id}`);
                resolve(res);
            })
                .catch((err) => {
                this.logger.error(err.stack || err);
                reject(err);
            });
        });
    }
    async updateScores(id, scores, quiet = false) {
        return new Promise((resolve, reject) => {
            RootCauseWebPageVectorStore.client.data
                .merger()
                .withId(id)
                .withClassName("RootCauseWebPage")
                .withProperties({
                rootCauseQualityScore: scores.rootCauseQualityScore,
                rootCauseRelevanceToProblemStatementScore: scores.rootCauseRelevanceToProblemStatementScore,
                rootCauseConfidenceScore: scores.rootCauseConfidenceScore,
                rootCauseRelevanceToRootCauseTypeScore: scores.rootCauseRelevanceToRootCauseTypeScore,
                totalScore: scores.rootCauseConfidenceScore + scores.rootCauseQualityScore + scores.rootCauseRelevanceToProblemStatementScore,
            })
                .do()
                .then((res) => {
                if (!quiet)
                    this.logger.info(`Weaviate: Have updated scores for ${id}`);
                resolve(res);
            })
                .catch((err) => {
                this.logger.error(err.stack || err);
                reject(err);
            });
        });
    }
    async getWebPage(id) {
        return new Promise((resolve, reject) => {
            RootCauseWebPageVectorStore.client.data
                .getterById()
                .withId(id)
                .withClassName("RootCauseWebPage")
                .do()
                .then((res) => {
                this.logger.info(`Weaviate: Have got web page ${id}`);
                const webData = res.properties;
                resolve(webData);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    async getTopPagesForProcessing(groupId, searchType, limit = 10) {
        let query;
        let where = undefined;
        where = [
            {
                path: ["groupId"],
                operator: "Equal",
                valueInt: groupId,
            },
        ];
        if (searchType) {
            where.push({
                path: ["searchType"],
                operator: "Equal",
                valueString: searchType,
            });
        }
        try {
            query = RootCauseWebPageVectorStore.client.graphql
                .get()
                .withClassName("RootCauseWebPage")
                .withLimit(limit)
                .withSort([{ path: ["totalScore"], order: "desc" }])
                .withWhere({
                operator: "And",
                operands: where,
            })
                .withFields(RootCauseWebPageVectorStore.fieldsToExtract);
            return await query.do();
        }
        catch (err) {
            throw err;
        }
    }
    async getTopWebPagesForProcessing(groupId, searchType = undefined, limit = 10, offset = 0, rootCauseCountLimit = 0, onlyRefined = false) {
        let where = undefined;
        where = [
            {
                path: ["groupId"],
                operator: "Equal",
                valueInt: groupId,
            },
        ];
        if (searchType) {
            where.push({
                path: ["searchType"],
                operator: "Equal",
                valueString: searchType,
            });
        }
        if (onlyRefined) {
            where.push({
                path: ["hasBeenRefined"],
                operator: "Equal",
                valueBoolean: true,
            });
        }
        if (rootCauseCountLimit !== undefined) {
        }
        let query;
        try {
            query = RootCauseWebPageVectorStore.client.graphql
                .get()
                .withClassName("RootCauseWebPage")
                .withLimit(limit)
                .withOffset(offset)
                .withSort([{ path: ["totalScore"], order: "desc" }])
                .withWhere({
                operator: "And",
                operands: where,
            })
                .withFields(RootCauseWebPageVectorStore.fieldsToExtract);
            return await query.do();
        }
        catch (err) {
            throw err;
        }
    }
    async getWebPagesForProcessing(groupId, searchType = undefined, limit = 10, offset = 0, rootCauseCountLimit = 0) {
        this.logger.info(`getWebPagesForProcessing -- Group_Id: ${groupId}, searchType: ${searchType}.`);
        let where = undefined;
        where = [
            {
                path: ["groupId"],
                operator: "Equal",
                valueInt: groupId,
            },
        ];
        if (searchType) {
            where.push({
                path: ["searchType"],
                operator: "Equal",
                valueString: searchType,
            });
        }
        if (rootCauseCountLimit !== undefined) {
        }
        let query;
        try {
            query = RootCauseWebPageVectorStore.client.graphql
                .get()
                .withClassName("RootCauseWebPage")
                .withLimit(limit)
                .withOffset(offset)
                .withWhere({
                operator: "And",
                operands: where,
            })
                .withFields(RootCauseWebPageVectorStore.fieldsToExtract);
            return await query.do();
        }
        catch (err) {
            throw err;
        }
    }
    async webPageExist(groupId, url, searchType) {
        //TODO: Fix any here
        const where = [];
        where.push({
            path: ["groupId"],
            operator: "Equal",
            valueInt: groupId,
        });
        where.push({
            path: ["url"],
            operator: "Equal",
            valueString: url,
        });
        where.push({
            path: ["searchType"],
            operator: "Equal",
            valueString: searchType,
        });
        let results;
        try {
            results = await RootCauseWebPageVectorStore.client.graphql
                .get()
                .withClassName("RootCauseWebPage")
                .withLimit(1)
                .withWhere({
                operator: "And",
                operands: where,
            })
                .withFields("searchType rootCauseRelevanceToProblemStatement url \
          _additional { distance }")
                .do();
            const resultPages = results.data.Get["RootCauseWebPage"];
            return resultPages.length > 0;
        }
        catch (err) {
            throw err;
        }
    }
    async searchWebPages(query, groupId, searchType) {
        //TODO: Fix any here
        const where = [];
        if (groupId) {
            where.push({
                path: ["groupId"],
                operator: "Equal",
                valueInt: groupId,
            });
        }
        if (searchType) {
            where.push({
                path: ["searchType"],
                operator: "Equal",
                valueString: searchType,
            });
        }
        let results;
        try {
            results = await RootCauseWebPageVectorStore.client.graphql
                .get()
                .withClassName("RootCauseWebPage")
                .withNearText({ concepts: [query] })
                .withLimit(constants_js_1.IEngineConstants.limits.webPageVectorResultsForNewSolutions)
                .withWhere({
                operator: "And",
                operands: where,
            })
                .withFields("searchType rootCauseRelevanceToProblemStatement url \
          _additional { distance }")
                .do();
        }
        catch (err) {
            throw err;
        }
        return results;
    }
}
exports.RootCauseWebPageVectorStore = RootCauseWebPageVectorStore;
