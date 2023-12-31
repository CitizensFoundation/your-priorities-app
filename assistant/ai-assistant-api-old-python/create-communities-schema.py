import weaviate
import time
client = weaviate.Client("http://localhost:8080")
#client.schema.delete_class("Communities")
schema = {
    "classes": [
        {
            "class": "Communities",
            "description": "An post",
            "vectorizer": "text2vec-openai",
            "moduleConfig": {
                "text2vec-openai": {
                    "model": "ada",
                    "modelVersion": "002",
                    "type": "text"
                }
            },
            "vectorIndexType": "hnsw",
            "properties": [
                {
                    "name": "communityId",
                    "dataType": ["int"],
                    "description": "The id.",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": True,
                                "vectorizePropertyName": False
                            }
                    },
                },
                {
                    "name": "domain_id",
                    "dataType": ["int"],
                    "description": "The domain id.",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": True,
                                "vectorizePropertyName": False
                            }
                    },
                },
                {
                    "name": "cluster_id",
                    "dataType": ["int"],
                    "description": "The cluster id.",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": True,
                                "vectorizePropertyName": False
                            }
                    },
                },
                {
                    "name": "description",
                    "dataType": ["text"],
                    "description": "The text content the post",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": False,
                                "vectorizePropertyName": False
                            }
                    },
                },
                {
                    "name": "name",
                    "dataType": ["text"],
                    "description": "The text name the post",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": False,
                                "vectorizePropertyName": False
                            }
                    },
                },
                {
                    "name": "assistantConfiguration",
                    "dataType": ["text"],
                    "description": "The assistantConfiguration",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": False,
                                "vectorizePropertyName": False
                            }
                    },
                },
                {
                    "name": "imageUrl",
                    "dataType": ["string"],
                    "description": "The image url",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": True,
                                "vectorizePropertyName": False
                            }
                    },
                },
                {
                    "name": "counter_posts",
                    "dataType": ["int"],
                    "description": "The up count",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": True,
                                "vectorizePropertyName": False
                            }
                    },
                },
                {
                    "name": "counter_points_for",
                    "dataType": ["int"],
                    "description": "The up count",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": True,
                                "vectorizePropertyName": False
                            }
                    },
                },
                {
                    "name": "counter_points_against",
                    "dataType": ["int"],
                    "description": "The up count",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": True,
                                "vectorizePropertyName": False
                            }
                    },
                },
                {
                    "name": "language",
                    "dataType": ["string"],
                    "description": "The up count",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": True,
                                "vectorizePropertyName": False
                            }
                    },
                },
                                {
                    "name": "created_at",
                    "dataType": ["date"],
                    "description": "When Created",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": True,
                                "vectorizePropertyName": False
                            }
                    },
                },
                                                {
                    "name": "updated_at",
                    "dataType": ["date"],
                    "description": "When updated",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": True,
                                "vectorizePropertyName": False
                            }
                    },
                },
                {
                    "name": "userId",
                    "dataType": ["int"],
                    "description": "The user number.",
                    "moduleConfig": {
                            "text2vec-openai": {
                                "skip": True,
                                "vectorizePropertyName": False
                            }
                    },
                },
            ]
        }
    ]
}

client.schema.create(schema)
