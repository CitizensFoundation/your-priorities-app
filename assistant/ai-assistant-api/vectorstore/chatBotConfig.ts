import weaviate from "weaviate-ts-client";
import { WeaviateClient } from "weaviate-ts-client";
import { Base } from "../../base.js";

import { IEngineConstants } from "../../constants.js";
import fs from "fs/promises";

export class ChatBotConfigVectorStore extends Base {
  //@ts-ignore
  static client: WeaviateClient = weaviate.client({
    scheme: process.env.WEAVIATE_HTTP_SCHEME || "http",
    host: process.env.WEAVIATE_HOST || "localhost:8080",
  });

  async addSchema() {
    let classObj;
    try {
      const data = await fs.readFile("./schemas/chatBotConfig.json", "utf8");
      classObj = JSON.parse(data);
    } catch (err) {
      console.error(`Error reading file from disk: ${err}`);
      return;
    }

    try {
      const res = await ChatBotConfigVectorStore.client.schema
        .classCreator()
        .withClass(classObj)
        .do();
      console.log(res);
    } catch (err) {
      console.error(`Error creating schema: ${err}`);
    }
  }

  async showScheme() {
    try {
      const res = await ChatBotConfigVectorStore.client.schema.getter().do();
      console.log(JSON.stringify(res, null, 2));
    } catch (err) {
      console.error(`Error creating schema: ${err}`);
    }
  }

  async deleteScheme() {
    try {
      const res = await ChatBotConfigVectorStore.client.schema
        .classDeleter()
        .withClassName("WebPage")
        .do();
      console.log(res);
    } catch (err) {
      console.error(`Error creating schema: ${err}`);
    }
  }

  async testQuery() {
    const where: any[] = [];
    where.push({
      path: ["len(solutionsIdentifiedInTextContext)"],
      operator: "GreaterThan",
      valueInt: 0,
    });

    const res = await ChatBotConfigVectorStore.client.graphql
      .get()
      .withClassName("WebPage")
      .withWhere({
        operator: "And",
        operands: where,
      })
      .withFields(
        "summary groupId entityIndex subProblemIndex relevanceToProblem \
        solutionsIdentifiedInTextContext mostRelevantParagraphs contacts tags entities \
        _additional { distance }"
      )
      .withNearText({ concepts: ["democracy"] })
      .withLimit(100)
      .do();

    console.log(JSON.stringify(res, null, 2));
    return res;
  }

  async postWebPage(webPageAnalysis: IEngineWebPageAnalysisData) {
    return new Promise((resolve, reject) => {
      ChatBotConfigVectorStore.client.data
        .creator()
        .withClassName("WebPage")
        .withProperties(webPageAnalysis as any)
        .do()
        .then((res) => {
          this.logger.info(
            `Weaviate: Have saved web page ${(webPageAnalysis as any).url}`
          );
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async updateWebPage(id: string, webPageAnalysis: IEngineWebPageAnalysisData) {
    return new Promise((resolve, reject) => {
      ChatBotConfigVectorStore.client.data
        .updater()
        .withId(id)
        .withClassName("WebPage")
        .withProperties(webPageAnalysis as any)
        .do()
        .then((res) => {
          this.logger.info(
            `Weaviate: Have updated web page ${(webPageAnalysis as any).url}`
          );
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async updateWebSolutions(id: string, webSolutions: string[],
    quiet = false) {
    return new Promise((resolve, reject) => {
      ChatBotConfigVectorStore.client.data
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

  async getWebPage(id: string): Promise<IEngineWebPageAnalysisData> {
    return new Promise((resolve, reject) => {
      ChatBotConfigVectorStore.client.data
        .getterById()
        .withId(id)
        .withClassName("WebPage")
        .do()
        .then((res) => {
          this.logger.info(`Weaviate: Have got web page ${id}`);
          const webData = (res as IEngineWebPageGraphQlSingleResult)
            .properties as IEngineWebPageAnalysisData;
          resolve(webData);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getWebPagesForProcessing(
    groupId: number,
    subProblemIndex: number | undefined | null = undefined,
    entityIndex: number | undefined | null = undefined,
    searchType: IEngineSearchQueries | undefined,
    limit = 10,
    offset = 0,
    solutionCountLimit: number | undefined = 0
  ): Promise<IEngineWebPageGraphQlResults> {
    let where: any[] | undefined = undefined;
    where = [
      {
        path: ["groupId"],
        operator: "Equal",
        valueInt: groupId,
      },
    ];

    if (subProblemIndex!==undefined && subProblemIndex!==null) {
      where.push({
        path: ["subProblemIndex"],
        operator: "Equal",
        valueInt: subProblemIndex,
      });
    } else if (subProblemIndex === null) {
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
    } else if (entityIndex === null) {
      where.push({
        path: ["entityIndex"],
        operator: "IsNull",
        valueBoolean: true,
      });
    }

    if (solutionCountLimit!==undefined) {
      where.push({
        path: ["len(solutionsIdentifiedInTextContext)"],
        operator: "GreaterThan",
        valueInt: solutionCountLimit,
      });
    }

    let query;

    try {
      query = ChatBotConfigVectorStore.client.graphql
      .get()
      .withClassName("WebPage")
      .withLimit(limit)
      .withOffset(offset)
      .withWhere({
        operator: "And",
        operands: where,
      })
      .withFields(
        "searchType groupId entityIndex subProblemIndex summary relevanceToProblem \
      solutionsIdentifiedInTextContext url mostRelevantParagraphs tags entities contacts \
      _additional { distance, id }"
      );

      return await query.do();
    } catch (err) {
      throw err;
    }
  }

  async webPageExist(
    groupId: number,
    url: string,
    searchType: IEngineWebPageTypes,
    subProblemIndex: number | undefined,
    entityIndex: number | undefined
  ): Promise<Boolean> {
    //TODO: Fix any here
    const where: any[] = [];

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
    } else {
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
    } else {
      where.push({
        path: ["entityIndex"],
        operator: "IsNull",
        valueBoolean: true,
      });
    }

    let results;

    try {
      results = await ChatBotConfigVectorStore.client.graphql
        .get()
        .withClassName("WebPage")
        .withLimit(20)
        .withWhere({
          operator: "And",
          operands: where,
        })
        .withFields(
          "searchType subProblemIndex summary relevanceToProblem \
          solutionsIdentifiedInTextContext url mostRelevantParagraphs tags entities \
          _additional { distance }"
        )
        .do();

      const resultPages = results.data.Get[
        "WebPage"
      ] as IEngineWebPageAnalysisData[];

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
    } catch (err) {
      throw err;
    }
  }

  async searchWebPages(
    query: string,
    groupId: number | undefined,
    subProblemIndex: number | undefined,
    searchType: IEngineWebPageTypes | undefined,
    filterOutEmptySolutions = true
  ): Promise<IEngineWebPageGraphQlResults> {
    //TODO: Fix any here
    const where: any[] = [];

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

    let results;

    try {
      results = await ChatBotConfigVectorStore.client.graphql
        .get()
        .withClassName("WebPage")
        .withNearText({ concepts: [query] })
        .withLimit(IEngineConstants.limits.webPageVectorResultsForNewSolutions)
        .withWhere({
          operator: "And",
          operands: where,
        })
        .withFields(
          "searchType subProblemIndex summary relevanceToProblem \
          solutionsIdentifiedInTextContext url mostRelevantParagraphs tags entities \
          _additional { distance }"
        )
        .do();
    } catch (err) {
      throw err;
    }

    return results as IEngineWebPageGraphQlResults;
  }
}
