import { YpAgentProduct } from "../agentProduct.js";

async function setupAgentProductsConfiguration() {
  const competitorAgentFreeTrial = await YpAgentProduct.findByPk(1);
  if (competitorAgentFreeTrial) {
    const competitionAgentWorkflow: YpWorkflowConfiguration = {
      currentStepIndex: 0,
      steps: [
        {
          name: "Competitor Analysis Wide Search",
          shortName: "Wide search",
          description:
            "Wide search for competitor strategies and market positions.",
          shortDescription:
            "Wide search for competitor strategies and market positions.",
          agentClassUuid: "a1b2c3d4-e5f6-c7c8-a9c0-c1225354f516",
          type: "agentOps",
          stepBackgroundColor: "#ffdc2f",
          stepTextColor: "#211e1c",
        },
        {
          name: "Competitor Analysis People Review",
          shortName: "Vetting competitors",
          description: "People Review to vet key competitors",
          shortDescription: "People Review to vet key competitors",
          agentClassUuid: "a1b2c3d4-e5f6-c7c8-a9c0-c1225354f516",
          type: "engagmentFromOutputConnector",
          stepBackgroundColor: "#e74c3c",
          stepTextColor: "#ffffff",
        },
        {
          name: "Competitor Analysis Detailed Search",
          shortName: "Detailed search",
          description:
            "Detailed search for competitor strategies and market positions.",
          shortDescription:
            "Detailed search for competitor strategies and market positions.",
          agentClassUuid: "c6e99ac4-e5f6-c7c1-a1c0-c1ab53c4ff16",
          type: "agentOps",
          stepBackgroundColor: "#1e90ff",
          stepTextColor: "#ffffff",
        },
        {
          name: "Competitor Analysis Detailed Search People Review",
          shortName: "Key competitors",
          description: "People review of key competitors",
          shortDescription:
            "People review of key competitors",
          agentClassUuid: "c6e99ac4-e5f6-c7c1-a1c0-c1ab53c4ff16",
          type: "engagmentFromOutputConnector",
          stepBackgroundColor: "#2ecc71",
          stepTextColor: "#ffffff",
        },
        {
          name: "Competitors Report",
          shortName: "Competitor report",
          description:
            "Report on the state of the market based on the competitors analysis.",
          shortDescription:
            "Report on the state of the market based on the competitors analysis.",
          agentClassUuid: "1cf3af64-a5f6-a7c1-91c1-51fb13c72f1a",
          type: "agentOps",
          stepBackgroundColor: "#d486da",
          stepTextColor: "#ffffff",
        },
      ],
    };
    competitorAgentFreeTrial.set("configuration.workflow", competitionAgentWorkflow);
    competitorAgentFreeTrial.changed("configuration", true);

    await competitorAgentFreeTrial.save();
  } else {
    console.log("CompetitorAgentFreeTrial not found");
  }
}

setupAgentProductsConfiguration();
