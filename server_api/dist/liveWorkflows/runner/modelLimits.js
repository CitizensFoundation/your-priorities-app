/** Reasoning and visible output share the token allowance; all tokens are reserved before dispatch. */
export const workflowModelOutputTokens = 65536;
export const workflowProviderTimeoutMs = 720000;
// Leave time for the provider outcome and its ledger settlement to reach the runner.
export const workflowGatewayTimeoutMs = workflowProviderTimeoutMs + 60000;
export const workflowSocketTimeoutMs = workflowGatewayTimeoutMs + 60000;
