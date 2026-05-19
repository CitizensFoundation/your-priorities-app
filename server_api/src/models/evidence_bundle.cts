"use strict";

export = (sequelize: any, DataTypes: any) => {
  const EvidenceBundle = sequelize.define(
    "EvidenceBundle",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      subject_type: { type: DataTypes.STRING(32), allowNull: false },
      subject_id: { type: DataTypes.INTEGER, allowNull: false },
      group_id: { type: DataTypes.INTEGER, allowNull: true },
      post_id: { type: DataTypes.INTEGER, allowNull: true },
      point_id: { type: DataTypes.INTEGER, allowNull: true },
      question_or_claim: { type: DataTypes.TEXT, allowNull: false },
      short_analysis: { type: DataTypes.TEXT, allowNull: true },
      key_findings: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      uncertainties: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      missing_data: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      source_highlights: {
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
        defaultValue: "queued",
      },
      language: { type: DataTypes.STRING(16), allowNull: true },
      agent_product_run_id: { type: DataTypes.INTEGER, allowNull: true },
      reviewed_by_user_id: { type: DataTypes.INTEGER, allowNull: true },
      published_at: { type: DataTypes.DATE, allowNull: true },
      expires_at: { type: DataTypes.DATE, allowNull: true },
      metadata: {
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
      tableName: "evidence_bundles",
      indexes: [
        { fields: ["uuid"], unique: true },
        { fields: ["subject_type", "subject_id", "status"] },
        { fields: ["group_id", "status"] },
      ],
    }
  );

  EvidenceBundle.associate = (models: any) => {
    EvidenceBundle.belongsTo(models.Group, { foreignKey: "group_id" });
    EvidenceBundle.belongsTo(models.Post, { foreignKey: "post_id" });
    EvidenceBundle.belongsTo(models.Point, { foreignKey: "point_id" });
    EvidenceBundle.belongsTo(models.User, {
      as: "Reviewer",
      foreignKey: "reviewed_by_user_id",
    });
    EvidenceBundle.hasMany(models.EvidenceBundleSource, {
      as: "BundleSources",
      foreignKey: "bundle_id",
    });
    EvidenceBundle.hasMany(models.EvidenceClaim, {
      as: "Claims",
      foreignKey: "bundle_id",
    });
    EvidenceBundle.hasMany(models.EvidenceResearchRun, {
      as: "ResearchRuns",
      foreignKey: "bundle_id",
    });
  };

  return EvidenceBundle;
};
