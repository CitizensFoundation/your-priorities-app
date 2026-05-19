"use strict";

export = (sequelize: any, DataTypes: any) => {
  const EvidenceResearchQuery = sequelize.define(
    "EvidenceResearchQuery",
    {
      run_id: { type: DataTypes.INTEGER, allowNull: false },
      query: { type: DataTypes.TEXT, allowNull: false },
      evidence_type: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "general",
      },
      generation: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      priority: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.5,
      },
      status: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "queued",
      },
      result_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      metadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      tableName: "evidence_research_queries",
      indexes: [
        { fields: ["run_id"] },
        { fields: ["run_id", "query", "evidence_type", "generation"], unique: true },
      ],
    }
  );

  EvidenceResearchQuery.associate = (models: any) => {
    EvidenceResearchQuery.belongsTo(models.EvidenceResearchRun, {
      as: "Run",
      foreignKey: "run_id",
    });
  };

  return EvidenceResearchQuery;
};
