// AgentNotificationEmailService.ts

import { PsAgent } from "@policysynth/agents/dbModels/agent.js";
import { YpAgentProductRun } from "../models/agentProductRun.js";
import models from "../../models/index.cjs";
import { EmailTemplateRenderer } from "./emailTemplateRenderer.js";
import queue from "../../services/workers/queue.cjs";
import { NotificationAgentQueueManager } from "./notificationAgentQueueManager.js";
const dbModels: Models = models;
const Group = dbModels.Group as GroupClass;
const User = dbModels.User as UserClass;
const Community = dbModels.Community as CommunityClass;
const Domain = dbModels.Domain as DomainClass;

export class AgentInviteManager {
  /**
   * Send a notification email to group admins about the current workflow step or completion.
   */
  public static async sendInviteEmail(
    link: string,
    agentRunId: number,
    groupId: number,
    senderUser: UserClass,
    inviteeEmail: string
  ): Promise<void> {
    try {
      const agentRun = await NotificationAgentQueueManager.getAgentRun(agentRunId);

      if (!agentRun) {
        console.error("Agent run not found");
        return;
      }

      const subject = `${agentRun?.Subscription?.Plan?.AgentProduct?.name} - ${
        agentRun?.workflow?.steps[agentRun?.workflow?.currentStepIndex]?.shortName
      } invite`;

      // 2. Extract bundleId and userId if needed
      const bundleId =
        agentRun?.Subscription?.Plan?.AgentProduct?.AgentBundles?.[0]?.id || 1;


      const group = (await Group.findOne({
        where: { id: groupId },
        include: [
          {
            model: Community,
            attributes: ["id", "name"],
            include: [{ model: Domain, attributes: ["id", "name", "domain_name"] }],
          },
        ],
      })) as YpGroupData;

      const emailContent = EmailTemplateRenderer.renderEmail(
        "",
        senderUser.name,
        agentRun.Subscription?.Plan?.AgentProduct?.name || "",
        agentRun.workflow,
        link,
        "https://evoly.ai/is/amplifier/img/amplifier-logo.png",
        "https://evoly.ai/is/amplifier/img/evoly-bw-logo.png",
        "https://evoly.ai/",
        "© 2024 Evoly ehf, Vegmuli 8, 108, Reykjavik, Iceland"
      );

      queue.add(
        "send-one-email",
        {
          subject: subject,
          template: "general_user_notification",
          user: { id: null, email: inviteeEmail, name: inviteeEmail },
          domain: group.Community?.Domain,
          group: group,
          object: {},
          header: "",
          content: emailContent,
          link: link,
          skipHeaderAndFooter: true,
        },
        { priority: "high" }
      );

      console.log("AgentInviteManager: Email enqueued successfully");
    } catch (error) {
      console.error("AgentInviteManager: Error sending notification email", error);
      throw error;
    }
  }
}
