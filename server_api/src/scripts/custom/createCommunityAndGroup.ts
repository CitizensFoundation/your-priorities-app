import type { Transaction } from "sequelize";
import models from "../../models/index.cjs";
import log from "../../utils/loggerTs.js";

// Creates the community and the group that the nesta-your-priorities
// landing page links to (/group/1/new_post). Intended for setting up a local
// development environment.
//
// Usage: node createCommunityAndGroup.js <domainId> <adminEmail>
//
//   domainId    ID of the domain to create the community in
//   adminEmail  email of an existing user, who becomes the owner and an
//               admin of the community and the group
//
// Connects to the database configured by the environment, like the app.
// Exits without changing anything if the new group doesn't get ID 1, for
// example because group 1 already exists.

// The landing page hard-codes this group ID.
const GROUP_ID = 1;

// The model types in models/index.cts don't declare the access constants
// that the models define (in models/community.cjs and models/group.cjs), or
// the association methods that Sequelize generates, so the ones used here
// are declared locally.
type User = NonNullable<Awaited<ReturnType<typeof models.User.findOne>>>;
type AddAssociation = (
  user: User,
  options: { transaction: Transaction }
) => Promise<unknown>;
const Community = models.Community as typeof models.Community & {
  ACCESS_PUBLIC: number;
};
const Group = models.Group as typeof models.Group & {
  ACCESS_OPEN_TO_COMMUNITY: number;
};

// The configurations below match the values that were observed on the
// production site on 2026-10-13, as fetched via
// https://small-ideas.org/api/groups/1.
//
// They distinguish between:
//
// - settings that someone deliberately chose in the admin UI
//
// - defaults: values that get saved without anyone choosing them, because
//   the admin UI pre-populates them or because the save controller
//   (updateCommunityConfigParameters or updateGroupConfigParameters) fills
//   them in when the field is left blank. This script writes to the
//   database directly, bypassing the controller, so it sets them itself.
//
// Settings that are false or null on production are left out: for each of
// them, the app treats a missing value the same as false or null. That isn't
// true of every setting (a missing canVote, for example, allows voting).

// Defaults pre-populated by the admin UI's theme selector
// (yp-theme-selector.ts).
const defaultTheme: YpThemeConfiguration = {
  variant: "monochrome",
  oneColorScheme: "tonal",
  useLowestContainerSurface: false,
};

// Defaults pre-populated by the admin UI (defaultLtpConfiguration in
// yp-admin-config-base.ts).
const defaultLtpPrompts = () =>
  Object.fromEntries(Array.from({ length: 10 }, (_, i) => [i + 1, ""]));
// YpLtpConfiguration doesn't declare promptsTests, which the admin UI saves.
type LtpConfiguration = YpLtpConfiguration & {
  crt: { promptsTests: Record<number, string> };
};
const defaultLtp: LtpConfiguration = {
  crt: {
    prompts: defaultLtpPrompts(),
    promptsTests: defaultLtpPrompts(),
  },
};

// Production's back links use its own address, https://small-ideas.org.
// Let's not hardcode that.
const customBackURL = "/";

const communityConfiguration: YpCommunityConfiguration = {
  // Defaults pre-populated by the admin UI.
  ltp: defaultLtp,

  // Deliberately set.
  customBackURL,
  disableCollectionUpLink: true,
  hideAllTabs: true,
  hideGroupTypeInList: true,
  hideItemCount: true,

  theme: {
    ...defaultTheme,

    // Deliberately set.
    primaryColor: "E144DC",
    fontImports: [
      "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap",
      "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Bebas+Neue&display=swap",
    ].join("\n"),
    fontStyles: `body {
      font-family: Atkinson Hyperlegible, serif;
  }

  :root {
    --md-ref-typeface-brand: Bebas Neue, serif;
    --md-ref-typeface-plain: Bebas Neue, serif;

    --md-sys-typescale-headline-font: "Bebas Neue";
    --md-sys-typescale-title-font: "Bebas Neue";
  }`,
  },
};

// The submission form's questions, as deliberately entered in the admin UI.
const structuredQuestions: YpStructuredQuestionData[] = [
  {
    text: "What's not working? For who? And how does it affect everyday life?",
    type: "textarea",
    required: true,
    maxLength: 600,
    charCounter: true,
    uniqueId: "1",
  },
  {
    text: "What's the fix? Be specific.",
    type: "textarea",
    required: true,
    maxLength: 600,
    charCounter: true,
    uniqueId: "2",
  },
];

