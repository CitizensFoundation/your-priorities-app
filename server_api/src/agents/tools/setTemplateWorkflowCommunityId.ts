import { sequelize } from "@policysynth/agents/dbModels/index.js";
import { YpAgentProduct } from "../models/agentProduct.js";
import log from "../../utils/loggerTs.js";

/**
 * Updates the templateWorkflowCommunityId in the   configuration of a specific agent product.
 *
 * Usage:
 *    ts-node setTemplateWorkflowCommunityId.ts <agentProductId> <templateWorkflowCommunityId>
 */
async function setTemplateWorkflowCommunityId(
  agentProductId: number,
  templateWorkflowCommunityId: number
) {
  try {

    // Find the Agent Product by ID
    const agentProduct = await YpAgentProduct.findByPk(agentProductId);
    if (!agentProduct) {
      log.error(`Agent Product with ID ${agentProductId} not found.`);
      return;
    }

    // If the product is found, update its configuration
    const currentConfig = agentProduct.configuration ?? {};
    currentConfig.templateWorkflowCommunityId = templateWorkflowCommunityId;

    // Update the record
    agentProduct.configuration = currentConfig;
    agentProduct.changed('configuration', true);
    await agentProduct.save();

    log.info(
      `Successfully updated Agent Product ${agentProductId} with templateWorkflowCommunityId = ${templateWorkflowCommunityId}`
    );
  } catch (error) {
    log.error(
      `Error updating templateWorkflowCommunityId for Agent Product ${agentProductId}:`,
      error
    );
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// --- Parse command line arguments ---
const args = process.argv.slice(2);
if (args.length !== 2) {
  log.error(
    "Usage: ts-node setTemplateWorkflowCommunityId.ts <agentProductId> <templateWorkflowCommunityId>"
  );
  process.exit(1);
}

const [agentProductId, templateWorkflowCommunityId] = args.map((arg) =>
  Number(arg)
);

if (isNaN(agentProductId) || isNaN(templateWorkflowCommunityId)) {
  log.error("Both arguments must be valid numbers.");
  process.exit(1);
}

// --- Run the function ---
setTemplateWorkflowCommunityId(agentProductId, templateWorkflowCommunityId);
