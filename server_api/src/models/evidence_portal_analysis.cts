"use strict";

export = (sequelize: any, DataTypes: any) => {
  const EvidencePortalAnalysis = sequelize.define(
    "EvidencePortalAnalysis",
    {
      group_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.TEXT, allowNull: true },
      short_analysis: { type: DataTypes.TEXT, allowNull: true },
      theme_summaries: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      source_refs: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      bundle_refs: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      connected_debate: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      status: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "draft",
      },
      language: { type: DataTypes.STRING(16), allowNull: true },
      model_metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      tableName: "evidence_portal_analyses",
      indexes: [{ fields: ["group_id", "status"] }],
    }
  );

  EvidencePortalAnalysis.associate = (models: any) => {
    EvidencePortalAnalysis.belongsTo(models.Group, {
      foreignKey: "group_id",
    });
  };

  return EvidencePortalAnalysis;
};
