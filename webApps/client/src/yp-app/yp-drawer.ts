import { html, css, TemplateResult, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element";

@customElement("yp-drawer")
export class YpDrawer extends YpBaseElement {
  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  position: "left" | "right" = "left";

  @property({ type: Boolean, reflect: true })
  transparentScrim: boolean = true;

  private _boundHandleEscKey = this._handleEscKey.bind(this);
  private _boundCloseAllDrawers = this._closeAllDrawers.bind(this);
  private _focusableSelector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  @query(".drawer-content")
  private drawerContentElement?: HTMLElement;

  @query("slot")
  private slotElement?: HTMLSlotElement;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          --drawer-width: 256px;
          --drawer-background-color: var(
            --md-sys-color-surface-container-lowest
          ); /* Fallback to white if custom property is not defined */
          --scrim-background: rgba(0, 0, 0, 0.5);
          --scrim-transparent: rgba(0, 0, 0, 0);
          height: 100%;
          z-index: 9999;
        }

        .drawer-content {
          width: var(--drawer-width);
          height: 100%;
          position: fixed;
          opacity: 0;
          top: 0;
          bottom: 0;
          overflow-y: auto;
          transform: translateX(-100%);
          background-color: var(--md-sys-color-surface-container-lowest);
          z-index: 2;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        :host([position="left"]) .drawer-content {
          left: 0;
          right: auto;
          transform: translateX(-100%); /* Start off-screen to the left */
        }

        :host([position="right"]) .drawer-content {
          right: 0;
          transform: translateX(100%); /* Start off-screen to the right */
          overflow-y: initial;
        }

        :host([open]) .drawer-content {
          transform: translateX(0); /* Slide in */
          opacity: 1; /* Fade in */
          transition: opacity 0.3s ease, transform 0.3s ease; /* Apply transitions */
        }
        .scrim {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: transparent;
          z-index: 2;
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
        }

        :host([open]) .scrim {
          background-color: var(--scrim-transparent);
          visibility: visible;
        }

        :host([open][transparentScrim]) .scrim {
          background-color: var(--scrim-transparent);
        }

        :host([open]) .scrim {
          opacity: 1;
          pointer-events: auto;
        }
      `,
    ];
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this._boundHandleEscKey);
    this.addEventListener("click", this._handleScrimClick);
    this.addGlobalListener("yp-close-all-drawers", this._boundCloseAllDrawers);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._boundHandleEscKey);
    this.removeEventListener("click", this._handleScrimClick);
    this.removeGlobalListener("yp-close-all-drawers", this._boundCloseAllDrawers);
  }

  _closeAllDrawers() {
    this.open = false;
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    if (changedProperties.has("open")) {
      if (this.open) {
        this.removeAttribute("aria-hidden");
      } else {
        this.setAttribute("aria-hidden", "true");
      }
      this.toggleAttribute("inert", !this.open);

      if (this.open === true) {
        this.fire("opened");
        this._focusDrawerContainer();
      } else if (this.open === false) {
        this.fire("closed");
      }
    }
  }

  private _handleScrimClick(event: MouseEvent): void {
    const scrim = this.shadowRoot!.querySelector(".scrim");
    const path = event.composedPath();
    if (scrim && path.includes(scrim)) {
      this.open = false;
    }
  }

  private _handleEscKey(event: KeyboardEvent): void {
    if (!this.open) {
      return;
    }

    if (event.key === "Escape") {
      this.open = false;
    } else if (event.key === "Tab") {
      this._trapFocus(event);
    }
  }

  private _trapFocus(event: KeyboardEvent): void {
    const focusableElements = this._getFocusableElements();

    if (focusableElements.length === 0) {
      this.drawerContentElement?.focus();
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const rootNode = this.getRootNode();
    const docLike =
      rootNode instanceof Document || rootNode instanceof ShadowRoot
        ? rootNode
        : document;
    const activeElement = docLike.activeElement as HTMLElement | null;
    const isShiftPressed = event.shiftKey;

    if (isShiftPressed) {
      if (!activeElement || activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else if (!activeElement || activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  private _getFocusableElements(): HTMLElement[] {
    const focusableElements: HTMLElement[] = [];
    const visitedNodes = new Set<Node>();
    const root = this.drawerContentElement;

    if (!root) {
      return focusableElements;
    }

    const isVisible = (element: HTMLElement) =>
      !!(
        element.offsetWidth ||
        element.offsetHeight ||
        element.getClientRects().length
      );

    const isFocusable = (element: HTMLElement) =>
      element.matches(this._focusableSelector) &&
      !element.hasAttribute("disabled") &&
      element.getAttribute("tabindex") !== "-1" &&
      isVisible(element) &&
      element.getAttribute("aria-hidden") !== "true";

    const collectFromNode = (node: Node | null) => {
      if (!node || visitedNodes.has(node)) {
        return;
      }

      visitedNodes.add(node);

      if (node instanceof HTMLElement) {
        if (isFocusable(node)) {
          focusableElements.push(node);
        }

        if (node.shadowRoot) {
          node.shadowRoot.childNodes.forEach((child) => collectFromNode(child));
        }
      }

      if (node instanceof HTMLSlotElement) {
        const assigned = node.assignedNodes({ flatten: true });
        assigned.forEach((assignedNode) => collectFromNode(assignedNode));
      }

      if (node instanceof ShadowRoot || node instanceof DocumentFragment) {
        node.childNodes.forEach((child) => collectFromNode(child));
      } else {
        node.childNodes.forEach((child) => collectFromNode(child));
      }
    };

    collectFromNode(root);

    return focusableElements;
  }

  private _focusDrawerContainer() {
    this.drawerContentElement?.focus();
  }

  override render(): TemplateResult {
    const labelledBy = this.getAttribute("aria-labelledby");
    const label = this.getAttribute("aria-label");

    return html`
      <div class="scrim"></div>
      <div
        class="drawer-content"
        role="dialog"
        aria-modal="true"
        aria-hidden="${this.open ? "false" : "true"}"
        ?inert="${!this.open}"
        tabindex="-1"
        aria-labelledby="${labelledBy ? labelledBy : nothing}"
        aria-label="${label ? label : nothing}"
      >
        <slot></slot>
      </div>
    `;
  }
}
