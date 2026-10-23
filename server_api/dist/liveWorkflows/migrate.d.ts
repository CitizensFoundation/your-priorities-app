import { type Sequelize } from "sequelize";
/** Explicit deployment migration; never uses sync/alter at API startup. */
export declare function migrateLiveWorkflows(sequelize: Sequelize): Promise<void>;
