import { AlignmentType, BorderStyle, Document, ExternalHyperlink, HeadingLevel, Packer, Paragraph, ShadingType, Table, TableCell, TableLayoutType, TableRow, TextRun, UnderlineType, WidthType, } from "docx";
import { lexer } from "marked";
export const MAX_MARKDOWN_REPORT_LENGTH = 1000000;
const MAX_MARKDOWN_NESTING = 16;
const MAX_LINK_LENGTH = 4096;
const BODY_FONT = "Arial";
const CODE_FONT = "Consolas";
const headingLevels = [
    HeadingLevel.HEADING_1,
    HeadingLevel.HEADING_2,
    HeadingLevel.HEADING_3,
    HeadingLevel.HEADING_4,
    HeadingLevel.HEADING_5,
    HeadingLevel.HEADING_6,
];
const namedHtmlEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
};
const stripIllegalXmlCharacters = (value) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
const decodeHtmlEntities = (value) => value.replace(/&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/gi, (entity, decimal, hexadecimal, name) => {
    const numericValue = decimal ?? hexadecimal;
    if (numericValue) {
        const codePoint = Number.parseInt(numericValue, decimal ? 10 : 16);
        if (Number.isInteger(codePoint) &&
            codePoint > 0 &&
            codePoint <= 0x10ffff &&
            !(codePoint >= 0xd800 && codePoint <= 0xdfff)) {
            return String.fromCodePoint(codePoint);
        }
        return "�";
    }
    return name ? namedHtmlEntities[name.toLowerCase()] ?? entity : entity;
});
const htmlToPlainText = (html) => stripIllegalXmlCharacters(decodeHtmlEntities(html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(?:div|h[1-6]|li|ol|p|pre|table|tr|ul)\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")));
const normalizeText = (value) => stripIllegalXmlCharacters(decodeHtmlEntities(value));
const safeExternalUrl = (value) => {
    if (!value || value.length > MAX_LINK_LENGTH) {
        return null;
    }
    try {
        const url = new URL(value);
        if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:") {
            return url.toString();
        }
    }
    catch {
        // Relative and malformed links remain readable text but are not active links.
    }
    return null;
};
const textRuns = (text, style = {}) => {
    const normalized = normalizeText(text);
    const lines = normalized.split(/\r?\n/);
    return lines.map((line, index) => new TextRun({
        text: line,
        break: index === 0 ? undefined : 1,
        bold: style.bold,
        italics: style.italics,
        strike: style.strike,
        font: style.code ? CODE_FONT : BODY_FONT,
        size: style.code ? 20 : undefined,
        shading: style.code
            ? { type: ShadingType.CLEAR, fill: "F3F4F6" }
            : undefined,
    }));
};
const renderInlineTokens = (tokens, style = {}, depth = 0) => {
    if (depth > MAX_MARKDOWN_NESTING) {
        return textRuns("[Content omitted: nesting limit exceeded]");
    }
    const children = [];
    for (const token of tokens) {
        switch (token.type) {
            case "text": {
                const textToken = token;
                children.push(...(textToken.tokens?.length
                    ? renderInlineTokens(textToken.tokens, style, depth + 1)
                    : textRuns(textToken.text, style)));
                break;
            }
            case "escape":
                children.push(...textRuns(token.text, style));
                break;
            case "strong": {
                const strong = token;
                children.push(...renderInlineTokens(strong.tokens, { ...style, bold: true }, depth + 1));
                break;
            }
            case "em": {
                const emphasis = token;
                children.push(...renderInlineTokens(emphasis.tokens, { ...style, italics: true }, depth + 1));
                break;
            }
            case "del": {
                const deleted = token;
                children.push(...renderInlineTokens(deleted.tokens, { ...style, strike: true }, depth + 1));
                break;
            }
            case "codespan":
                children.push(...textRuns(token.text, { ...style, code: true }));
                break;
            case "br":
                children.push(new TextRun({ break: 1 }));
                break;
            case "link": {
                const link = token;
                const href = safeExternalUrl(link.href);
                const label = normalizeText(link.text || link.href);
                if (href) {
                    children.push(new ExternalHyperlink({
                        link: href,
                        children: [
                            new TextRun({
                                text: label,
                                bold: style.bold,
                                italics: style.italics,
                                strike: style.strike,
                                color: "0563C1",
                                underline: { type: UnderlineType.SINGLE },
                            }),
                        ],
                    }));
                }
                else {
                    children.push(...textRuns(label, style));
                }
                break;
            }
            case "image": {
                const image = token;
                const label = `[Image: ${normalizeText(image.text).trim() || "omitted"}]`;
                const href = safeExternalUrl(image.href);
                if (href) {
                    children.push(new ExternalHyperlink({
                        link: href,
                        children: [
                            new TextRun({
                                text: label,
                                italics: true,
                                color: "0563C1",
                                underline: { type: UnderlineType.SINGLE },
                            }),
                        ],
                    }));
                }
                else {
                    children.push(new TextRun({ text: label, italics: true, color: "666666" }));
                }
                break;
            }
            case "html": {
                const html = token;
                if (/^<\s*br\s*\/?\s*>$/i.test(html.text.trim())) {
                    children.push(new TextRun({ break: 1 }));
                }
                else {
                    children.push(...textRuns(htmlToPlainText(html.text), style));
                }
                break;
            }
            case "checkbox": {
                const checkbox = token;
                children.push(...textRuns(checkbox.checked ? "☒ " : "☐ ", style));
                break;
            }
            default: {
                const generic = token;
                if (generic.tokens?.length) {
                    children.push(...renderInlineTokens(generic.tokens, style, depth + 1));
                }
                else if (typeof generic.text === "string") {
                    children.push(...textRuns(generic.text, style));
                }
            }
        }
    }
    return children;
};
const contextParagraphOptions = (context) => {
    const leftIndent = (context.quoteDepth + context.listDepth) * 360;
    return {
        indent: leftIndent > 0 ? { left: leftIndent } : undefined,
        border: context.quoteDepth > 0
            ? {
                left: {
                    style: BorderStyle.SINGLE,
                    color: "B8C2CC",
                    size: 12,
                    space: 8,
                },
            }
            : undefined,
    };
};
const inlineChildrenForBlockToken = (token) => {
    if (token.type === "paragraph") {
        return renderInlineTokens(token.tokens);
    }
    if (token.type === "text") {
        const text = token;
        return text.tokens?.length ? renderInlineTokens(text.tokens) : textRuns(text.text);
    }
    return renderInlineTokens([token]);
};
const renderList = (list, context) => {
    if (context.listDepth > MAX_MARKDOWN_NESTING) {
        return [new Paragraph("[List omitted: nesting limit exceeded]")];
    }
    const children = [];
    const start = typeof list.start === "number" ? list.start : 1;
    list.items.forEach((item, itemIndex) => {
        let emittedMarker = false;
        for (const itemToken of item.tokens) {
            if (itemToken.type === "list") {
                children.push(...renderList(itemToken, {
                    ...context,
                    listDepth: context.listDepth + 1,
                }));
                continue;
            }
            if (itemToken.type !== "text" && itemToken.type !== "paragraph") {
                children.push(...renderBlocks([itemToken], context));
                continue;
            }
            const taskPrefix = item.task ? (item.checked ? "☒ " : "☐ ") : "";
            const marker = list.ordered && !emittedMarker ? `${start + itemIndex}. ` : "";
            const inlineChildren = inlineChildrenForBlockToken(itemToken);
            const paragraphContext = contextParagraphOptions(context);
            children.push(new Paragraph({
                ...paragraphContext,
                children: [
                    ...(marker || taskPrefix
                        ? [new TextRun({ text: `${marker}${taskPrefix}` })]
                        : []),
                    ...inlineChildren,
                ],
                bullet: !list.ordered && !emittedMarker
                    ? { level: Math.min(context.listDepth, 8) }
                    : undefined,
                indent: list.ordered
                    ? {
                        left: 720 + (context.listDepth + context.quoteDepth) * 360,
                        hanging: emittedMarker ? 0 : 360,
                    }
                    : paragraphContext.indent,
                spacing: { after: item.loose ? 120 : 40, line: 276 },
            }));
            emittedMarker = true;
        }
        if (!emittedMarker) {
            children.push(new Paragraph({
                children: list.ordered
                    ? [new TextRun(`${start + itemIndex}.`)]
                    : [new TextRun("")],
                bullet: list.ordered
                    ? undefined
                    : { level: Math.min(context.listDepth, 8) },
            }));
        }
    });
    return children;
};
const tableAlignment = (alignment) => {
    if (alignment === "center")
        return AlignmentType.CENTER;
    if (alignment === "right")
        return AlignmentType.RIGHT;
    return AlignmentType.LEFT;
};
const renderTableCell = (cell) => new TableCell({
    children: [
        new Paragraph({
            children: renderInlineTokens(cell.tokens, { bold: cell.header }),
            alignment: tableAlignment(cell.align),
            spacing: { after: 0 },
        }),
    ],
    shading: cell.header
        ? { type: ShadingType.CLEAR, fill: "E9EEF5" }
        : undefined,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
});
const renderTable = (table) => new Table({
    rows: [
        new TableRow({
            children: table.header.map(renderTableCell),
            tableHeader: true,
        }),
        ...table.rows.map((row) => new TableRow({ children: row.map(renderTableCell) })),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    style: "TableGrid",
});
const renderCodeBlock = (code, context) => new Paragraph({
    ...contextParagraphOptions(context),
    children: textRuns(code.text, { code: true }),
    shading: { type: ShadingType.CLEAR, fill: "F3F4F6" },
    spacing: { before: 100, after: 180, line: 240 },
});
const renderBlocks = (tokens, context = { listDepth: 0, quoteDepth: 0 }) => {
    const children = [];
    for (const token of tokens) {
        switch (token.type) {
            case "space":
            case "def":
                break;
            case "heading": {
                const heading = token;
                const level = headingLevels[Math.min(Math.max(heading.depth, 1), 6) - 1];
                children.push(new Paragraph({
                    ...contextParagraphOptions(context),
                    children: renderInlineTokens(heading.tokens),
                    heading: level,
                    spacing: { before: heading.depth === 1 ? 0 : 180, after: 100 },
                }));
                break;
            }
            case "paragraph": {
                const paragraph = token;
                children.push(new Paragraph({
                    ...contextParagraphOptions(context),
                    children: renderInlineTokens(paragraph.tokens),
                    spacing: { after: 160, line: 276 },
                }));
                break;
            }
            case "text":
                children.push(new Paragraph({
                    ...contextParagraphOptions(context),
                    children: inlineChildrenForBlockToken(token),
                    spacing: { after: 120, line: 276 },
                }));
                break;
            case "code":
                children.push(renderCodeBlock(token, context));
                break;
            case "blockquote": {
                const blockquote = token;
                children.push(...renderBlocks(blockquote.tokens, {
                    ...context,
                    quoteDepth: context.quoteDepth + 1,
                }));
                break;
            }
            case "list":
                children.push(...renderList(token, context));
                break;
            case "table":
                children.push(renderTable(token));
                children.push(new Paragraph({ text: "", spacing: { after: 80 } }));
                break;
            case "hr":
                children.push(new Paragraph({
                    border: {
                        bottom: {
                            style: BorderStyle.SINGLE,
                            color: "B8C2CC",
                            size: 6,
                            space: 1,
                        },
                    },
                    spacing: { before: 80, after: 160 },
                }));
                break;
            case "html": {
                const text = htmlToPlainText(token.text).trim();
                if (text) {
                    children.push(new Paragraph({
                        ...contextParagraphOptions(context),
                        children: textRuns(text),
                        spacing: { after: 160, line: 276 },
                    }));
                }
                break;
            }
            default: {
                const generic = token;
                if (generic.tokens?.length) {
                    children.push(...renderBlocks(generic.tokens, context));
                }
                else if (typeof generic.text === "string" && generic.text.trim()) {
                    children.push(new Paragraph(normalizeText(generic.text)));
                }
            }
        }
    }
    return children;
};
export const markdownToDocx = async (markdown, options = {}) => {
    if (typeof markdown !== "string") {
        throw new TypeError("Markdown report must be a string");
    }
    if (markdown.length > MAX_MARKDOWN_REPORT_LENGTH) {
        throw new RangeError(`Markdown report exceeds ${MAX_MARKDOWN_REPORT_LENGTH} characters`);
    }
    const tokens = lexer(markdown, { gfm: true });
    const children = renderBlocks(tokens);
    if (children.length === 0) {
        children.push(new Paragraph(""));
    }
    const document = new Document({
        creator: normalizeText(options.creator ?? "Your Priorities"),
        title: normalizeText(options.title ?? "Agent report"),
        description: "Generated from a Your Priorities Markdown report",
        styles: {
            default: {
                document: {
                    run: { font: BODY_FONT, size: 22 },
                    paragraph: { spacing: { line: 276, after: 160 } },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
                    },
                },
                children,
            },
        ],
    });
    return Packer.toBuffer(document);
};
