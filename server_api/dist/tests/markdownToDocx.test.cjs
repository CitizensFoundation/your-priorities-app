"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const Module = require("node:module");
const ts = require("typescript");
const JSZip = require("jszip");
const rendererPath = path.resolve(__dirname, "../utils/markdownToDocx.ts");
const loadRenderer = () => {
    const source = fs.readFileSync(rendererPath, "utf8");
    const output = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2020,
            esModuleInterop: true,
        },
        fileName: rendererPath,
    }).outputText;
    const module = { exports: {} };
    const localRequire = Module.createRequire(rendererPath);
    const compiled = vm.runInThisContext(Module.wrap(output), {
        filename: rendererPath,
    });
    compiled(module.exports, localRequire, module, rendererPath, path.dirname(rendererPath));
    return module.exports;
};
const unpackDocument = async (buffer) => {
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml").async("string");
    const relationshipsXml = await zip
        .file("word/_rels/document.xml.rels")
        .async("string");
    return { zip, documentXml, relationshipsXml };
};
test("renders the supported Markdown structures as a DOCX document", async () => {
    const { markdownToDocx } = loadRenderer();
    const markdown = `# Report

Paragraph with **bold**, *italic*, ~~deleted~~, and \`inline code\`.

[Safe link](https://example.com/report) and [unsafe link](javascript:alert).

- First bullet
- Second bullet
  - Nested bullet

3. Third
4. Fourth

> Quoted **content**

| Name | Value |
| --- | ---: |
| Alpha | 42 |

\`\`\`ts
const answer = 42;
\`\`\`

---
`;
    const buffer = await markdownToDocx(markdown, { title: "Test report" });
    assert.ok(Buffer.isBuffer(buffer));
    assert.equal(buffer.subarray(0, 2).toString(), "PK");
    const { documentXml, relationshipsXml } = await unpackDocument(buffer);
    assert.match(documentXml, />Report</);
    assert.match(documentXml, /<w:b\/>/);
    assert.match(documentXml, /<w:i\/>/);
    assert.match(documentXml, /<w:strike\/>/);
    assert.match(documentXml, /<w:tbl>/);
    assert.match(documentXml, /const answer = 42;/);
    assert.match(documentXml, />3\. </);
    assert.match(relationshipsXml, /https:\/\/example\.com\/report/);
    assert.doesNotMatch(relationshipsXml, /javascript:/i);
});
test("keeps report images as links and never embeds image data", async () => {
    const { markdownToDocx } = loadRenderer();
    const markdown = `![Chart](https://example.com/chart.png)

![Inline data](data:image/png;base64,AAAA)

<img src="https://example.com/raw.png" alt="Raw">`;
    const buffer = await markdownToDocx(markdown);
    const { zip, documentXml, relationshipsXml } = await unpackDocument(buffer);
    assert.match(documentXml, /Image: Chart/);
    assert.match(documentXml, /Image: Inline data/);
    assert.match(relationshipsXml, /https:\/\/example\.com\/chart\.png/);
    assert.doesNotMatch(relationshipsXml, /data:image/i);
    assert.equal(Object.keys(zip.files).some((name) => name.startsWith("word/media/")), false);
    assert.doesNotMatch(documentXml, /<w:drawing>/);
});
test("rejects oversized reports before parsing them", async () => {
    const { MAX_MARKDOWN_REPORT_LENGTH, markdownToDocx } = loadRenderer();
    await assert.rejects(markdownToDocx("x".repeat(MAX_MARKDOWN_REPORT_LENGTH + 1)), /exceeds 1000000 characters/);
});
