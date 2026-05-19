"use strict";

export = (sequelize: any, DataTypes: any) => {
  const EvidenceBundleSource = sequelize.define(
    "EvidenceBundleSource",
    {
      bundle_id: { type: DataTypes.INTEGER, allowNull: false },
      source_id: { type: DataTypes.INTEGER, allowNull: false },
      snapshot_id: { type: DataTypes.INTEGER, allowNull: false },
      relevance_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      citation_label: { type: DataTypes.STRING(64), allowNull: false },
      quoted_ranges: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      source_role: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "context",
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      tableName: "evidence_bundle_sources",
      indexes: [
        { fields: ["bundle_id"] },
        { fields: ["bundle_id", "snapshot_id"], unique: true },
      ],
    }
  );

  EvidenceBundleSource.associate = (models: any) => {
    EvidenceBundleSource.belongsTo(models.EvidenceBundle, {
      as: "Bundle",
      foreignKey: "bundle_id",
    });
    EvidenceBundleSource.belongsTo(models.EvidenceSource, {
      as: "Source",
      foreignKey: "source_id",
    });
    EvidenceBundleSource.belongsTo(models.EvidenceSnapshot, {
      as: "Snapshot",
      foreignKey: "snapshot_id",
    });
  };

  return EvidenceBundleSource;
};
