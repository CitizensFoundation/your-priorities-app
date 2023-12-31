import { createEmbedding } from "../openai/embeddings.js";
import pgvector from "pgvector/utils";
import sequelize, { Sequelize } from "sequelize";

import { DataTypes, Model } from "sequelize";

class Website extends Model {
  public id!: number;
  public name!: string;
  public slug!: string;
  public description!: string;
  public image!: string;
  public embedding!: number[];
  public createdAt!: Date;
  public updatedAt!: Date;

  public static async getSimilar(
    searchTerm: string,
    skip: number = 0,
    limit: number = 9999
  ) {
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

  public static initModel(): void {
    Website.init(
      {
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
      },
      {
        //@ts-ignore
        sequelize,
        tableName: "websites",
        timestamps: true,
        paranoid: true,
        underscored: true,
      }
    );
  }
}

Website.initModel();

Website.addHook("beforeCreate", async (website: Website) => {
  const input = website.name + "\n" + "\n" + website.description;
  const embedding = await createEmbedding(input);
  website.embedding = embedding.embeddings;
  //TODO: add costs
});

Website.addHook("beforeUpdate", async (website: Website) => {
  const input = website.name + "\n" + "\n" + website.description;
  const embedding = await createEmbedding(input);
  website.embedding = embedding.embeddings;
  //TODO: add costs
});

export default Website;
