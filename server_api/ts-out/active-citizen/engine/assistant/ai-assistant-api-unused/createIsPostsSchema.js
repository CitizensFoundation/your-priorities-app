"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weaviate_1 = require("weaviate");
const client = new weaviate_1.Client('http://localhost:8080');
const schema = {
    classes: [
        {
            class: 'PostsIs',
            description: 'An post',
            vectorizer: 'text2vec-cohere',
            vectorIndexConfig: {
                distance: 'dot'
            },
            moduleConfig: {
                'text2vec-cohere': {
                    model: 'multilingual-22-12',
                    truncate: 'RIGHT'
                }
            },
            properties: [
                {
                    name: 'postId',
                    dataType: ['int'],
                    description: 'The id.',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'group_id',
                    dataType: ['int'],
                    description: 'The group id.',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'community_id',
                    dataType: ['int'],
                    description: 'The community id.',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'domain_id',
                    dataType: ['int'],
                    description: 'The domain id.',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'cluster_id',
                    dataType: ['int'],
                    description: 'The cluster id.',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'content',
                    dataType: ['text'],
                    description: 'The text content the post',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'group_name',
                    dataType: ['text'],
                    description: 'The group name',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'name',
                    dataType: ['text'],
                    description: 'The text name the post',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'emojiSummary',
                    dataType: ['text'],
                    description: 'The emojiSummary',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'oneWordSummary',
                    dataType: ['text'],
                    description: 'The oneWordSummary',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'shortName',
                    dataType: ['text'],
                    description: 'The text name the post',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'shortSummary',
                    dataType: ['text'],
                    description: 'Short summary of the post',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'fullSummary',
                    dataType: ['text'],
                    description: 'Full summary of the post',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'shortSummaryWithPoints',
                    dataType: ['text'],
                    description: 'Short summary of the post',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'fullSummaryWithPoints',
                    dataType: ['text'],
                    description: 'Full summary of the post',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'userName',
                    dataType: ['string'],
                    description: 'The name of the user who posted the post',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: false,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'imageUrl',
                    dataType: ['string'],
                    description: 'The image url',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'counter_endorsements_up',
                    dataType: ['int'],
                    description: 'The up count',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'counter_endorsements_down',
                    dataType: ['int'],
                    description: 'The up count',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'counter_points_for',
                    dataType: ['int'],
                    description: 'The up count',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'counter_points_against',
                    dataType: ['int'],
                    description: 'The down count',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'language',
                    dataType: ['string'],
                    description: 'The up count',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'created_at',
                    dataType: ['date'],
                    description: 'When Created',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'updated_at',
                    dataType: ['date'],
                    description: 'When updated',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                },
                {
                    name: 'userId',
                    dataType: ['int'],
                    description: 'The user number.',
                    moduleConfig: {
                        'text2vec-cohere': {
                            skip: true,
                            vectorizePropertyName: false
                        }
                    }
                }
            ]
        }
    ]
};
client.schema.create(schema);
