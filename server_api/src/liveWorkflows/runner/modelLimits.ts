/** Reasoning and visible output share the token allowance; all tokens are reserved before dispatch. */
export const workflowModelOutputTokens = 32768;
export const workflowProviderTimeoutMs = 360_000;
// Leave time for the provider outcome and its ledger settlement to reach the runner.
export const workflowGatewayTimeoutMs = workflowProviderTimeoutMs + 60_000;
export const workflowSocketTimeoutMs = workflowGatewayTimeoutMs + 60_000;
