/**
 * A flexible renderer for "Competitor Agent" (or any) workflow emails.
 *
 * - The CTA block (button + instructions) is inserted *within* the loop,
 *   right after the step that is currently active (currentStepIndex).
 * - Branding (logo, brand name, footer text, etc.) are all passed in,
 *   so they are not hardcoded in the template.
 */
export declare class EmailTemplateRenderer {
    /**
     * Render the dynamic email with steps, highlighting the current step,
     * and inserting the CTA block immediately after the current step only.
     *
     * @param recipientName - e.g. "Petur".
     * @param invitedBy - e.g. "Robert Bjarnason".
     * @param agentName - e.g. "Competitor Agent".
     * @param workflow - The workflow with steps + currentStepIndex.
     * @param ctaLink - Destination URL when clicking the CTA button.
     * @param brandLogoUrl - URL to your brand’s logo.
     * @param brandName - Display name of the brand (e.g., "amplifier powered by Evoly").
     * @param footerText - Footer text, e.g. "© 2024 Evoly ehf, Vegmuli 8..."
     * @param footerEmailSettingsLink - Link to "Change email settings".
     */
    static renderEmail(recipientName: string, invitedBy: string, agentName: string, workflow: YpAgentRunWorkflowConfiguration, ctaLink: string, brandLogoUrl: string, brandName: string, footerText: string, footerEmailSettingsLink: string): string;
}
