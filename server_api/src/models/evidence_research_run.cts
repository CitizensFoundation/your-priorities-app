"use strict";

export = (sequelize: any, DataTypes: any) => {
  const EvidenceResearchRun = sequelize.define(
    "EvidenceResearchRun",
    {
      bundle_id: { type: DataTypes.INTEGER, allowNull: false },
      group_id: { type: DataTypes.INTEGER, allowNull: true },
      status: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "queued",
      },
      phase: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "queued",
      },
      config: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
      metrics: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
      started_at: { type: DataTypes.DATE, allowNull: true },
      finished_at: { type: DataTypes.DATE, allowNull: true },
      requested_by_user_id: { type: DataTypes.INTEGER, allowNull: true },
      metadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      tableName: "evidence_research_runs",
      indexes: [
        { fields: ["bundle_id"] },
        { fields: ["group_id", "status"] },
      ],
    }
  );

  EvidenceResearchRun.associate = (models: any) => {
    EvidenceResearchRun.belongsTo(models.EvidenceBundle, {
      as: "Bundle",
      foreignKey: "bundle_id",
    });
    EvidenceResearchRun.belongsTo(models.Group, { foreignKey: "group_id" });
    EvidenceResearchRun.belongsTo(models.User, {
      as: "RequestedBy",
      foreignKey: "requested_by_user_id",
    });
    EvidenceResearchRun.hasMany(models.EvidenceResearchQuery, {
      as: "Queries",
      foreignKey: "run_id",
    });
    EvidenceResearchRun.hasMany(models.EvidenceResearchCandidate, {
      as: "Candidates",
      foreignKey: "run_id",
    });
    EvidenceResearchRun.hasMany(models.EvidenceResearchComparison, {
      as: "Comparisons",
      foreignKey: "run_id",
    });
  };

  return EvidenceResearchRun;
};
