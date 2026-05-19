"use strict";

export = (sequelize: any, DataTypes: any) => {
  const EvidenceSource = sequelize.define(
    "EvidenceSource",
    {
      canonical_url: { type: DataTypes.TEXT, allowNull: false },
      source_type: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "web_page",
      },
      publisher: { type: DataTypes.STRING(256), allowNull: true },
      title: { type: DataTypes.TEXT, allowNull: true },
      license: { type: DataTypes.STRING(256), allowNull: true },
      trust_tier: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "standard",
      },
      language: { type: DataTypes.STRING(16), allowNull: true },
      freshness_policy: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "monthly",
      },
      last_checked_at: { type: DataTypes.DATE, allowNull: true },
      last_modified_on_server: { type: DataTypes.TEXT, allowNull: true },
      content_hash: { type: DataTypes.STRING(128), allowNull: true },
      image_url: { type: DataTypes.TEXT, allowNull: true },
      current_snapshot_id: { type: DataTypes.INTEGER, allowNull: true },
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
      tableName: "evidence_sources",
      indexes: [
        { fields: ["canonical_url"], unique: true },
        { fields: ["source_type"] },
      ],
    }
  );

  EvidenceSource.associate = (models: any) => {
    EvidenceSource.hasMany(models.EvidenceSnapshot, {
      as: "Snapshots",
      foreignKey: "source_id",
    });
    EvidenceSource.belongsTo(models.EvidenceSnapshot, {
      as: "CurrentSnapshot",
      foreignKey: "current_snapshot_id",
    });
    EvidenceSource.hasMany(models.EvidenceBundleSource, {
      as: "BundleSources",
      foreignKey: "source_id",
    });
  };

  return EvidenceSource;
};
