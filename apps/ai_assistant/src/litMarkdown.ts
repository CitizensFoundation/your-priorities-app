import { directive } from 'lit/directive.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { marked } from 'marked';
import sanitizeHTML from 'sanitize-html';
marked.setOptions({
  // Enable table support
  gfm: true,
});
type Options = typeof MarkdownDirective.defaultOptions;

/**
 * An async directive to render markdown in a LitElement's render function.
 * Images can be included or removed in the executor's options.
 */
export class MarkdownDirective extends AsyncDirective {
  static defaultOptions = {
    includeImages: false,
    includeCodeBlockClassNames: false,
    loadingHTML: '<p>Loading...</p>',
    skipSanitization: false,
  };

  private sanitizeHTMLWithOptions(rawHTML: string, options: Options): string {
    return rawHTML;
    /*   const allowedTags = options.includeImages
      ? [...sanitizeHTML.defaults.allowedTags, "img"]
      : sanitizeHTML.defaults.allowedTags;
    const allowedClasses: sanitizeHTML.IOptions["allowedClasses"] = options.includeCodeBlockClassNames
      ? { code: ["*"] }
      : {};
    return sanitizeHTML(rawHTML, { allowedTags, allowedClasses });*/
  }

  render(rawMarkdown: string, options?: Partial<Options>) {
    const mergedOptions = Object.assign(
      MarkdownDirective.defaultOptions,
      options ?? {}
    );

    new Promise<string>((resolve, reject) => {
      marked.parse(rawMarkdown, (error: any, result: any) => {
        if (error) return reject(error);

        const cssStyles = `
          table {
            border-collapse: collapse;
            width: 100%;
            border-radius: 5px;
            background-color: var(--md-sys-color-tertiary);
            color: var(--md-sys-color-on-tertiary);
          }

          th, td {
            padding: 8px;
            text-align: left;
            vertical-align: top;
          }

          th {
            font-weight: bold;
            background-color: var(--md-sys-color-tertiary-container);
            color: var(--md-sys-color-on-tertiary-container);
          }

          tr:nth-child(even) {
          }

          tr:hover {
          }
        `;

        // Combine the CSS styles with the generated HTML
        const formattedMarkdown = `
            <style>
            ${cssStyles}
          </style>
          ${result}
        `;

        resolve(formattedMarkdown);
      });
    })
      .then(rawHTML => {
        if (mergedOptions.skipSanitization) {
          return Promise.resolve(rawHTML);
        }
        return Promise.resolve(
          this.sanitizeHTMLWithOptions(rawHTML, mergedOptions)
        );
      })
      .then(preparedHTML => {
        const renderedHTML = unsafeHTML(preparedHTML);
        this.setValue(renderedHTML);
      });

    const placeholderHTML = mergedOptions.skipSanitization
      ? mergedOptions.loadingHTML
      : this.sanitizeHTMLWithOptions(mergedOptions.loadingHTML, mergedOptions);
    return unsafeHTML(placeholderHTML);
  }
}

/**
 * An asyn directive used to render markedown in a LitElement's render function.
 *
 * Rendering pictures can be enabled through the settings.
 * Css class names for code blocks may also be enabled through settings.
 *
 * setting the "skipSanitization" option to true will skip the sanitization process and render markdown as raw HTML.
 * _Use with caution!_
 *
 * The default loading html may also be replaced.
 * This default HTML is also sanitized by default.
 * If the "skipSanitization" option is true, the default HTML will also not be sanitized.
 *
 * @example render() {
 *            const rawMarkdown = `# Hello World`
 *            return html`<article>${resolveMarkdown(rawMarkdown)}</article>`
 * }
 *
 * @example render() {
 *            const rawMarkdown = `# Hello World
 *            ![image.jpeg](https://host.com/image.jpeg "image.jpeg")`;
 *            return html`<article>${resolveMarkdown(rawMarkdown, { includeImages: true, includeCodeBlockClassNames: true, loadingHTML: "<loading-icon></loading-icon>" })}</article>`
 * }
 * @typedef {Parameters<InstanceType<typeof MarkdownDirective>['render']>} RenderParameters
 * @param {RenderParameters[0]} rawMarkdown Markdown to be rendered.
 * @param {RenderParameters[1]} options
 */
export const resolveMarkdown = directive(MarkdownDirective);
