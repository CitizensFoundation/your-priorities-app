"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const weaviate = __importStar(require("weaviate"));
const client = new weaviate.Client("http://localhost:8080");
const schema = {
    classes: [
        {
            class: "Communities",
            description: "An post",
            vectorizer: "text2vec-openai",
            moduleConfig: {
                "text2vec-openai": {
                    model: "ada",
                    modelVersion: "002",
                    type: "text"
                }
            },
            vectorIndexType: "hnsw",
            properties: [
                {
                    name: "communityId",
                    dataType: ["int"],
                    description: "The id.",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "domain_id",
                    dataType: ["int"],
                    description: "The domain id.",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "cluster_id",
                    dataType: ["int"],
                    description: "The cluster id.",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "description",
                    dataType: ["text"],
                    description: "The text content the post",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "name",
                    dataType: ["text"],
                    description: "The text name the post",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "assistantConfiguration",
                    dataType: ["text"],
                    description: "The assistantConfiguration",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "imageUrl",
                    dataType: ["string"],
                    description: "The image url",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "counter_posts",
                    dataType: ["int"],
                    description: "The up count",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "counter_points_for",
                    dataType: ["int"],
                    description: "The up count",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "counter_points_against",
                    dataType: ["int"],
                    description: "The up count",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "language",
                    dataType: ["string"],
                    description: "The up count",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "created_at",
                    dataType: ["date"],
                    description: "When Created",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "updated_at",
                    dataType: ["date"],
                    description: "When updated",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    },
                },
                {
                    name: "userId",
                    dataType: ["int"],
                    description: "The user number.",
                    moduleConfig: {
                        "text2vec-openai": {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    },
                },
            ]
        }
    ]
};
client.schema.create(schema);
