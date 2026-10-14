import ExcelJS from "exceljs";
import { z } from "zod";
import { ValidationError } from "./services/errors.js";

export const WORKBOOK_SPEC_CONTENT_TYPE = "application/vnd.yrpri.workbook+json";
export const XLSX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const cell = z.union([z.string(), z.number().finite(), z.boolean(), z.null()]);
const schema = z
  .object({
    version: z.literal(1),
    sheets: z
      .array(
        z
          .object({
            name: z
              .string()
              .min(1)
              .max(31)
              .regex(/^[^\\/*?:\[\]]+$/),
            rows: z.array(z.array(cell).max(128)).min(1).max(20_000),
            headerRows: z.number().int().min(1).max(2),
            widths: z.array(z.number().min(8).max(120)).min(1).max(128),
          })
          .strict(),
      )
      .min(1)
      .max(12),
  })
  .strict();

/** Excel's 32,767 UTF-16 cell limit must not silently truncate uploaded documents. */
export function excelTextParts(value: string): string[] {
  const parts: string[] = [];
  let start = 0;
  while (start < value.length) {
    let end = Math.min(start + 30_000, value.length);
    const last = value.charCodeAt(end - 1);
    if (end < value.length && last >= 0xd800 && last <= 0xdbff) end--;
    parts.push(value.slice(start, end));
    start = end;
  }
  return parts;
}

/** The VM supplies scalar table data only. Credentials, files and formulas are never accepted. */
export async function renderWorkbook(content: string): Promise<Buffer> {
  if (Buffer.byteLength(content) > 10_000_000)
    throw new ValidationError(
      "Workbook description exceeds 10 MB; export smaller parts",
    );
  let value: unknown;
  try {
    value = JSON.parse(content);
  } catch {
    throw new ValidationError("Invalid workbook JSON");
  }
  const parsed = schema.safeParse(value);
  if (!parsed.success)
    throw new ValidationError("Invalid workbook table description");
  const spec = parsed.data;
  let cells = 0;
  const names = new Set<string>(["long cell text"]);
  for (const sheet of spec.sheets) {
    const key = sheet.name.toLowerCase();
    if (
      names.has(key) ||
      sheet.rows.length < sheet.headerRows ||
      sheet.rows.some((row) => row.length > sheet.widths.length)
    )
      throw new ValidationError("Invalid or duplicate workbook sheet layout");
    names.add(key);
    // Charge the entire rectangular layout, including sparse rows.
    cells += sheet.rows.length * sheet.widths.length;
  }
  if (cells > 500_000)
    throw new ValidationError(
      "Workbook exceeds 500,000 cells; export smaller parts",
    );
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Your Priorities Live Workflows";
  // No timestamps or volatile formulas: a replay represents the same data.
  workbook.created = workbook.modified = new Date("2000-01-01T00:00:00.000Z");
  const overflow: (string | number)[][] = [
    [
      "Sheet",
      "Row",
      "Column",
      "Part",
      "Text (concatenate parts without separators)",
    ],
  ];
  const tables = spec.sheets.map((sheet) => ({
    ...sheet,
    rows: sheet.rows.map((row, index) =>
      row.map((value, column) => {
        if (typeof value !== "string" || value.length <= 32_767) return value;
        const parts = excelTextParts(value);
        parts.forEach((part, partIndex) =>
          overflow.push([
            sheet.name,
            index + 1,
            column + 1,
            partIndex + 1,
            part,
          ]),
        );
        return `[Full text: Long cell text sheet, source row ${index + 1}, column ${column + 1}; ${parts.length} parts]`;
      }),
    ),
  }));
  if (overflow.length > 1)
    tables.push({
      name: "Long cell text",
      rows: overflow,
      headerRows: 1,
      widths: [32, 12, 12, 12, 110],
    });
  for (const table of tables) {
    const sheet = workbook.addWorksheet(table.name, {
      views: [
        {
          state: "frozen",
          ySplit: table.headerRows,
          xSplit: 2,
          showGridLines: false,
        },
      ],
      pageSetup: {
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        printTitlesRow: `1:${table.headerRows}`,
      },
    });
    sheet.columns = table.widths.map((width) => ({ width }));
    // ExcelJS treats primitive strings (including =...) as text, never formulas.
    sheet.addRows(table.rows);
    sheet.autoFilter = {
      from: { row: table.headerRows, column: 1 },
      to: {
        row: Math.max(table.headerRows, table.rows.length),
        column: table.widths.length,
      },
    };
    sheet.eachRow((row, index) => {
      const header = index <= table.headerRows;
      row.height = header ? (index === table.headerRows ? 54 : 90) : 72;
      row.eachCell((cell) => {
        cell.font = {
          name: "Calibri",
          size: header ? 10 : 11,
          bold: header,
          color: { argb: header ? "FFFFFFFF" : "FF19384A" },
        };
        cell.alignment = { vertical: "top", wrapText: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: header
              ? index === table.headerRows
                ? "FF173B57"
                : "FF32596C"
              : index % 2
                ? "FFF1F6F8"
                : "FFFFFFFF",
          },
        };
      });
    });
  }
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
