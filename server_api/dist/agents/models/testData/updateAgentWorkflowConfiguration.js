import { YpAgentProduct } from "../agentProduct.js";
import { YpSubscriptionPlan } from "../subscriptionPlan.js";
async function setupAgentProductsConfiguration() {
    const competitionAgentWorkflow = {
        currentStepIndex: 0,
        steps: [
            {
                name: "Wide search for competitors",
                shortName: "Competitors wide search",
                shortDescription: "A wide search for competitors based on your business description.",
                description: "A wide search for competitors based on your business description. The wide search will result in a list of competitors that you and your team can vet as actual competitors.",
                agentClassUuid: "a1b2c3d4-e5f6-c7c8-a9c0-c1225354f516",
                type: "agentOps",
                stepBackgroundColor: "#ffdc2f",
                stepTextColor: "#211e1c",
            },
            {
                name: "Vet and vote top 10 competitors",
                shortName: "Vote 10 competitors",
                shortDescription: "Your team reviews and votes on competitors.",
                description: "You and your team can now review the results of the wide search which is a list of potential competitors. Everyone can vote for ten competitors and the competitors with the most votes will move ahead to the next round and become key competitors.",
                agentClassUuid: "a1b2c3d4-e5f6-c7c8-a9c0-c1225354f516",
                type: "engagmentFromOutputConnector",
                stepBackgroundColor: "#e74c3c",
                stepTextColor: "#ffffff",
                emailCallForAction: "Start Vetting Competitors",
                emailInstructions: "Use up 👍 and down 👎 thumbs to vet competitors. You can choose as many as you want but <b>only top 10 will go forward</b>, to the next round!",
            },
            {
                name: "Detailed search on key competitors",
                shortName: "Key competitors' details",
                shortDescription: "Multi-dimensional search to understand your key competitors.",
                description: "Detailed search for competitors in multiple dimensions that include a company overview, recent news & updates, products & services, event participation, customer acquisitions, partnerships and collaborations, and ethical practices.",
                agentClassUuid: "c6e99ac4-e5f6-c7c1-a1c0-c1ab53c4ff16",
                type: "agentOps",
                stepBackgroundColor: "#1e90ff",
                stepTextColor: "#ffffff",
            },
            {
                name: "Add team insights about key competitors",
                shortName: "Add team insights",
                shortDescription: "Your team can now add their insights about key competitors.",
                description: "You and your team can now review the details about competitors and add insights by commenting on competitors. Your comments will used in the final report.",
                agentClassUuid: "c6e99ac4-e5f6-c7c1-a1c0-c1ab53c4ff16",
                type: "engagmentFromOutputConnector",
                stepBackgroundColor: "#2ecc71",
                stepTextColor: "#ffffff",
                emailCallForAction: "Comment On Key Competitors",
                emailInstructions: "View the details for key competitors and add your insights before the final report is created.",
            },
            {
                name: "Competitor analysis report",
                shortName: "Competitor Report",
                shortDescription: "Report on the state of your key competitors and recommendations.",
                description: "Report on the state of your key competitors where all the information gathered in earlier steps has been consolidated into chapters for each competitor and concludes with a chapter on action-oriented recommendations.",
                agentClassUuid: "1cf3af64-a5f6-a7c1-91c1-51fb13c72f1a",
                type: "agentOps",
                stepBackgroundColor: "#d486da",
                stepTextColor: "#ffffff",
                emailCallForAction: "View the Competitor Report",
                emailInstructions: "View the final report on the state of the market based on the competitors analysis.",
            },
        ],
    };
    const competitorAgentFreeTrial = await YpAgentProduct.findByPk(1);
    if (competitorAgentFreeTrial) {
        competitorAgentFreeTrial.set("configuration.workflow", competitionAgentWorkflow);
        competitorAgentFreeTrial.changed("configuration", true);
        await competitorAgentFreeTrial.save();
    }
    else {
        console.log("CompetitorAgentFreeTrial not found");
    }
    const competitorAgentPaid = await YpAgentProduct.findByPk(2);
    if (competitorAgentPaid) {
        competitorAgentPaid.set("configuration.workflow", competitionAgentWorkflow);
        competitorAgentPaid.changed("configuration", true);
        await competitorAgentPaid.save();
    }
    const fundingAgent = await YpAgentProduct.findByPk(6);
    if (fundingAgent) {
        const fundingAgentWorkflow = {
            currentStepIndex: 0,
            steps: [
                {
                    name: "Funding Agent Wide Search",
                    shortName: "Wide Search",
                    description: "Wide search for investors and funding opportunities.",
                    shortDescription: "Wide search for investors and funding opportunities.",
                    agentClassUuid: "956e7f74-6fc6-4e01-81b4-098c193e6450",
                    type: "agentOps",
                    stepBackgroundColor: "#ffdc2f",
                    stepTextColor: "#211e1c",
                },
                {
                    name: "Funding Agent Select Top 20 Investors",
                    shortName: "Select top 20 investors",
                    description: "Select top 20 investors from the wide search results.",
                    shortDescription: "Select top 20 investors from the wide search results.",
                    agentClassUuid: "956e7f74-6fc6-4e01-81b4-098c193e6450",
                    type: "engagmentFromOutputConnector",
                    stepBackgroundColor: "#e74c3c",
                    stepTextColor: "#ffffff",
                    emailCallForAction: "Vet Investors",
                    emailInstructions: "Use up 👍 and down 👎 thumbs to vet investors. You can choose as many as you want but <b>only top 20 will go forward</b>, to the next round!",
                },
                {
                    name: "Funding Agent Detailed Search",
                    shortName: "Detailed search",
                    description: "Detailed search for investors and funding opportunities.",
                    shortDescription: "Detailed search for investors and funding opportunities.",
                    agentClassUuid: "b36ffca6-7363-44be-bd55-40661210cf24",
                    type: "agentOps",
                    stepBackgroundColor: "#1e90ff",
                    stepTextColor: "#ffffff",
                },
                {
                    name: "Comment on Key Investors",
                    shortName: "Comment on investors",
                    description: "Comment on investors before creating report",
                    shortDescription: "Comment on investors before creating report",
                    agentClassUuid: "b36ffca6-7363-44be-bd55-40661210cf24",
                    type: "engagmentFromOutputConnector",
                    stepBackgroundColor: "#2ecc71",
                    stepTextColor: "#ffffff",
                    emailCallForAction: "Comment On Key Investors",
                    emailInstructions: "View the details for key investors and add your insights before the final report is created.",
                },
                {
                    name: "Funding Agent Report",
                    shortName: "Funding report",
                    description: "Report on investors and funding opportunities.",
                    shortDescription: "Report on investors and funding opportunities.",
                    agentClassUuid: "1bbf8f86-0ffc-4356-aaa1-9cea04b78ec4",
                    type: "agentOps",
                    stepBackgroundColor: "#d486da",
                    stepTextColor: "#ffffff",
                    emailCallForAction: "View the Funding Report",
                    emailInstructions: "View the final report on investors and funding opportunities.",
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
                type: "textAreaLong",
                description: "Detailed description of the business, this is critical for the agent to understand the business and provide accurate results.",
                value: "",
                maxLength: 7500,
                required: true,
                rows: 5,
                charCounter: true,
                text: "Business Description",
            },
            {
                uniqueId: "investorGeographicFocus",
                type: "textFieldLong",
                description: "Geographic focus of the investors",
                value: "",
                maxLength: 250,
                required: false,
                rows: 1,
                charCounter: true,
                text: "Investor Geographic Focus",
            },
            {
                uniqueId: "investorIndustryFocus",
                type: "textFieldLong",
                description: "Industry focus of the investors",
                value: "",
                maxLength: 250,
                required: false,
                rows: 1,
                charCounter: true,
                text: "Investor Industry Focus",
            },
        ]);
        fundingSubscriptionPlan.changed("configuration", true);
        await fundingSubscriptionPlan.save();
    }
    else {
        console.log("FundingSubscriptionPlan not found");
    }
    // Update subscription plans 2-5 to coming_soon
    for (let planId = 2; planId <= 5; planId++) {
        const subscriptionPlan = await YpSubscriptionPlan.findByPk(planId);
        if (subscriptionPlan) {
            subscriptionPlan.set("configuration.type", "coming_soon");
            if (planId == 2) {
                subscriptionPlan.set("configuration.type", "paid");
            }
            subscriptionPlan.changed("configuration", true);
            await subscriptionPlan.save();
        }
        else {
            console.log(`SubscriptionPlan ${planId} not found`);
        }
    }
    for (let planId = 1; planId <= 2; planId++) {
        const subscriptionPlan = await YpSubscriptionPlan.findByPk(planId);
        if (subscriptionPlan) {
            subscriptionPlan.set("configuration.requiredStructuredQuestions", [
                {
                    uniqueId: "businessDescription",
                    type: "textAreaLong",
                    description: "Detailed description of the business, this is critical for the agent to understand the business and provide accurate results.",
                    value: "",
                    maxLength: 7500,
                    required: true,
                    rows: 5,
                    charCounter: true,
                    text: "Business Description",
                },
            ]);
            subscriptionPlan.changed("configuration", true);
            await subscriptionPlan.save();
        }
        else {
            console.log(`SubscriptionPlan ${planId} not found`);
        }
    }
}
setupAgentProductsConfiguration();
