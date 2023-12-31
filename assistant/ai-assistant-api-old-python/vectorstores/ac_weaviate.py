"""Wrapper around weaviate vector database."""
from __future__ import annotations

from typing import Any, Dict, Iterable, List, Optional
from uuid import uuid4

from langchain.docstore.document import Document
from langchain.embeddings.base import Embeddings
from langchain.vectorstores.base import VectorStore
from langchain.vectorstores.weaviate import Weaviate


class AcWeaviate(Weaviate):
    def similarity_search_concepts(
        self,
        concepts: Any,
        group_name: Any,
        cluster_id: Any,
        community_id: Any,
        allowFilteringByGroups: bool = True,
        k: int = 4,
        **kwargs: Any
    ) -> List[Document]:
        """Look up similar documents in weaviate."""
        content: Dict[str, Any] = {"concepts": concepts}

        if kwargs.get("search_distance"):
            content["certainty"] = kwargs.get("search_distance")

        where_filter = {
            "operator": "And",
            "operands": [
                {
                    "path": ["cluster_id"],
                    "operator": "Equal",
                    "valueInt": cluster_id
                },
                {
                    "path": ["community_id"],
                     "operator": "Equal",
                    "valueInt": community_id
                }
            ]
        }

        print(f"allowFilteringByGroups: {allowFilteringByGroups}")

        if group_name != None and allowFilteringByGroups:
            where_filter["operands"].append({
                "path": ["group_name"],
                "operator": "Equal",
                "valueText": group_name,
            })

        print(f"1010101010101010 - {where_filter}")

        query_obj = self._client.query.get(self._index_name, self._query_attrs)
        if where_filter:
            result = query_obj.with_near_text(content).with_limit(
                k).with_where(where_filter).do()
        else:
            result = query_obj.with_near_text(content).with_limit(k).do()
        docs = []
        print(result)

        # If using concepts and no results try without certainty

        for res in result["data"]["Get"][self._index_name]:
            text = res.pop(self._text_key)
            docs.append(Document(page_content=text, metadata=res))
        return docs
