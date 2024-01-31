import { directive } from 'lit/directive.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { marked } from 'marked';
marked.setOptions({
    // Enable table support
    gfm: true,
});
//TODO: Add target = _blank to links
/**
 * An async directive to render markdown in a LitElement's render function.
 * Images can be included or removed in the executor's options.
 */
export class MarkdownDirective extends AsyncDirective {
    constructor() {
        super(...arguments);
        this.inJsonBlock = false;
        this.hasCompletedJsonParsing = false;
    }
    handleJsonBlocks(rawMarkdown, targetElement) {
        const startJsonBlockRegex = /```json/g;
        let startIndex, endIndex;
        if (!rawMarkdown)
            return;
        startIndex = rawMarkdown.indexOf("```json");
        if (!this.inJsonBlock) {
            if (startIndex !== -1) {
                this.inJsonBlock = true;
                targetElement.fire('jsonLoadingStart');
                rawMarkdown = rawMarkdown.substring(startIndex);
            }
        }
        else if (this.inJsonBlock) {
            endIndex = rawMarkdown.indexOf('```', startIndex + 6);
            if (endIndex !== -1) {
                let jsonContent = rawMarkdown.substring(startIndex + 7, endIndex).trim();
                if (!this.hasCompletedJsonParsing) {
                    targetElement.fire('jsonLoadingEnd', { jsonContent });
                }
                this.hasCompletedJsonParsing = true;
                rawMarkdown = rawMarkdown.substring(0, startIndex);
            }
            else {
                // If the end of the JSON block is not found, process the entire chunk as JSON.
                targetElement.fire('jsonPartialContent', { jsonContent: rawMarkdown.substring(6).trim() });
                rawMarkdown = rawMarkdown.substring(0, startIndex);
            }
        }
        return rawMarkdown;
    }
    sanitizeHTMLWithOptions(rawHTML, options) {
        return rawHTML;
        /*   const allowedTags = options.includeImages
          ? [...sanitizeHTML.defaults.allowedTags, "img"]
          : sanitizeHTML.defaults.allowedTags;
        const allowedClasses: sanitizeHTML.IOptions["allowedClasses"] = options.includeCodeBlockClassNames
          ? { code: ["*"] }
          : {};
        return sanitizeHTML(rawHTML, { allowedTags, allowedClasses });*/
    }
    closeCodeBlockIfNeeded(rawMarkdown) {
        const codeBlockDelimiterCount = (rawMarkdown.match(new RegExp('```', 'g')) || []).length;
        // If there is an odd number of code block delimiters, add one to close the last code block
        if (codeBlockDelimiterCount % 2 !== 0) {
            rawMarkdown += "\n```";
        }
        return rawMarkdown;
    }
    removeCitations(rawMarkdown) {
        const regex = /<code>(.*?)<\/code>/g;
        const output = rawMarkdown.replace(regex, (match, p1) => {
            const innerRegex = /<span class="postCitation">(\d+)<\/span>/g;
            const cleanedContent = p1.replace(innerRegex, '');
            return `<code>${cleanedContent}</code>`;
        });
        return output;
    }
    render(rawMarkdown, options) {
        const mergedOptions = Object.assign(MarkdownDirective.defaultOptions, options ?? {});
        if (options && options.handleJsonBlocks && options.targetElement && rawMarkdown) {
            rawMarkdown = this.handleJsonBlocks(rawMarkdown, options.targetElement);
        }
        if (rawMarkdown) {
            rawMarkdown = this.closeCodeBlockIfNeeded(rawMarkdown);
        }
        //rawMarkdown = this.removeCitations(rawMarkdown);
        if (!rawMarkdown) {
            rawMarkdown = '';
        }
        new Promise((resolve, reject) => {
            //@ts-ignore
            marked.parse(rawMarkdown, (error, result) => {
                if (error)
                    return reject(error);
                const cssStyles = `
          table {
            border-collapse: collapse;
            border-radius: 5px;
            background-color: var(--md-sys-color-primary-container);
            color: var(--md-sys-color-on-primary-container);
            margin: 16px;
            width: 100%;
          }

          img {
            width: 200px;
            height: 113px;
            object-fit: cover;
          }


          ol {
            margin: 8px;
          }

          @media (max-width: 800px) {
            ol {
              padding: 0px;
            }
          }

          th, td {
            padding: 8px;
            text-align: left;
            vertical-align: top;
          }

          th {
            font-weight: bold;
            background-color: var(--md-sys-color-primary-container);
            color: var(--md-sys-color-on-primary-container);
          }

          tr:nth-child(even) {
          }

          tr:hover {
          }

          p {
            margin-top: 8px;
            margin-bottom: 8px;
          }

          pre {
            white-space: pre-wrap;
            white-space: -moz-pre-wrap;
          }

          a {
            color: var(--md-sys-color-primary);
            font-weight: bold;
          }
        `;
                // Combine the CSS styles with the generated HTML
                let formattedMarkdown = `
            <style>
            ${cssStyles}
          </style>
          ${result}
        `;
                resolve(formattedMarkdown);
            });
        })
            .then(rawHTML => {
            rawHTML = rawHTML.replace(/<a href="/g, '<a target="_blank" href="');
            if (mergedOptions.skipSanitization) {
                return Promise.resolve(rawHTML);
            }
            return Promise.resolve(this.sanitizeHTMLWithOptions(rawHTML, mergedOptions));
        })
            .then(preparedHTML => {
            let renderedHTML = unsafeHTML(preparedHTML);
            this.setValue(renderedHTML);
        });
        const placeholderHTML = mergedOptions.skipSanitization
            ? mergedOptions.loadingHTML
            : this.sanitizeHTMLWithOptions(mergedOptions.loadingHTML, mergedOptions);
        return unsafeHTML(placeholderHTML);
    }
}
MarkdownDirective.defaultOptions = {
    includeImages: false,
    includeCodeBlockClassNames: false,
    loadingHTML: '<p>Loading...</p>',
    skipSanitization: false,
    handleJsonBlocks: false,
    targetElement: undefined
};
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
//# sourceMappingURL=litMarkdown.js.map