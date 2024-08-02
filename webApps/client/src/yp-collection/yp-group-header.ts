import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpCollectionHeader } from "./yp-collection-header";

@customElement("yp-group-header")
export class YpGroupHeader extends YpCollectionHeader {
  @property({ type: Object })
  override collection: YpGroupData | undefined;

  static override get styles() {
    return [
      super.styles,
      css`

      `,
    ];
  }
}
