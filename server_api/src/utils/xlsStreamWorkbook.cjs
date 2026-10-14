"use strict";

const Excel = require("exceljs");

const WRAP_ALIGNMENT = { vertical: "top", wrapText: true };
// Excel rejects longer sheet names, and names that start or end with an
// apostrophe; unlike the in-memory Workbook, the streaming writer checks
// neither.
const MAX_SHEET_NAME_LENGTH = 31;

const sheetName = (name) =>
  name.substring(0, MAX_SHEET_NAME_LENGTH).replace(/^'+|'+$/g, "");

// Write an xlsx to a stream without holding the workbook in memory. Each sheet's
// addRows(worksheet, commit) adds rows with worksheet.addRow and awaits commit()
// to write out and free everything added so far. commit() also waits while the
// reader is behind, so rows are only built as fast as the output is consumed,
// and rejects once the stream has been destroyed, so a failed upload stops the
// writer. Sheets are written one after the other: the zip takes one entry at a
// time, so a second sheet written while the first is open would be buffered
// whole until the first is finished. Formatting is set through column styles
// because a committed row can no longer be changed. options.creator is
// recorded in the file's properties.
async function writeStreamingWorkbook(stream, sheets, options = {}) {
  const closedError = () =>
    stream.errored || new Error("Output closed before the workbook was finished");

  // Settles only if the output is destroyed or errors before the zip has been
  // written in full; a normal end closes the stream too. Raced once, against
  // the final commit: racing it on every row would leave a reaction on it per
  // row for the whole export.
  const closed = new Promise((resolve, reject) => {
    stream.once("close", () => {
      if (stream.errored || !stream.writableFinished) reject(closedError());
    });
  });
  closed.catch(() => {});

  // Resolves on drain or close, and removes both listeners either way.
  const drainedOrClosed = () =>
    new Promise((resolve) => {
      const done = () => {
        stream.off("drain", done);
        stream.off("close", done);
        resolve();
      };
      stream.on("drain", done);
      stream.on("close", done);
    });

  const outputReady = async () => {
    if (stream.writableNeedDrain) {
      await drainedOrClosed();
    } else {
      // Give the zip a turn to compress what has been committed.
      await new Promise(setImmediate);
    }
    if (stream.destroyed) throw closedError();
  };

  try {
    if (stream.destroyed) throw closedError();

    const workbook = new Excel.stream.xlsx.WorkbookWriter({
      stream,
      creator: options.creator,
      useStyles: true,
      useSharedStrings: false,
    });

    for (const sheet of sheets) {
      const worksheet = workbook.addWorksheet(sheetName(sheet.name));
      const wrapKeys = sheet.wrapKeys || [];
      worksheet.columns = sheet.columns.map((column) =>
        wrapKeys.includes(column.key)
          ? { ...column, style: { ...column.style, alignment: WRAP_ALIGNMENT } }
          : column
      );
      worksheet.getRow(1).font = { bold: true };

      await sheet.addRows(worksheet, async () => {
        const lastRow = worksheet.lastRow;
        if (lastRow) lastRow.commit();
        await outputReady();
      });
      worksheet.commit();
    }

    await Promise.race([workbook.commit(), closed]);
  } catch (error) {
    stream.destroy(error);
    throw error;
  }
}

module.exports = { writeStreamingWorkbook };
