"use strict";

export = (sequelize: any, DataTypes: any) => {
  const EvidenceSnapshot = sequelize.define(
    "EvidenceSnapshot",
    {
      source_id: { type: DataTypes.INTEGER, allowNull: false },
      snapshot_hash: { type: DataTypes.STRING(128), allowNull: false },
      fetched_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      fetch_method: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "fetch",
      },
      status: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "ok",
      },
      error_message: { type: DataTypes.TEXT, allowNull: true },
      raw_html: { type: DataTypes.TEXT, allowNull: true },
      markdown: { type: DataTypes.TEXT, allowNull: true },
      extracted_text: { type: DataTypes.TEXT, allowNull: true },
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
      tableName: "evidence_snapshots",
      indexes: [
        { fields: ["source_id"] },
        { fields: ["source_id", "snapshot_hash"], unique: true },
      ],
    }
  );

  EvidenceSnapshot.associate = (models: any) => {
    EvidenceSnapshot.belongsTo(models.EvidenceSource, {
      as: "Source",
      foreignKey: "source_id",
    });
    EvidenceSnapshot.hasMany(models.EvidenceBundleSource, {
      as: "BundleSources",
      foreignKey: "snapshot_id",
    });
  };

  return EvidenceSnapshot;
};
