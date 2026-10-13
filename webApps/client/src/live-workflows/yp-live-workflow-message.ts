import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";

@customElement("yp-live-workflow-message")
export class YpLiveWorkflowMessage extends LitElement {
  @property() messageRole: "user" | "assistant" | "activity" = "assistant";
  @property() assistantName = "Workflow Assistant";
  @property() text = "";
  @property() at?: string;
  @property({ type: Boolean }) completed = false;
  @property({ attribute: false }) sender?: YpUserData;
  @state() private failedAvatar?: string;
  private formatted?: string;

  static override styles = css`
    :host {
      display: block;
      margin: 20px 0;
      min-width: 0;
    }
    .message {
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr);
      gap: 10px;
    }
    .message.user {
      grid-template-columns: minmax(0, 1fr) 34px;
      margin-left: 28px;
    }
    .user .avatar {
      grid-column: 2;
      grid-row: 1;
    }
    .user .content {
      grid-column: 1;
      grid-row: 1;
    }
    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      overflow: hidden;
      background: linear-gradient(145deg, #8575c9, #504282);
      color: white;
      box-shadow: 0 3px 8px #55428c24;
      font-size: 12px;
      font-weight: 700;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .user .avatar {
      border-radius: 50%;
      background: #e6e2f2;
      color: #574477;
    }
    .avatar svg {
      width: 21px;
      height: 21px;
    }
    .meta {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin: 0 0 7px;
      min-width: 0;
      flex-wrap: wrap;
    }
    .user .meta {
      justify-content: flex-end;
    }
    .meta strong {
      font-size: 13px;
    }
    .caption,
    time,
    .streaming {
      font-size: 11px;
      color: var(--md-sys-color-on-surface-variant, #716b80);
    }
    time {
      margin-left: auto;
      font-variant-numeric: tabular-nums;
    }
    .user time {
      margin-left: 0;
    }
    .bubble {
      padding: 14px 16px;
      border: 1px solid var(--md-sys-color-outline-variant, #e5e1ee);
      border-radius: 4px 18px 18px 18px;
      background: var(--md-sys-color-surface, #fff);
      box-shadow: 0 3px 12px #2b204508;
      font-size: 14px;
      line-height: 1.65;
      overflow-wrap: anywhere;
    }
    .user .bubble {
      border-radius: 18px 4px 18px 18px;
      border-color: color-mix(
        in srgb,
        var(--md-sys-color-primary, #7663a8) 18%,
        transparent
      );
      background: color-mix(
        in srgb,
        var(--md-sys-color-primary, #7663a8) 9%,
        var(--md-sys-color-surface, #fff)
      );
    }
    .plain {
      white-space: pre-wrap;
    }
    .markdown > :first-child {
      margin-top: 0;
    }
    .markdown > :last-child {
      margin-bottom: 0;
    }
    p {
      margin: 0.6em 0;
    }
    h1,
    h2,
    h3 {
      font-size: 1em;
      margin: 1em 0 0.4em;
    }
    ul,
    ol {
      padding-left: 20px;
    }
    li {
      margin: 4px 0;
    }
    pre {
      overflow: auto;
      padding: 12px;
      border-radius: 9px;
      background: var(--md-sys-color-surface-container, #f3f0f8);
      white-space: pre-wrap;
    }
    code {
      font-size: 0.9em;
      background: var(--md-sys-color-surface-container, #f3f0f8);
      border-radius: 4px;
      padding: 1px 4px;
    }
    pre code {
      padding: 0;
    }
    a {
      color: var(--md-sys-color-primary, #655194);
      text-underline-offset: 3px;
    }
    blockquote {
      margin: 12px 0;
      padding-left: 12px;
      border-left: 3px solid #aaa0c4;
    }
    table {
      border-collapse: collapse;
      display: block;
      overflow-x: auto;
      max-width: 100%;
    }
    th,
    td {
      padding: 6px;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }
    .streaming {
      margin-top: 7px;
      display: flex;
      gap: 5px;
      align-items: center;
    }
    .streaming::before {
      content: "";
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #8575c9;
    }
    .activity {
      margin-left: 44px;
      border-left: 2px solid var(--md-sys-color-outline-variant, #e5e1ee);
      padding-left: 12px;
    }
    .activity summary {
      cursor: pointer;
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant, #716b80);
    }
    .activity time {
      margin-left: 8px;
    }
    .activity pre {
      max-height: 220px;
      font-size: 11px;
      overflow-wrap: anywhere;
    }
    @media (max-width: 520px) {
      .message.user {
        margin-left: 10px;
      }
      .bubble {
        padding: 12px;
      }
    }
  `;

