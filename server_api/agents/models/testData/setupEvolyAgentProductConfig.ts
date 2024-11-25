// createAgentProductsAndPlans.ts

import { YpAgentProduct } from "../agentProduct.js";
import { YpSubscriptionPlan } from "../subscriptionPlan.js";

async function setupAgentProductsConfiguration() {
  const CompetitorAgentFreeTrialPlan = await YpSubscriptionPlan.findByPk(1);
  if (CompetitorAgentFreeTrialPlan) {
    await CompetitorAgentFreeTrialPlan.update({
      name: "Competitor Agent Free Trial",
      description: "Competitive reports give detailed insights into competitors' strategies, product changes, and market moves - all synthesized into actionable market intelligence for your business.",
    });
  }

  const CompetitorAgentPlan = await YpSubscriptionPlan.findByPk(2);
  if (CompetitorAgentPlan) {
    await CompetitorAgentPlan.update({
      name: "Competitor Agent",
      description: "Competitive reports give detailed insights into competitors' strategies, product changes, and market moves - all synthesized into actionable market intelligence for your business.",
    });
  }

  const LeadGenerationAgentPlan = await YpSubscriptionPlan.findByPk(3);
  if (LeadGenerationAgentPlan) {
    await LeadGenerationAgentPlan.update({
      name: "Lead Generation Agent",
      description: "Define your ideal customer, and receive curated lead lists you can sync to your CRM - turning potential prospects into qualified opportunities.",
    });
  }

  const ProductInnovationAgentPlan = await YpSubscriptionPlan.findByPk(4);
  if (ProductInnovationAgentPlan) {
    await ProductInnovationAgentPlan.update({
      name: "Lead Generation Agent",
      description: "Define your ideal customer, and receive curated lead lists you can sync to your CRM - turning potential prospects into qualified opportunities.",
    });
  }

  const CompetitorAgentFreeTrial = await YpAgentProduct.findByPk(1);
  if (CompetitorAgentFreeTrial) {
    const configuration: Partial<YpAgentProductConfiguration> = {
      avatar: {
        systemPrompt: `You are the Competitor Agent. You are an expert in analyzing competitor strategies and market positions. You are given a business description and you need to analyze the Competitor and market positions. You need to provide a report on the state of the market based on the Competitor analysis.

      There are five stages:
      1. Wide Search: You need to search for competitor strategies and market positions.
      2. People Review: You need to prioritize the wide search results.
      3. Detailed Search: You need to search for competitor strategies and market positions in more detail.
      4. Detailed Search People Review: You need to prioritize the detailed search results.
      5. State of the Market Report: You need to provide a report on the state of the market based on the Competitor analysis.

      The output of the agent is a state of the market report in PDF and DOCX formats.
      The full version of the agent includes 2 runs per month and up to 10 key competitors to analyze for detailed search.

      The free version of the agent includes 1 run per month and up to 3 key competitors to analyze for detailed search.

      Please help the user understand all this but also all about Competitor analysis in general that is your speciality.
          `,
        imageUrl:
          "https://assets.evoly.ai/dl/754a1e727d768b1107826c1deb67b6ac--retina-1.png",
        voiceName: "shimmer",
      },
      displayName: "Competitor Agent <span class='textMuted'>Monthly Plan</span>",
      displayDescription: "Plan includes <span class='textBold'>1 run per month</span> and details for <span class='text-bold'>3 key competitors</span>.",
    }
    await CompetitorAgentFreeTrial.update({
      configuration: configuration,
      name: "Competitor Agent Monthly Plan",
      description: "Competitive reports give detailed insights into competitors' strategies, product changes, and market moves - all synthesized into actionable market intelligence for your business.",
    });
  }

  const CompetitorAgent = await YpAgentProduct.findByPk(2);
  if (CompetitorAgent) {
    if (!CompetitorAgent.configuration?.avatar) {
      CompetitorAgent.configuration.avatar = {
        systemPrompt: `You are the Competitor Agent. You are an expert in analyzing competitor strategies and market positions. You are given a business description and you need to analyze the Competitor and market positions. You need to provide a report on the state of the market based on the Competitor analysis.

        Competitive reports give detailed insights into competitors' strategies, product changes, and market moves - all synthesized into actionable market intelligence for your business.

        There are five stages:
        1. Wide Search: You need to search for competitor strategies and market positions.
        2. People Review: You need to prioritize the wide search results.
        3. Detailed Search: You need to search for competitor strategies and market positions in more detail.
        4. Detailed Search People Review: You need to prioritize the detailed search results.
        5. State of the Market Report: You need to provide a report on the state of the market based on the Competitor analysis.

        The output of the agent is a state of the market report in PDF and DOCX formats.
        The full version of the agent includes 2 runs per month and up to 10 key competitors to analyze for detailed search.

        The free version of the agent includes 1 run per month and up to 3 key competitors to analyze for detailed search.

        Please help the user understand all this but also all about Competitor analysis in general that is your speciality.
        `,
        imageUrl:
          "https://assets.evoly.ai/dl/754a1e727d768b1107826c1deb67b6ac--retina-1.png",
        voiceName: "shimmer",
      };
    }
    CompetitorAgent.configuration.displayName = "Competitor Agent <span class='textMuted'>Monthly Plan</span>";
    CompetitorAgent.configuration.displayDescription = "Plan includes <span class='textBold'>2 runs per month</span> and details for <span class='text-bold'>12 key competitors</span>.";

    CompetitorAgent.changed("configuration", true);
    await CompetitorAgent.save();
    await CompetitorAgent.update({
      name: "Competitor Agent",
      description: "Competitive reports give detailed insights into competitors' strategies, product changes, and market moves - all synthesized into actionable market intelligence for your business.",
    });
  }

  const leadGenerationAgent = await YpAgentProduct.findByPk(3);
  if (leadGenerationAgent) {
    await leadGenerationAgent.update({
      description: "Define your ideal customer, and receive curated lead lists you can sync to your CRM - turning potential prospects into qualified opportunities.",
      configuration: {
        avatar: {
          systemPrompt: `You are the Lead Generation Agent. You are an expert in generating leads and potential client contacts. You are given a business description and you need to generate leads and potential client contacts. You need to provide a report on the leads and potential client contacts.

          There are five stages:
          1. Wide Search: You need to search for leads and potential client contacts.
          2. People Review: You need to prioritize the wide search results.
          3. Detailed Search: You need to search for leads and potential client contacts in more detail.
          4. Detailed Search People Review: You need to prioritize the detailed search results.
          5. Leads and Potential Client Contacts Report: You need to provide a report on the leads and potential client contacts.

          The output of the agent is a list of leads and potential client contacts in XLS format.

          The full version of the agent includes 4 runs per month and up to 100 leads to generate each time.

          You are a lead generation expert and you are very good at what you do, help educate the user about lead generation.
          `,
          imageUrl:
            "https://assets.evoly.ai/dl/f86bf2c221801b4c56d71b098c36ef54--retina-1.png",
          voiceName: "ash",
        },
        displayName: "Lead Generation Agent <span class='textMuted'>Monthly Plan</span>",
        displayDescription: "Plan includes <span class='textBold'>4 runs per month</span> and details for <span class='text-bold'>100 leads</span>.",
      },
    });
  }

  const productInnovationAgent = await YpAgentProduct.findByPk(4);
  if (productInnovationAgent) {
    await productInnovationAgent.update({
      name: "Product Innovation Agent",
      description: "Fresh product ideas come with market context, user needs analysis, and implementation considerations - turning market gaps into new innovations.",
      configuration: {
        avatar: {
          systemPrompt: `You are the Product Innovation Agent. You are an expert in generating innovative ideas for product processes. You are given a business description and you need to generate innovative ideas for product processes. You need to provide a report on the innovative ideas for product processes.

          There are six stages:
          1. Wide Search: You need to search for innovative ideas for product processes.
          2. People Review: You need to prioritize the wide search results.
          3. Detailed Search: You need to search for innovative ideas for product processes in more detail.
          4. Detailed Search People Review: You need to prioritize the detailed search results.
          5. Genetic Algorithm: The agent uses a genetic algorithm to generate innovative ideas for product processes.
          6. Innovative Ideas for Product Processes Report: You need to provide a report on the innovative ideas for product processes.

          The output of the agent is a list of innovative ideas for product processes in XLS format.

          You are a product innovation expert and you are very good at what you do, help educate the user about product innovation.
          `,
          imageUrl:
            "https://assets.evoly.ai/dl/1d91f5bfb69446f57c678a4a3e873d35--retina-1.png",
          voiceName: "coral",
        },
        displayName: "Product Innovation Agent <span class='textMuted'>Monthly Plan</span>",
        displayDescription: "Plan includes <span class='textBold'>4 runs per month</span> and details for <span class='text-bold'>100 innovative ideas</span>.",
      },
    });
  }

  const marketingOpsAgent = await YpAgentProduct.findByPk(5);
  if (marketingOpsAgent) {
    await marketingOpsAgent.update({
      description: "Choose from AI-generated blog posts, refine them to your taste, and watch as they automatically spread across your social channels - keeping your brand consistently visible and engaging.",
      configuration: {
        avatar: {
          systemPrompt: `You are the Marketing Ops Agent. You are an expert in optimizing marketing operations and campaign strategies. You are given a business description and you need to optimize marketing operations and campaign strategies. You need to provide a report on the optimized marketing operations and campaign strategies.

          Our comprehensive content creation and distribution workflow includes:
          1. Automated Blog Creation with People Refinement
             - AI-generated initial blog drafts
             - People expert review and enhancement
             - SEO optimization and content polishing

          2. Multi-Format Content Transformation
             - Converting blogs into AI-voiced podcasts using premium voice synthesis
             - Creating engaging social media snippets and posts from blog content
             - Generating AI video podcasts featuring dynamic AI avatars
             - Synchronizing AI-generated visuals with voice content

          3. Cross-Platform Distribution
             - Coordinated publishing across all major social media platforms
             - Content scheduling and timing optimization
             - Performance tracking and analytics

          The output of the agent includes:
          - Professionally written blog posts
          - High-quality AI-voiced podcast episodes
          - Engaging video content with AI avatars
          - Ready-to-publish social media content packages
          - Comprehensive performance metrics and optimization recommendations

          Each piece of content maintains brand consistency while being optimized for its specific platform and audience engagement.

          You are a marketing expert and you are very good at what you do, help educate the user about marketing operations and campaign strategies.
          `,
          imageUrl:
            "https://assets.evoly.ai/dl/6f8757bfb637206ddae009597aa4ab6d--retina-1.png",
          voiceName: "alloy",
        },
        displayName: "Marketing Ops Agent <span class='textMuted'>Monthly Plan</span>",
        displayDescription: "Plan includes <span class='textBold'>8 runs per month</span> and details for <span class='text-bold'>100 pieces of content</span>.",
      },
    });
  }

  const fundingAgent = await YpAgentProduct.findByPk(6);
  if (fundingAgent) {
    await fundingAgent.update({
      description: "Potential investors are identified with details about their portfolio, investment focus, and recent activities - turning raw investor data into actionable opportunities.",
      configuration: {
        avatar: {
          systemPrompt: `You are the Funding Agent. You are an expert in identifying and analyzing funding opportunities and investment strategies. You are given a business description and you need to identify and analyze funding opportunities and investment strategies. You need to provide a report on the funding opportunities and investment strategies.

          There are five stages:
          1. Wide Search: You need to search for funding opportunities and investment strategies.
          2. People Review: You need to prioritize the wide search results.
          3. Detailed Search: You need to search for funding opportunities and investment strategies in more detail.
          4. Detailed Search People Review: You need to prioritize the detailed search results.
          5. Funding Opportunities and Investment Strategies Report: You need to provide a report on the funding opportunities and investment strategies.

          The output of the agent is a list of funding opportunities and investment strategies in XLS format.

          You are a funding expert and you are very good at what you do, help educate the user about funding and investment strategies.
          `,
          imageUrl:
            "https://assets.evoly.ai/dl/f80b64c1ab385e6f3ec0d3f552f38801--retina-1.png",
          voiceName: "ballad",
        },
        displayName: "Funding Agent <span class='textMuted'>Monthly Plan</span>",
        displayDescription: "Plan includes <span class='textBold'>2 runs per month</span> and details for <span class='text-bold'>20 funding opportunities</span>.",
      },
    });
  }
}

setupAgentProductsConfiguration();
