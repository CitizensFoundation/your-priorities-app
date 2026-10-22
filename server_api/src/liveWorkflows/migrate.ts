import { DataTypes, type Sequelize } from "sequelize";

/** Explicit deployment migration; never uses sync/alter at API startup. */
export async function migrateLiveWorkflows(
  sequelize: Sequelize,
): Promise<void> {
  await sequelize.transaction(async (transaction) => {
    await sequelize.query("SELECT pg_advisory_xact_lock(1937410281)", {
      transaction,
    });
    const q = sequelize.getQueryInterface();
    const tables = await q.showAllTables({ transaction });
    if (tables.includes("yp_live_workflow_workspaces")) return;
    await q.createTable(
      "yp_live_workflow_workspaces",
      {
        groupId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: { model: "groups", key: "id" },
        },
        data: { type: DataTypes.JSONB, allowNull: false },
      },
      { transaction },
    );
    await q.createTable(
      "yp_live_workflow_documents",
      {
        groupId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: { model: "yp_live_workflow_workspaces", key: "groupId" },
        },
        kind: { type: DataTypes.STRING(64), primaryKey: true },
        id: { type: DataTypes.STRING(160), primaryKey: true },
        data: { type: DataTypes.JSONB, allowNull: false },
      },
      { transaction },
    );
    await q.createTable(
      "yp_live_workflow_events",
      {
        groupId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: { model: "yp_live_workflow_workspaces", key: "groupId" },
        },
        seq: { type: DataTypes.BIGINT, primaryKey: true },
        key: { type: DataTypes.STRING(240), allowNull: false },
        data: { type: DataTypes.JSONB, allowNull: false },
      },
      { transaction },
    );
    await q.addIndex("yp_live_workflow_events", ["groupId", "key"], {
      unique: true,
      transaction,
    });
  });
}