  override willUpdate(changed: PropertyValues) {
    if (!changed.has("text") && !changed.has("messageRole")) return;
    this.formatted = undefined;
    if (this.messageRole === "assistant") {
      // Model output may contain untrusted document text. Never render raw HTML or images.
      this.formatted = sanitizeHtml(
        marked.parse(this.text, { gfm: true, breaks: true }),
        {
          allowedTags: [
            "p",
            "br",
            "strong",
            "em",
            "del",
            "code",
            "pre",
            "ul",
            "ol",
            "li",
            "blockquote",
            "a",
            "h1",
            "h2",
            "h3",
            "hr",
            "table",
            "thead",
            "tbody",
            "tr",
            "th",
            "td",
          ],
          allowedAttributes: { a: ["href", "title", "target", "rel"] },
          allowedSchemes: ["http", "https", "mailto"],
          allowProtocolRelative: false,
          transformTags: {
            a: (_tag, attributes) => ({
              tagName: "a",
              attribs: {
                ...attributes,
                target: "_blank",
                rel: "noopener noreferrer",
              },
            }),
          },
        },
      );
    }
  }
  private avatarUrl() {
    if (!this.sender) return undefined;
    try {
      const source =
        YpMediaHelpers.getImageFormatUrl(this.sender.UserProfileImages, 0) ||
        (this.sender.facebook_id
          ? `https://graph.facebook.com/${this.sender.facebook_id}/picture`
          : "");
      if (!source || source === this.failedAvatar) return undefined;
      const url = new URL(source, window.location.href);
      return ["http:", "https:"].includes(url.protocol) ? source : undefined;
    } catch {
      return undefined;
    }
  }
  private time() {
    if (!this.at) return nothing;
    const date = new Date(this.at);
    return html`<time datetime=${this.at} title=${date.toLocaleString()}
      >${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}</time
    >`;
  }
  override render() {
    if (this.messageRole === "activity")
      return html`<details class="activity">
        <summary>${this.assistantName} activity ${this.time()}</summary>
        <pre>${this.text}</pre>
      </details>`;
    const user = this.messageRole === "user";
    const name = user
      ? this.sender?.name || "Group operator"
      : this.assistantName;
    const avatar = user ? this.avatarUrl() : undefined;
    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return html`<article class="message ${this.messageRole}">
      <div
        class="avatar"
        role="img"
        aria-label=${user ? `${name} profile image` : this.assistantName}
      >
        ${avatar
          ? html`<img
              src=${avatar}
              alt=""
              @error=${() => {
                this.failedAvatar = avatar;
              }}
            />`
          : user
            ? html`<span aria-hidden="true">${initials}</span>`
            : html`<svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path
                  d="m8 6-5 6 5 6m8-12 5 6-5 6m-3-14-2 16"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>`}
      </div>
      <div class="content">
        <div class="meta">
          <strong>${name}</strong
          ><span class="caption"
            >${user
              ? this.sender
                ? "You"
                : "Operator"
              : "Workflow assistant"}</span
          >${this.time()}
        </div>
        <div class="bubble ${this.formatted === undefined ? "" : "markdown"}">
          ${this.formatted === undefined
            ? html`<span class="plain">${this.text}</span>`
            : unsafeHTML(this.formatted)}
        </div>
        ${!user && !this.completed
          ? html`<div class="streaming">Writing…</div>`
          : nothing}
      </div>
    </article>`;
  }
}
