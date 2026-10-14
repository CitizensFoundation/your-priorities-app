"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { PassThrough } = require("node:stream");
const Excel = require("exceljs");

const { writeStreamingWorkbook } = require("../utils/xlsStreamWorkbook.cjs");

function collect(stream) {
  const chunks = [];
  stream.on("data", (chunk) => chunks.push(chunk));
  return new Promise((resolve, reject) => {
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

async function load(buffer) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(buffer);
  return workbook;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const postColumns = [
  { header: "Post Id", key: "postId", width: 15 },
  { header: "Post name", key: "postName", width: 45, style: { numFmt: "@" } },
  { header: "Points For", key: "pointsFor", width: 55, style: { numFmt: "@" } },
];

const pointColumns = [
  { header: "Post Id", key: "postId", width: 15 },
  { header: "Content", key: "content", width: 150 },
];

function twoSheets() {
  return [
    {
      name: "Posts",
      columns: postColumns,
      wrapKeys: ["pointsFor"],
      addRows: async (worksheet, commit) => {
        worksheet.addRow({ postId: 1, postName: "First", pointsFor: "a\nb" });
        await commit();
        worksheet.addRow({ postId: 2, postName: "Second", pointsFor: "c" });
        await commit();
      },
    },
    {
      name: "Points",
      columns: pointColumns,
      addRows: async (worksheet, commit) => {
        worksheet.addRow({ postId: 1, content: "A point" });
        await commit();
      },
    },
  ];
}

function manyRows(count, onRow = () => {}) {
  return {
    name: "Posts",
    columns: pointColumns,
    addRows: async (worksheet, commit) => {
      for (let i = 0; i < count; i++) {
        worksheet.addRow({ postId: i, content: `Point text number ${i} `.repeat(20) });
        await commit();
        onRow(i + 1);
      }
    },
  };
}

test("writes each sheet in order with its headers and rows", async () => {
  const stream = new PassThrough();
  const bytes = collect(stream);
  await writeStreamingWorkbook(stream, twoSheets());
  const workbook = await load(await bytes);

  assert.deepEqual(workbook.worksheets.map((ws) => ws.name), ["Posts", "Points"]);

  const posts = workbook.getWorksheet("Posts");
  assert.deepEqual(posts.getRow(1).values.slice(1), ["Post Id", "Post name", "Points For"]);
  assert.deepEqual(posts.getRow(2).values.slice(1), [1, "First", "a\nb"]);
  assert.deepEqual(posts.getRow(3).values.slice(1), [2, "Second", "c"]);
  assert.equal(posts.rowCount, 3);

  const points = workbook.getWorksheet("Points");
  assert.deepEqual(points.getRow(1).values.slice(1), ["Post Id", "Content"]);
  assert.deepEqual(points.getRow(2).values.slice(1), [1, "A point"]);
});

test("makes the header bold and wraps only the wrap columns", async () => {
  const stream = new PassThrough();
  const bytes = collect(stream);
  await writeStreamingWorkbook(stream, twoSheets());
  const posts = (await load(await bytes)).getWorksheet("Posts");

  for (let col = 1; col <= 3; col++) {
    assert.equal(posts.getRow(1).getCell(col).font?.bold, true, `header column ${col}`);
  }
  for (const rowNumber of [1, 2, 3]) {
    const row = posts.getRow(rowNumber);
    assert.deepEqual(row.getCell(3).alignment, { vertical: "top", wrapText: true });
    assert.equal(row.getCell(1).alignment?.wrapText, undefined);
    assert.equal(row.getCell(2).alignment?.wrapText, undefined);
  }
});

test("keeps the text number format on text columns", async () => {
  const stream = new PassThrough();
  const bytes = collect(stream);
  await writeStreamingWorkbook(stream, twoSheets());
  const posts = (await load(await bytes)).getWorksheet("Posts");

  assert.equal(posts.getRow(2).getCell(2).numFmt, "@");
  assert.equal(posts.getRow(2).getCell(3).numFmt, "@");
});

test("records the creator given", async () => {
  const stream = new PassThrough();
  const bytes = collect(stream);
  await writeStreamingWorkbook(stream, twoSheets(), { creator: "Test creator" });

  assert.equal((await load(await bytes)).creator, "Test creator");
});

test("cuts sheet names to the 31 characters Excel allows", async () => {
  const stream = new PassThrough();
  const bytes = collect(stream);
  await writeStreamingWorkbook(stream, [
    { name: "Posts - " + "x".repeat(40), columns: pointColumns, addRows: async () => {} },
  ]);
  const workbook = await load(await bytes);

  assert.equal(workbook.worksheets[0].name, "Posts - " + "x".repeat(23));
});

test("drops apostrophes Excel does not allow at either end of a sheet name", async () => {
  const stream = new PassThrough();
  const bytes = collect(stream);
  // The cut at 31 characters lands just after the apostrophe.
  await writeStreamingWorkbook(stream, [
    { name: "Posts - " + "x".repeat(22) + "'s ideas", columns: pointColumns, addRows: async () => {} },
  ]);
  const workbook = await load(await bytes);

  assert.equal(workbook.worksheets[0].name, "Posts - " + "x".repeat(22));
});

test("streams rows out before the workbook is finished", async () => {
  const stream = new PassThrough();
  let bytesBeforeRows = 0;
  let bytesBeforeRowsDone = 0;
  let received = 0;
  const bytes = collect(stream);
  stream.on("data", (chunk) => {
    received += chunk.length;
  });

  await writeStreamingWorkbook(stream, [
    {
      name: "Posts",
      columns: pointColumns,
      addRows: async (worksheet, commit) => {
        await wait(50);
        bytesBeforeRows = received;
        for (let i = 0; i < 20000; i++) {
          worksheet.addRow({ postId: i, content: `Point text number ${i}` });
          await commit();
        }
        bytesBeforeRowsDone = received;
      },
    },
  ]);

  // The writer emits its fixed preamble files up front, so only bytes that
  // leave while rows are being added show the rows themselves are streamed.
  assert.ok(
    bytesBeforeRowsDone > bytesBeforeRows,
    `no row bytes left before the rows were done (${bytesBeforeRows} -> ${bytesBeforeRowsDone})`
  );
  const posts = (await load(await bytes)).getWorksheet("Posts");
  assert.equal(posts.rowCount, 20001);
});

test("stops adding rows while the reader is behind, then finishes", async () => {
  const total = 20000;
  let added = 0;
  const stream = new PassThrough();

  const writing = writeStreamingWorkbook(stream, [manyRows(total, (n) => (added = n))]);
  await wait(300);

  assert.ok(added < total, `added all ${total} rows with nothing reading the output`);
  const addedWhileBlocked = added;
  await wait(100);
  assert.equal(added, addedWhileBlocked, "kept adding rows while the reader was stopped");

  const bytes = collect(stream);
  await writing;
  assert.equal(added, total);
  const posts = (await load(await bytes)).getWorksheet("Posts");
  assert.equal(posts.rowCount, total + 1);
});

test("stops and rejects when the stream is destroyed while rows are added", async () => {
  const total = 20000;
  let added = 0;
  const stream = new PassThrough();
  stream.resume();
  const failure = new Error("upload failed");

  const writing = writeStreamingWorkbook(stream, [
    manyRows(total, (n) => {
      added = n;
      if (n === 100) stream.destroy(failure);
    }),
  ]);

  await assert.rejects(writing, failure);
  assert.ok(added < 200, `kept adding rows after the stream was destroyed (${added})`);
});

test("rejects rather than hangs when the stream is destroyed while finishing", async () => {
  const stream = new PassThrough();
  stream.resume();
  const failure = new Error("upload failed");

  const writing = writeStreamingWorkbook(stream, [
    {
      name: "Posts",
      columns: pointColumns,
      addRows: async (worksheet, commit) => {
        worksheet.addRow({ postId: 1, content: "Last row" });
        await commit();
        stream.destroy(failure);
      },
    },
  ]);

  const outcome = await Promise.race([
    writing.then(() => "resolved", (error) => error),
    wait(2000).then(() => "hung"),
  ]);
  assert.equal(outcome, failure);
});

test("rejects rather than hangs when the stream is already destroyed", async () => {
  const stream = new PassThrough();
  const failure = new Error("upload failed");
  stream.on("error", () => {});
  stream.destroy(failure);
  await wait(10);

  const writing = writeStreamingWorkbook(stream, [
    { name: "Posts", columns: pointColumns, addRows: async () => {} },
  ]);
  const outcome = await Promise.race([
    writing.then(() => "resolved", (error) => error),
    wait(2000).then(() => "hung"),
  ]);
  assert.equal(outcome, failure);
});

test("holds no memory per committed row once it is written", async () => {
  require("node:v8").setFlagsFromString("--expose-gc");
  const gc = require("node:vm").runInNewContext("gc");
  const heapAfter = (rows) => {
    let sampled;
    const stream = new PassThrough();
    stream.resume();
    return writeStreamingWorkbook(stream, [
      {
        name: "Posts",
        columns: pointColumns,
        addRows: async (worksheet, commit) => {
          for (let i = 0; i < rows; i++) {
            worksheet.addRow({ postId: i, content: "x" });
            await commit();
          }
          gc();
          sampled = process.memoryUsage().heapUsed;
        },
      },
    ]).then(() => sampled);
  };

  const small = await heapAfter(20000);
  const large = await heapAfter(120000);
  const growthMB = (large - small) / 1048576;
  // A few hundred bytes kept per commit would be 25 MB or more here.
  assert.ok(growthMB < 8, `heap grew ${growthMB.toFixed(1)} MB for 100,000 more rows`);
});

test("rejects and destroys the stream when adding rows fails, with no error listener", async () => {
  const stream = new PassThrough();
  stream.resume();
  const failure = new Error("row failure");

  await assert.rejects(
    writeStreamingWorkbook(stream, [
      {
        name: "Posts",
        columns: pointColumns,
        addRows: async () => {
          throw failure;
        },
      },
    ]),
    failure
  );
  await wait(10);
  assert.equal(stream.destroyed, true);
  assert.equal(stream.errored, failure);
});