const groupConfiguration: YpGroupConfiguration = {
  // Defaults pre-populated by the admin UI (yp-admin-config-group.ts).
  // "Idea generation and debate", the first option. The YpGroupType enum
  // that names it is in the client's code (yp-collection/ypGroupType.ts),
  // which server code can't import.
  groupType: 0,
  canAddNewPosts: true, // The only checkbox that starts ticked
  ltp: defaultLtp,
  theme: defaultTheme,

  // Defaults filled in by the save controller.
  endorsementButtons: "hearts",
  audioPostUploadLimitSec: 60,
  videoPostUploadLimitSec: 60,
  audioPointUploadLimitSec: 30,
  videoPointUploadLimitSec: 30,

  // Derived by the save controller from structuredQuestions: the parsed
  // questions, with each input question (all of ours) numbered.
  structuredQuestionsJson: structuredQuestions.map((question, index) => ({
    ...question,
    questionIndex: index + 1,
  })),

  // Deliberately set.
  allPostsBlockedByDefault: true,
  allowAnonymousAutoLogin: true,
  allowAnonymousUsers: true,
  alternativeTextForNewIdeaSaveButton: "Submit idea",
  canVote: false,
  closeNewsfeedSubmissions: true,
  customBackName: "The Institute for Small Ideas",
  customBackURL,
  customThankYouTextNewPosts: "Thank you for your idea!",
  customTitleQuestionText: "Sum up your idea in one line",
  disableCollectionUpLink: true,
  disableDebate: true,
  disableNameAutoTranslation: true,
  hideAllTabs: true,
  hideDownVoteForPost: true,
  hideGroupLevelTabs: true,
  hideHelpIcon: true,
  hideItemCount: true,
  hideMediaInput: true,
  hideNewsfeeds: true,
  hidePostCover: true,
  hideRecommendationOnNewsFeed: true,
  hideStatsAndMembership: true,
  hideVoteCount: true,
  locationHidden: true,
  moreContactInformation: true,
  moreContactInformationAddress: true,
  onlyAdminsCanViewIdeas: true,
  postDescriptionLimit: 1000,
  structuredQuestions: JSON.stringify(structuredQuestions),
};

(async () => {
  try {
    const [domainIdArg, adminEmail] = process.argv.slice(2);
    if (!domainIdArg || !adminEmail) {
      log.info(
        "Usage: node createCommunityAndGroup.js <domainId> <adminEmail>"
      );
      process.exit(1);
    }

    const domainId = Number(domainIdArg);
    const domain = await models.Domain.findOne({ where: { id: domainId } });
    if (!domain) {
      log.error(`Domain ${domainId} not found`);
      process.exit(1);
    }

    const admin = await models.User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      log.error(`User with email ${adminEmail} not found`);
      process.exit(1);
    }

    await models.sequelize.transaction(async (transaction: Transaction) => {
      const community = await Community.create(
        {
          domain_id: domain.id,
          name: "Small Ideas Initiative",
          // Required. Production's value isn't known, so this is a guess.
          hostname: "small-ideas",
          user_id: admin.id,
          // Required. The admin UI records the creating request's IP address
          // and User-Agent; these follow the example of the other scripts
          // that create communities, such as
          // scripts/agents/generateAgentWorkflowTemplateFromAgentClass.ts.
          ip_address: "127.0.0.1",
          user_agent: "createCommunityAndGroup.ts",
          configuration: communityConfiguration,

          // Defaults pre-populated by the admin UI
          // (yp-admin-config-community.ts).
          only_admins_can_create_groups: true,

          // Deliberately set.
          access: Community.ACCESS_PUBLIC,
        },
        { transaction }
      );

      const group = await Group.create(
        {
          community_id: community.id,
          name: "Small Ideas Initiative",
          user_id: admin.id,
          configuration: groupConfiguration,

          // Defaults pre-populated by the admin UI (yp-admin-config-group.ts).
          access: Group.ACCESS_OPEN_TO_COMMUNITY,
          status: "hidden",
        },
        { transaction }
      );

      // Throwing rolls back the transaction.
      if (group.id !== GROUP_ID) {
        throw new Error(
          `The group was created with ID ${group.id}, not ${GROUP_ID}, so nothing has been saved. ` +
            `Either group ${GROUP_ID} already exists, or the database has assigned group IDs before ` +
            `(Postgres doesn't reuse them, even after a rollback). ` +
            `To create the group with ID ${GROUP_ID}, reset the database and run this script again.`
        );
      }

      // The admin UI does the following when creating a community or group.
      await (
        community as typeof community & { addCommunityAdmins: AddAssociation }
      ).addCommunityAdmins(admin, { transaction });
      await (
        group as typeof group & { addGroupAdmins: AddAssociation }
      ).addGroupAdmins(admin, { transaction });
      await domain.increment("counter_communities", { transaction });
      await domain.increment("counter_groups", { transaction });
      await community.increment("counter_groups", { transaction });

      log.info(
        `Created community ${community.id} and group ${group.id} in domain ${domain.id}, with ${admin.email} as admin`
      );
    });

    process.exit(0);
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
})();
