import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseInput } from "./inputs.js";
// Document parsers run with the same network, memory, CPU and mount restrictions as agents.
const manifest = JSON.parse(await readFile("/input/manifest.json", "utf8"));
let records;
try {
    records = await parseInput("/input/document", manifest.name, manifest.id);
}
catch (error) {
    // Keep infrastructure failures distinct; parser diagnostics can contain source
    // text and internal paths and must not become a browser error response.
    if (["ENOENT", "EACCES", "EIO", "ENOSPC"].includes(String(error?.code)))
        throw error;
    const format = path.extname(manifest.name).slice(1).toUpperCase();
    const guidance = [
        "JSON",
        "CSV",
        "TSV",
        "TXT",
        "MD",
        "HTML",
        "HTM",
        "PDF",
        "DOCX",
    ].includes(format)
        ? `Check that it is a valid ${format} file and upload it again.`
        : "Use JSON, CSV, TSV, text, Markdown, HTML, PDF or DOCX.";
    await writeFile("/output/input-error.json", JSON.stringify({
        message: `Cannot read ${path.basename(manifest.name)}. ${guidance}`,
    }), { mode: 0o600 });
}
if (records)
    await writeFile("/output/records.json", JSON.stringify(records), {
        mode: 0o600,
    });
