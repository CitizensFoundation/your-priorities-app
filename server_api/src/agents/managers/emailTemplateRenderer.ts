/**
 * A flexible renderer for "Competitor Agent" (or any) workflow emails.
 *
 * - The CTA block (button + instructions) is inserted *within* the loop,
 *   right after the step that is currently active (currentStepIndex).
 * - Branding (logo, brand name, footer text, etc.) are all passed in,
 *   so they are not hardcoded in the template.
 */

export class EmailTemplateRenderer {
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
  public static renderEmail(
    recipientName: string,
    invitedBy: string,
    agentName: string,
    workflow: YpAgentRunWorkflowConfiguration,
    ctaLink: string,
    brandLogoUrl: string,
    brandName: string,
    footerText: string,
    footerEmailSettingsLink: string
  ): string {
    // Identify the current step
    const currentStepIndex = workflow.currentStepIndex;
    const currentStep = workflow.steps[currentStepIndex] || {};

    // Pull out CTA text + instructions from the current step
    const ctaText = currentStep.emailCallForAction || "Continue";
    const instructionsText = currentStep.emailInstructions || "";

    // We'll build the steps as HTML in a single array, so that we can:
    // - Render each step
    // - If it's the current step, we insert the CTA block right afterward
    const stepsHtmlArray: string[] = [];

    workflow.steps.forEach((step, idx) => {
      const isActive = idx === currentStepIndex;
      // Bubble color
      const bubbleBg = isActive ? "#e74c3c" : "#eeeeee";
      const bubbleTextColor = isActive ? "#ffffff" : "#666666";
      // Step text color
      const stepTextColor = isActive ? "#1d211c" : "rgba(29, 33, 28, 0.5)";

      // Single step row
      stepsHtmlArray.push(`
        <tr>
          <td
            style="
              width: 25px;
              text-align: center;
              vertical-align: top;
            "
          >
            <table
              role="presentation"
              style="
                width: 25px;
                height: 25px;
                border-spacing: 0;
                border-collapse: collapse;
                margin-top: 2px;
              "
            >
              <tr>
                <td
                  style="
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    background-color: ${bubbleBg};
                    color: ${bubbleTextColor};
                    font-weight: 500;
                    font-size: 14px;
                    text-align: center;
                    line-height: 25px;
                    font-family: 'Prompt', Arial, sans-serif;
                  "
                >
                  ${idx + 1}
                </td>
              </tr>
            </table>
          </td>
          <td
            style="
              padding: 0 0 0 16px;
              color: #1d211c;
              font-weight: normal;
              vertical-align: middle;
            "
          >
            <strong style="color:${stepTextColor}">
              ${step.shortName}
            </strong>:
            <span style="color:${stepTextColor}">
              ${step.shortDescription}
            </span>
          </td>
        </tr>
        <tr><td style="height: 8px; line-height: 8px; font-size: 0"></td></tr>
      `);

      // If this step is the current step, we drop in the CTA block immediately after:
      if (isActive) {
        stepsHtmlArray.push(`
          <!-- CTA/instructions block for the current step only -->
          <tr>
            <td colspan="2">
              <table
                role="presentation"
                style="
                  width: 100%;
                  border-spacing: 0;
                  border-collapse: collapse;
                  background-color: rgba(255, 220, 47, 0.1);
                  border-radius: 8px;
                  padding: 150px;
                  text-align: center;
                "
              >
                <!-- Button Section -->
                <tr>
                  <td align="center" style="padding: 36px 0 0 0">
                    <table
                      role="presentation"
                      style="
                        border-spacing: 0;
                        border-collapse: collapse;
                        margin: 0 auto;
                      "
                    >
                      <tr>
                        <td
                          style="
                            background-color: #ffdc2f;
                            padding: 10px 20px;
                            border-radius: 50px;
                            text-align: center;
                            font-weight: 600;
                            font-size: 14px;
                            font-family: 'Prompt', Arial, sans-serif;
                          "
                        >
                          <a
                            href="${ctaLink}"
                            style="
                              text-decoration: none;
                              color: #1d211c;
                              display: inline-block;
                            "
                          >
                            ${ctaText}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Instructions below the button -->
                <tr>
                  <td
                    style="
                      padding: 22px 0 36px 0;
                      color: rgba(29, 33, 28, 1);
                      font-weight: normal;
                      line-height: 1.5;
                      text-align: center;
                    "
                  >
                    <table
                      role="presentation"
                      style="
                        width: 100%;
                        border-spacing: 0;
                        border-collapse: collapse;
                      "
                    >
                      <tr>
                        <td
                          style="
                            max-width: 540px;
                            margin: 0 auto;
                            text-align: center;
                            display: inline-block;
                            line-height: 1.5;
                            color: rgba(29, 33, 28, 0.5);
                            font-size: 15px;
                            padding: 0 20px;
                          "
                        >
                          ${instructionsText}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="height: 16px; line-height: 16px; font-size: 0"></td></tr>
        `);
      }
    });

    // Join the array into one big HTML string
    const stepsHtml = stepsHtmlArray.join("");

    // Now wrap that in the main email layout, using the brand parameters
    const outputHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Prompt:wght@100;200;300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <title>Email Notification</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: 'Poppins', Arial, sans-serif;
      font-size: 15px;
      color: #1d211c;
    "
  >
    <table role="presentation" style="border-spacing: 0; width: 100%;">
      <tr>
        <td align="center">
          <table
            style="
              max-width: 680px;
              margin: 0 auto;
              border: 1px solid rgba(29, 33, 28, 0.25);
              padding: 0 30px 0 30px;
            "
            role="presentation"
          >
            <!-- BRANDING / LOGO -->
            <tr>
              <td style="padding-top: 40px; text-align: left">
                <img
                  src="${brandLogoUrl}"
                  alt="${brandName} logo"
                  width="120"
                  style="border: 0; display: block"
                />
              </td>
            </tr>

            <!-- SALUTATION -->
            <tr>
              <td style="padding: 24px 0 0 0">
                <div style="line-height: 1.5; margin-bottom: 20px">
                  Hi ${recipientName ? recipientName : "there"},
                </div>
              </td>
            </tr>

            ${
              invitedBy
                ? `
            <!-- INVITE LINE -->
            <tr>
              <td style="padding: 20px 0 0 0">
                <div style="line-height: 1.5; margin-bottom: 20px">
                  <strong>${invitedBy}</strong> invited you to participate
                  in the <strong>${agentName}</strong> workflow.
                </div>
              </td>
            </tr>
            `
                : `
            <tr>
              <td style="padding: 20px 0 0 0">
                <div style="line-height: 1.5; margin-bottom: 20px">
                  The next step in the <strong>${agentName}</strong> workflow is ready.
                </div>
              </td>
            </tr>`
            }

            <!-- STEPS + CTA (inserted in the loop) -->
            <tr>
              <td>
                <table align="left" style="width: auto">
                  ${stepsHtml}
                </table>
              </td>
            </tr>

            <!-- SPACER -->
            <tr>
              <td style="height: 60px; line-height: 60px; font-size: 0">
                &nbsp;
              </td>
            </tr>

            <!-- FOOTER with brand text -->
            <tr>
              <td align="center" style="padding: 30px 0; text-align: center">
                <table
                  role="presentation"
                  style="
                    width: 100%;
                    border-spacing: 0;
                    border-collapse: collapse;
                    color: rgba(29, 33, 28, 0.5);
                  "
                >
                  <tr>
                    <td style="padding-bottom: 12px">
                      <!-- If you want a simpler brand name or a second logo,
                           place it here. Or remove if not needed. -->
                      <img
                        src="${brandLogoUrl}"
                        alt="${brandName}"
                        width="80"
                        style="
                          display: block;
                          margin: 0 auto;
                          border: 0;
                          opacity: 0.5;
                        "
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; padding-bottom: 6px">
                      ${footerText}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a
                        href="${footerEmailSettingsLink}"
                        style="
                          font-size: 12px;
                          text-decoration: underline;
                          color: inherit;
                        "
                      >
                        Change email settings
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `;

    return outputHtml;
  }
}
