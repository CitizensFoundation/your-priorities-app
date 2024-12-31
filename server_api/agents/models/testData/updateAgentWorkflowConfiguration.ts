import { YpAgentProduct } from "../agentProduct.js";
import { YpSubscriptionPlan } from "../subscriptionPlan.js";

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


  const fundingAgent = await YpAgentProduct.findByPk(6);
  if (fundingAgent) {

    const fundingAgentWorkflow: YpWorkflowConfiguration = {
      currentStepIndex: 0,
      steps: [
        {
          name: "Funding Agent Wide Search",
          shortName: "Wide Search",
          description:
            "Wide search for investors and funding opportunities.",
          shortDescription: "Wide search for investors and funding opportunities.",
          agentClassUuid: "956e7f74-6fc6-4e01-81b4-098c193e6450",
          type: "agentOps",
          stepBackgroundColor: "#ffdc2f",
          stepTextColor: "#211e1c"
        },
        {
          name: "Funding Agent People Prioritization",
          shortName: "Vetting investors",
          description: "People prioritization of the wide search results.",
          shortDescription: "People prioritization of the wide search results.",
          agentClassUuid: "956e7f74-6fc6-4e01-81b4-098c193e6450",
          type: "engagmentFromOutputConnector",
          stepBackgroundColor: "#e74c3c",
          stepTextColor: "#ffffff",
        },
        {
          name: "Funding Agent Detailed Search",
          shortName: "Detailed Search",
          description:
            "Detailed search for investors and funding opportunities.",
          shortDescription: "Detailed search for investors and funding opportunities.",
          agentClassUuid: "b36ffca6-7363-44be-bd55-40661210cf24",
          type: "agentOps",
          stepBackgroundColor: "#1e90ff",
          stepTextColor: "#ffffff",
        },
        {
          name: "Funding Agent Detailed Search People Prioritization",
          shortName: "Key investors",
          description: "People prioritization of the detailed search results.",
          shortDescription: "People prioritization of the detailed search results.",
          agentClassUuid: "b36ffca6-7363-44be-bd55-40661210cf24",
          type: "engagmentFromOutputConnector",
          stepBackgroundColor: "#2ecc71",
          stepTextColor: "#ffffff",
        },
        {
          name: "Funding Agent Report",
          shortName: "Funding report",
          description:
            "Report on investors and funding opportunities.",
          shortDescription: "Report on investors and funding opportunities.",
          agentClassUuid: "1bbf8f86-0ffc-4356-aaa1-9cea04b78ec4",
          type: "agentOps",
          stepBackgroundColor: "#d486da",
          stepTextColor: "#ffffff",
        },
      ],
    };

    fundingAgent.set("configuration.workflow", fundingAgentWorkflow);
    fundingAgent.changed("configuration", true);
    await fundingAgent.save();
  }

  const fundingSubscriptionPlan = await YpSubscriptionPlan.findByPk(6);
  if (fundingSubscriptionPlan) {
    fundingSubscriptionPlan.set("configuration.structuredAnswersOverride", []);
    fundingSubscriptionPlan.set("configuration.requiredStructuredQuestions", [
      {
        uniqueId: "businessDescription",
        type: "textArea",
        description: "Detailed description of the business, this is critical for the agent to understand the business and provide accurate results.",
        value: "",
        maxLength: 7500,
        required: true,
        rows: 5,
        charCounter: true,
        text: "Business Description",
      },
    ]);
    fundingSubscriptionPlan.changed("configuration", true);
    await fundingSubscriptionPlan.save();
  } else {
    console.log("FundingSubscriptionPlan not found");
  }
}

setupAgentProductsConfiguration();
