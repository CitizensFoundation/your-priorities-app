"use strict";

export = (sequelize: any, DataTypes: any) => {
  const EvidenceResearchComparison = sequelize.define(
    "EvidenceResearchComparison",
    {
      run_id: { type: DataTypes.INTEGER, allowNull: false },
      candidate_a_id: { type: DataTypes.INTEGER, allowNull: false },
      candidate_b_id: { type: DataTypes.INTEGER, allowNull: false },
      winner_candidate_id: { type: DataTypes.INTEGER, allowNull: true },
      rationale: { type: DataTypes.TEXT, allowNull: true },
      metadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      tableName: "evidence_research_comparisons",
      indexes: [{ fields: ["run_id"] }],
    }
  );

  EvidenceResearchComparison.associate = (models: any) => {
    EvidenceResearchComparison.belongsTo(models.EvidenceResearchRun, {
      as: "Run",
      foreignKey: "run_id",
    });
    EvidenceResearchComparison.belongsTo(models.EvidenceResearchCandidate, {
      as: "CandidateA",
      foreignKey: "candidate_a_id",
    });
    EvidenceResearchComparison.belongsTo(models.EvidenceResearchCandidate, {
      as: "CandidateB",
      foreignKey: "candidate_b_id",
    });
    EvidenceResearchComparison.belongsTo(models.EvidenceResearchCandidate, {
      as: "Winner",
      foreignKey: "winner_candidate_id",
    });
  };

  return EvidenceResearchComparison;
};
