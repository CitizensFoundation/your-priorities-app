"use strict";

export = (sequelize: any, DataTypes: any) => {
  const EvidenceResearchCandidate = sequelize.define(
    "EvidenceResearchCandidate",
    {
      run_id: { type: DataTypes.INTEGER, allowNull: false },
      source_id: { type: DataTypes.INTEGER, allowNull: true },
      snapshot_id: { type: DataTypes.INTEGER, allowNull: true },
      url: { type: DataTypes.TEXT, allowNull: false },
      url_hash: { type: DataTypes.STRING(128), allowNull: false },
      title: { type: DataTypes.TEXT, allowNull: true },
      query: { type: DataTypes.TEXT, allowNull: true },
      evidence_type: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "general",
      },
      stage: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "searched",
      },
      summary: { type: DataTypes.TEXT, allowNull: true },
      extracted_claims: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      score_relevance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      score_quality: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      score_confidence: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      score_freshness: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      score_diversity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      composite_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      elo_rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1000,
      },
      pairwise_wins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      pairwise_losses: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      selected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      generation: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      parent_candidate_ids: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      mutation_kind: { type: DataTypes.STRING(64), allowNull: true },
      metadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      tableName: "evidence_research_candidates",
      indexes: [
        { fields: ["run_id", "url_hash", "evidence_type"], unique: true },
        { fields: ["run_id", "selected"] },
        { fields: ["run_id", "elo_rating"] },
      ],
    }
  );

  EvidenceResearchCandidate.associate = (models: any) => {
    EvidenceResearchCandidate.belongsTo(models.EvidenceResearchRun, {
      as: "Run",
      foreignKey: "run_id",
    });
    EvidenceResearchCandidate.belongsTo(models.EvidenceSource, {
      as: "Source",
      foreignKey: "source_id",
    });
    EvidenceResearchCandidate.belongsTo(models.EvidenceSnapshot, {
      as: "Snapshot",
      foreignKey: "snapshot_id",
    });
  };

  return EvidenceResearchCandidate;
};
