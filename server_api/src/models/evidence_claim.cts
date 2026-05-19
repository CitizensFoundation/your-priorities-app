"use strict";

export = (sequelize: any, DataTypes: any) => {
  const EvidenceClaim = sequelize.define(
    "EvidenceClaim",
    {
      bundle_id: { type: DataTypes.INTEGER, allowNull: false },
      claim_text: { type: DataTypes.TEXT, allowNull: false },
      stance: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "contextualizes",
      },
      confidence: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.5,
      },
      source_refs: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      tableName: "evidence_claims",
      indexes: [{ fields: ["bundle_id"] }],
    }
  );

  EvidenceClaim.associate = (models: any) => {
    EvidenceClaim.belongsTo(models.EvidenceBundle, {
      as: "Bundle",
      foreignKey: "bundle_id",
    });
  };

  return EvidenceClaim;
};
