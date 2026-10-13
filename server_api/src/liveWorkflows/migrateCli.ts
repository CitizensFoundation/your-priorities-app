import models from "../models/index.cjs";
import { migrateLiveWorkflows } from "./migrate.js";
try {
  await migrateLiveWorkflows(models.sequelize);
} finally {
  await models.sequelize.close();
}
