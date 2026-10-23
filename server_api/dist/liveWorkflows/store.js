import { DataTypes, Op, } from "sequelize";
import { ConflictError, NotFoundError } from "./services/errors.js";
/** One locked workspace row serializes leases, run transitions, and all money reservations.
 * The lock and ledger writes share the same Postgres transaction, across API processes. */
export class SequelizeWorkflowStore {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.Workspace = sequelize.define("YpLiveWorkflowWorkspace", {
            groupId: { type: DataTypes.INTEGER, primaryKey: true },
            data: { type: DataTypes.JSONB, allowNull: false },
        }, { tableName: "yp_live_workflow_workspaces", timestamps: false });
        this.Document = sequelize.define("YpLiveWorkflowDocument", {
            groupId: { type: DataTypes.INTEGER, primaryKey: true },
            kind: { type: DataTypes.STRING(64), primaryKey: true },
            id: { type: DataTypes.STRING(160), primaryKey: true },
            data: { type: DataTypes.JSONB, allowNull: false },
        }, { tableName: "yp_live_workflow_documents", timestamps: false });
        this.Event = sequelize.define("YpLiveWorkflowEvent", {
            groupId: { type: DataTypes.INTEGER, primaryKey: true },
            seq: { type: DataTypes.BIGINT, primaryKey: true },
            key: { type: DataTypes.STRING(240), allowNull: false },
            data: { type: DataTypes.JSONB, allowNull: false },
        }, { tableName: "yp_live_workflow_events", timestamps: false });
    }
    async create(state) {
        const [, created] = await this.Workspace.findOrCreate({
            where: { groupId: state.groupId },
            defaults: { groupId: state.groupId, data: state },
        });
        if (!created)
            throw new ConflictError("This group already has a live workspace");
    }
    async groups() {
        return (await this.Workspace.findAll({ attributes: ["groupId"] })).map((r) => r.get("groupId"));
    }
    async transact(groupId, work) {
        return this.sequelize.transaction(async (transaction) => {
            const row = await this.Workspace.findByPk(groupId, {
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!row)
                throw new NotFoundError("Live workspace", groupId);
            const state = structuredClone(row.get("data"));
            const tx = this.makeTransaction(groupId, state, transaction);
            const result = await work(tx);
            row.set("data", state);
            await row.save({ transaction });
            return result;
        });
    }
    makeTransaction(groupId, state, transaction) {
        const documentWhere = (kind, id) => ({ groupId, kind, id });
        return {
            state,
            get: async (kind, id) => (await this.Document.findOne({
                where: documentWhere(kind, id),
                transaction,
            }))?.get("data"),
            put: async (kind, id, data) => {
                await this.Document.upsert({ groupId, kind, id, data }, { transaction });
            },
            remove: async (kind, id) => {
                await this.Document.destroy({
                    where: documentWhere(kind, id),
                    transaction,
                });
            },
            list: async (kind) => (await this.Document.findAll({ where: { groupId, kind }, transaction })).map((r) => r.get("data")),
            emit: async (type, data, key) => {
                key ?? (key = `api:${state.nextEvent + 1}`);
                if (await this.Event.findOne({ where: { groupId, key }, transaction }))
                    return;
                const event = {
                    seq: ++state.nextEvent,
                    key,
                    type,
                    data,
                    at: new Date().toISOString(),
                };
                await this.Event.create({ groupId, seq: event.seq, key, data: event }, { transaction });
            },
        };
    }
    async events(groupId, after, limit = 200) {
        return (await this.Event.findAll({
            where: { groupId, seq: { [Op.gt]: after } },
            order: [["seq", "ASC"]],
            limit: Math.min(limit, 500),
        })).map((r) => r.get("data"));
    }
}
