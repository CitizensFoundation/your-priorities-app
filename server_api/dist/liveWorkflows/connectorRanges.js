import { ValidationError } from "./services/errors.js";
/** Restrict chunked Sheets writes to the administrator's bound A1 rectangle. */
export function sheetsWriteRange(range, offset, rows) {
    if (!Number.isSafeInteger(offset) || offset < 0 || !rows.length)
        throw new ValidationError("Sheet writes require rows and a nonnegative row offset");
    const match = /^(.*!)?([A-Za-z]+)([1-9][0-9]*)?(?::([A-Za-z]+)([1-9][0-9]*)?)?$/.exec(range);
    if (!match)
        throw new ValidationError("Sheet output bindings require an A1 range, such as Results!A1:G10001");
    const [, sheet = "", firstColumn, startRow, lastColumn = firstColumn, endRow,] = match;
    const column = (value) => [...value.toUpperCase()].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0);
    const width = column(lastColumn) - column(firstColumn) + 1;
    const first = Number(startRow ?? 1) + offset, last = first + rows.length - 1;
    const bound = endRow
        ? Number(endRow)
        : !match[4] && startRow
            ? Number(startRow)
            : Infinity;
    if (!Number.isSafeInteger(last) ||
        width < 1 ||
        rows.some((row) => row.length > width) ||
        last > bound)
        throw new ValidationError("Sheet export exceeds the configured output range");
    return `${sheet}${firstColumn.toUpperCase()}${first}:${lastColumn.toUpperCase()}${last}`;
}
