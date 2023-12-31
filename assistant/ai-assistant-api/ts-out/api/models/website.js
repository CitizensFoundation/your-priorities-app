import { createEmbedding } from "../openai/embeddings.js";
import pgvector from "pgvector/utils";
import sequelize, { Sequelize } from "sequelize";
import { DataTypes, Model } from "sequelize";
class Website extends Model {
    id;
    name;
    slug;
    description;
    image;
    embedding;
    createdAt;
    updatedAt;
    static async getSimilar(searchTerm, skip = 0, limit = 9999) {
        const embedding = await createEmbedding(searchTerm);
        const embSql = pgvector.toSql(embedding);
        const results = await Website.findAll({
            order: [Sequelize.literal(`"embedding" <-> '${embSql}'`)],
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
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            image: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            embedding: {
                // @ts-ignore
                type: DataTypes.VECTOR(1536),
                allowNull: true,
                defaultValue: null,
            },
        }, {
            //@ts-ignore
            sequelize,
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
    const embedding = await createEmbedding(input);
    website.embedding = embedding.embeddings;
    //TODO: add costs
});
Website.addHook("beforeUpdate", async (website) => {
    const input = website.name + "\n" + "\n" + website.description;
    const embedding = await createEmbedding(input);
    website.embedding = embedding.embeddings;
    //TODO: add costs
});
export default Website;
