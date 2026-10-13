import {
  RecordError,
  asJson,
  object,
  processJobs,
  promptJob,
  type Agent,
  type Json,
} from "./sdk.js";

export const run: Agent = async (context, input) => {
  let reference: Json = context.configuration.reference ?? [];
  if (context.configuration.referenceBinding)
    reference = await context.connector(
      "reference",
      String(context.configuration.referenceBinding),
      "read",
      {},
    );
  return processJobs(context, input, async (job) => {
    const actualReference =
      context.configuration.comparison === "license-education"
        ? {
            licenses: job.analysis.licenses ?? null,
            education: job.analysis.education ?? null,
          }
        : reference;
    if (
      !actualReference ||
      (Array.isArray(actualReference) && !actualReference.length) ||
      (context.configuration.comparison === "license-education" &&
        (!job.analysis.licenses || !job.analysis.education))
    ) {
      job.analysis[context.nodeId] = {
        status: "unknown",
        agreements: [],
        disagreements: [],
        missingEvidence: ["Reference data is missing"],
        metrics: {},
      };
      job.status = "unknown";
      return job;
    }
    const result = object(
      await context.model(
        `${job.id}:comparison`,
        "Compare INPUT.job with INPUT.reference. For license/education comparisons distinguish explicit from implicit requirements and record disagreement rather than overwriting either source. For rewrite comparisons evaluate readability, removed barriers, retained duties, and factual support. Return JSON {status:'known'|'unknown', agreements:[], disagreements:[], missingEvidence:[], metrics:{}}. No reference evidence means unknown.",
        asJson({
          job: promptJob(job),
          reference: actualReference,
          mode: context.configuration.comparison ?? "rewrite",
        }),
        "review",
      ),
    );
    if (result.status !== "known" && result.status !== "unknown")
      throw new RecordError("Invalid comparison status");
    job.analysis[context.nodeId] = result;
    if (result.status === "unknown") job.status = "unknown";
    return job;
  });
};
