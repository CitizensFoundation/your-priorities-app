import { Document } from "./document.js";
import { Embeddings } from "./embeddings.js";
import { VectorStore } from "./vectorstore.js";
import { Weaviate } from "./weaviate.js";

export class AcWeaviate extends Weaviate {
  public similarity_search_concepts(
    concepts: any,
    group_name: any,
    cluster_id: any,
    community_id: any,
    allowFilteringByGroups: boolean = true,
    k: number = 4,
    ...kwargs: any[]
  ): Document[] {
    const content: { [key: string]: any } = { concepts };

    if (kwargs.includes("search_distance")) {
      content["certainty"] = kwargs["search_distance"];
    }

    const where_filter = {
      operator: "And",
      operands: [
        {
          path: ["cluster_id"],
          operator: "Equal",
          valueInt: cluster_id,
        },
        {
          path: ["community_id"],
          operator: "Equal",
          valueInt: community_id,
        },
      ],
    };

    console.log(`allowFilteringByGroups: ${allowFilteringByGroups}`);

    if (group_name !== null && allowFilteringByGroups) {
      where_filter["operands"].push({
        path: ["group_name"],
        operator: "Equal",
        valueText: group_name,
      });
    }

    console.log(`1010101010101010 - ${where_filter}`);

    const query_obj = this._client.query.get(
      this._index_name,
      this._query_attrs
    );
    let result;

    if (where_filter) {
      result = query_obj
        .with_near_text(content)
        .with_limit(k)
        .with_where(where_filter)
        .do();
    } else {
      result = query_obj.with_near_text(content).with_limit(k).do();
    }

    const docs: Document[] = [];
    console.log(result);

    for (const res of result["data"]["Get"][this._index_name]) {
      const text = res[this._text_key];
      delete res[this._text_key];
      docs.push(new Document(text, res));
    }

    return docs;
  }
}