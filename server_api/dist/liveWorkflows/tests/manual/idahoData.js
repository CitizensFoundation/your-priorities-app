import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { apiRoot } from "./environment.js";
export const idahoDirectory = path.join(apiRoot, ".live-workflow-manual/data/idaho");
export const idahoSource = path.join(idahoDirectory, "Idaho Classification CSV.csv");
export const idahoHeaders = [
    "Class Code",
    "Class Title",
    "Pay Schedule",
    "Pay Grade",
    "FLSA Code",
    "Summary",
    "Duties and Responsibilities",
    "Qualifications",
];
export const idahoPopulation = 100;
export const idahoSample = 5;
export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
/** Preserve field contents, including quotes, newlines, Unicode and leading zeros. */
export function idahoSelection(contents) {
    const records = parse(contents, {
        columns: true,
        bom: true,
        skip_empty_lines: true,
        max_record_size: 1000000,
    });
    assert.ok(records.length >= idahoPopulation, "Idaho input needs at least 100 records");
    assert.deepEqual(Object.keys(records[0]), [...idahoHeaders], "Unexpected Idaho CSV columns");
    const rows = records.slice(0, idahoPopulation);
    for (const row of rows) {
        assert.ok(row["Class Code"].trim() && row["Class Title"].trim(), "Missing Idaho class identity");
        assert.ok(row.Summary.trim() || row.Qualifications.trim(), "Missing Idaho description");
    }
    const cell = (value) => `"${value.replaceAll('"', '""')}"`;
    const csv = [idahoHeaders, ...rows.map((row) => idahoHeaders.map((key) => row[key]))]
        .map((row) => row.map(cell).join(","))
        .join("\r\n") + "\r\n";
    return { records: records.length, rows, csv };
}
export async function prepareIdahoData(source = idahoSource, directory = idahoDirectory) {
    const original = await readFile(source);
    const selected = idahoSelection(original.toString("utf8"));
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const localSource = path.join(directory, "Idaho Classification CSV.csv");
    if (path.resolve(source) !== path.resolve(localSource)) {
        try {
            await copyFile(source, localSource, constants.COPYFILE_EXCL);
        }
        catch (error) {
            if (error.code !== "EEXIST")
                throw error;
            assert.equal(sha256(await readFile(localSource)), sha256(original), "The local Idaho original differs; choose a new data directory instead of overwriting it");
        }
    }
    const fixture = path.join(directory, "idaho-first-100.csv");
    await writeFile(fixture, selected.csv, { mode: 0o600 });
    const manifest = {
        source: localSource,
        originalRecords: selected.records,
        sourceSha256: sha256(original),
        fixture,
        selectedRecords: idahoPopulation,
        fixtureSha256: sha256(selected.csv),
        selection: "First 100 parsed records in original file order; header is not a record",
        classCodes: selected.rows.map((row) => row["Class Code"]),
    };
    await writeFile(path.join(directory, "selection.json"), JSON.stringify(manifest, null, 2), { mode: 0o600 });
    return { ...manifest, rows: selected.rows };
}
export function idahoText(row) {
    return idahoHeaders.map((key) => `${key}: ${row[key]}`).join("\n\n");
}
