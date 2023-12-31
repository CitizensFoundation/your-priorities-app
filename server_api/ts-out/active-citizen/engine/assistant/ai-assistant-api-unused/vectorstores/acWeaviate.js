"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcWeaviate = void 0;
const document_js_1 = require("./document.js");
const weaviate_js_1 = require("./weaviate.js");
class AcWeaviate extends weaviate_js_1.Weaviate {
    similarity_search_concepts(concepts, group_name, cluster_id, community_id, allowFilteringByGroups = true, k = 4, ...kwargs) {
        const content = { concepts };
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
        const query_obj = this._client.query.get(this._index_name, this._query_attrs);
        let result;
        if (where_filter) {
            result = query_obj
                .with_near_text(content)
                .with_limit(k)
                .with_where(where_filter)
                .do();
        }
        else {
            result = query_obj.with_near_text(content).with_limit(k).do();
        }
        const docs = [];
        console.log(result);
        for (const res of result["data"]["Get"][this._index_name]) {
            const text = res[this._text_key];
            delete res[this._text_key];
            docs.push(new document_js_1.Document(text, res));
        }
        return docs;
    }
}
exports.AcWeaviate = AcWeaviate;
