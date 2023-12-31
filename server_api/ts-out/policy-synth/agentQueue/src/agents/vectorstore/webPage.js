"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPageVectorStore = void 0;
const weaviate_ts_client_1 = __importDefault(require("weaviate-ts-client"));
const base_js_1 = require("../../base.js");
const constants_js_1 = require("../../constants.js");
const promises_1 = __importDefault(require("fs/promises"));
class WebPageVectorStore extends base_js_1.Base {
    //@ts-ignore
    static client = weaviate_ts_client_1.default.client({
        scheme: process.env.WEAVIATE_HTTP_SCHEME || "http",
        host: process.env.WEAVIATE_HOST || "localhost:8080",
    });
    async addSchema() {
        let classObj;
        try {
            const data = await promises_1.default.readFile("./schemas/webPage.json", "utf8");
            classObj = JSON.parse(data);
        }
        catch (err) {
            console.error(`Error reading file from disk: ${err}`);
            return;
        }
        try {
            const res = await WebPageVectorStore.client.schema
                .classCreator()
                .withClass(classObj)
                .do();
            console.log(res);
        }
        catch (err) {
            console.error(`Error creating schema: ${err}`);
        }
    }
    async showScheme() {
        try {
            const res = await WebPageVectorStore.client.schema.getter().do();
            console.log(JSON.stringify(res, null, 2));
        }
        catch (err) {
            console.error(`Error creating schema: ${err}`);
        }
    }
    async deleteScheme() {
        try {
            const res = await WebPageVectorStore.client.schema
                .classDeleter()
                .withClassName("WebPage")
                .do();
            console.log(res);
        }
        catch (err) {
            console.error(`Error creating schema: ${err}`);
        }
    }
    async testQuery() {
        const where = [];
        where.push({
            path: ["len(solutionsIdentifiedInTextContext)"],
            operator: "GreaterThan",
            valueInt: 0,
        });
        const res = await WebPageVectorStore.client.graphql
            .get()
            .withClassName("WebPage")
            .withWhere({
            operator: "And",
            operands: where,
        })
            .withFields("summary groupId entityIndex subProblemIndex relevanceToProblem \
        solutionsIdentifiedInTextContext mostRelevantParagraphs contacts tags entities \
        _additional { distance }")
            .withNearText({ concepts: ["democracy"] })
            .withLimit(100)
            .do();
        console.log(JSON.stringify(res, null, 2));
        return res;
    }
    async postWebPage(webPageAnalysis) {
        this.logger.info(`Weaviate: Saving web page ${JSON.stringify(webPageAnalysis, null, 2)}`);
        return new Promise((resolve, reject) => {
            WebPageVectorStore.client.data
                .creator()
                .withClassName("WebPage")
                .withProperties(webPageAnalysis)
                .do()
                .then((res) => {
                this.logger.info(`Weaviate: Have saved web page ${webPageAnalysis.url}`);
                resolve(res);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    async updateWebPage(id, webPageAnalysis) {
        return new Promise((resolve, reject) => {
            WebPageVectorStore.client.data
                .updater()
                .withId(id)
                .withClassName("WebPage")
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
    async updateWebSolutions(id, webSolutions, quiet = false) {
        return new Promise((resolve, reject) => {
            WebPageVectorStore.client.data
                .merger()
                .withId(id)
                .withClassName("WebPage")
                .withProperties({
                solutionsIdentifiedInTextContext: webSolutions,
            })
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
    async getWebPage(id) {
        return new Promise((resolve, reject) => {
            WebPageVectorStore.client.data
                .getterById()
                .withId(id)
                .withClassName("WebPage")
                .do()
                .then((res) => {
                this.logger.info(`Weaviate: Have got web page ${id}`);
                const webData = res
                    .properties;
                resolve(webData);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    async getWebPagesForProcessing(groupId, subProblemIndex = undefined, entityIndex = undefined, searchType, limit = 10, offset = 0, solutionCountLimit = 0) {
        let where = undefined;
        where = [
            {
                path: ["groupId"],
                operator: "Equal",
                valueInt: groupId,
            },
        ];
        if (subProblemIndex !== undefined && subProblemIndex !== null) {
            where.push({
                path: ["subProblemIndex"],
                operator: "Equal",
                valueInt: subProblemIndex,
            });
        }
        else if (subProblemIndex === null) {
            where.push({
                path: ["subProblemIndex"],
                operator: "IsNull",
                valueBoolean: true,
            });
        }
        if (searchType) {
            where.push({
                path: ["searchType"],
                operator: "Equal",
                valueString: searchType,
            });
        }
        if (entityIndex) {
            where.push({
                path: ["entityIndex"],
                operator: "Equal",
                valueInt: entityIndex,
            });
        }
        else if (entityIndex === null) {
            where.push({
                path: ["entityIndex"],
                operator: "IsNull",
                valueBoolean: true,
            });
        }
        if (solutionCountLimit !== undefined) {
            where.push({
                path: ["len(solutionsIdentifiedInTextContext)"],
                operator: "GreaterThan",
                valueInt: solutionCountLimit,
            });
        }
        let query;
        try {
            query = WebPageVectorStore.client.graphql
                .get()
                .withClassName("WebPage")
                .withLimit(limit)
                .withOffset(offset)
                .withWhere({
                operator: "And",
                operands: where,
            })
                .withFields("searchType groupId entityIndex subProblemIndex summary relevanceToProblem \
      solutionsIdentifiedInTextContext url mostRelevantParagraphs tags entities contacts \
      _additional { distance, id }");
            return await query.do();
        }
        catch (err) {
            throw err;
        }
    }
    async webPageExist(groupId, url, searchType, subProblemIndex, entityIndex) {
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
        if (subProblemIndex !== undefined) {
            where.push({
                path: ["subProblemIndex"],
                operator: "Equal",
                valueInt: subProblemIndex,
            });
        }
        else {
            where.push({
                path: ["subProblemIndex"],
                operator: "IsNull",
                valueBoolean: true,
            });
        }
        if (entityIndex !== undefined) {
            where.push({
                path: ["entityIndex"],
                operator: "Equal",
                valueInt: entityIndex,
            });
        }
        else {
            where.push({
                path: ["entityIndex"],
                operator: "IsNull",
                valueBoolean: true,
            });
        }
        let results;
        try {
            results = await WebPageVectorStore.client.graphql
                .get()
                .withClassName("WebPage")
                .withLimit(20)
                .withWhere({
                operator: "And",
                operands: where,
            })
                .withFields("searchType subProblemIndex summary relevanceToProblem \
          solutionsIdentifiedInTextContext url mostRelevantParagraphs tags entities \
          _additional { distance }")
                .do();
            const resultPages = results.data.Get["WebPage"];
            if (resultPages.length > 0) {
                let allSubProblems = true;
                let allEntities = true;
                resultPages.forEach((page) => {
                    if (page.subProblemIndex === undefined) {
                        allSubProblems = false;
                    }
                    if (page.entityIndex === undefined) {
                        allEntities = false;
                    }
                });
                if (subProblemIndex === undefined) {
                    if (!allSubProblems) {
                        return true;
                    }
                }
                if (entityIndex === undefined && subProblemIndex !== undefined) {
                    if (!allEntities) {
                        return true;
                    }
                }
                if (subProblemIndex !== undefined && entityIndex !== undefined) {
                    return true;
                }
            }
            return false;
        }
        catch (err) {
            throw err;
        }
    }
    async searchWebPages(query, groupId, subProblemIndex, searchType, filterOutEmptySolutions = true) {
        const where = [];
        if (groupId) {
            where.push({
                path: ["groupId"],
                operator: "Equal",
                valueInt: groupId,
            });
        }
        if (subProblemIndex) {
            where.push({
                path: ["subProblemIndex"],
                operator: "Equal",
                valueInt: subProblemIndex,
            });
        }
        if (searchType) {
            where.push({
                path: ["searchType"],
                operator: "Equal",
                valueString: searchType,
            });
        }
        if (filterOutEmptySolutions) {
            where.push({
                path: ["len(solutionsIdentifiedInTextContext)"],
                operator: "GreaterThan",
                valueInt: 0,
            });
        }
        const retryDelays = [5000, 10000, 30000]; // Delays for retry attempts (5s, 10s, 30s)
        let attempt = 0;
        const doSearch = async () => {
            try {
                const results = await WebPageVectorStore.client.graphql
                    .get()
                    .withClassName("WebPage")
                    .withNearText({ concepts: [query] })
                    .withLimit(constants_js_1.IEngineConstants.limits.webPageVectorResultsForNewSolutions)
                    .withWhere({
                    operator: "And",
                    operands: where,
                })
                    .withFields("searchType subProblemIndex entityIndex summary relevanceToProblem \
            solutionsIdentifiedInTextContext url mostRelevantParagraphs \
            _additional { distance }")
                    .do();
                return results;
            }
            catch (err) {
                console.error(err);
                if (attempt < retryDelays.length) {
                    console.log(`Error searching web pages, retrying in ${retryDelays[attempt]}ms`);
                    await new Promise((resolve) => setTimeout(resolve, retryDelays[attempt]));
                    attempt++;
                    return doSearch();
                }
                else {
                    throw err;
                }
            }
        };
        return doSearch();
    }
}
exports.WebPageVectorStore = WebPageVectorStore;
