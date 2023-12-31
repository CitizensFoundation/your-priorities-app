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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const embeddings_js_1 = require("../openai/embeddings.js");
const utils_1 = __importDefault(require("pgvector/utils"));
const sequelize_1 = __importStar(require("sequelize"));
const sequelize_2 = require("sequelize");
class Website extends sequelize_2.Model {
    id;
    name;
    slug;
    description;
    image;
    embedding;
    createdAt;
    updatedAt;
    static async getSimilar(searchTerm, skip = 0, limit = 9999) {
        const embedding = await (0, embeddings_js_1.createEmbedding)(searchTerm);
        const embSql = utils_1.default.toSql(embedding);
        const results = await Website.findAll({
            order: [sequelize_1.Sequelize.literal(`"embedding" <-> '${embSql}'`)],
            offset: skip,
            limit: limit,
            attributes: {
                exclude: ["embedding"],
            },
        });
        return results;
    }
    static initModel() {
        Website.init({
            id: {
                type: sequelize_2.DataTypes.UUID,
                defaultValue: sequelize_2.DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: sequelize_2.DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: sequelize_2.DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: sequelize_2.DataTypes.TEXT,
                allowNull: false,
            },
            image: {
                type: sequelize_2.DataTypes.TEXT,
                allowNull: false,
            },
            embedding: {
                // @ts-ignore
                type: sequelize_2.DataTypes.VECTOR(1536),
                allowNull: true,
                defaultValue: null,
            },
        }, {
            //@ts-ignore
            sequelize: sequelize_1.default,
            tableName: "websites",
            timestamps: true,
            paranoid: true,
            underscored: true,
        });
    }
}
Website.initModel();
Website.addHook("beforeCreate", async (website) => {
    const input = website.name + "\n" + "\n" + website.description;
    const embedding = await (0, embeddings_js_1.createEmbedding)(input);
    website.embedding = embedding.embeddings;
    //TODO: add costs
});
Website.addHook("beforeUpdate", async (website) => {
    const input = website.name + "\n" + "\n" + website.description;
    const embedding = await (0, embeddings_js_1.createEmbedding)(input);
    website.embedding = embedding.embeddings;
    //TODO: add costs
});
exports.default = Website;
