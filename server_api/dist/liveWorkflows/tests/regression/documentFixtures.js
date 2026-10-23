import { Document, Packer, Paragraph } from "docx";
/** A real, single-page PDF with a cross-reference table and selectable text. */
function textPdf(lines) {
    const escape = (text) => text.replace(/[\\()]/g, "\\$&");
    const commands = `BT /F1 12 Tf 50 740 Td 18 TL ${lines.map((line, index) => `${index ? "T* " : ""}(${escape(line)}) Tj`).join("\n")} ET`;
    const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        `<< /Length ${Buffer.byteLength(commands)} >>\nstream\n${commands}\nendstream`,
    ];
    let contents = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
        offsets.push(Buffer.byteLength(contents));
        contents += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xref = Buffer.byteLength(contents);
    contents += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
    contents += offsets
        .slice(1)
        .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
        .join("");
    contents += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return Buffer.from(contents);
}
export async function documentFixtures() {
    const pdfLines = [
        "Library Program Assistant",
        "Help residents register for programs.",
        "No college degree is required.",
    ];
    const docxLines = [
        "Programme assistant — Reykjavík",
        "Explain café opening hours and maintain records.",
        "Experience is accepted instead of a degree.",
    ];
    const rows = [
        {
            id: "00042",
            name: 'Records, "Assistant"',
            text: "First line\nSecond line: café — Reykjavík",
            titleCode: "00007",
        },
        {
            id: "00043",
            name: "Second role",
            text: "No degree is required.",
            titleCode: "00007",
        },
    ];
    const quote = (value) => `"${value.replaceAll('"', '""')}"`;
    return [
        { name: "library.pdf", buffer: textPdf(pdfLines), expectedText: pdfLines },
        {
            name: "programme.docx",
            buffer: await Packer.toBuffer(new Document({
                sections: [
                    { children: docxLines.map((text) => new Paragraph(text)) },
                ],
            })),
            expectedText: docxLines,
        },
        {
            name: "quoted-jobs.csv",
            buffer: Buffer.from("\uFEFFid,name,text,titleCode\r\n" +
                rows
                    .map((row) => Object.values(row).map(quote).join(","))
                    .join("\r\n")),
            expectedRows: rows,
        },
        {
            name: "jobs.tsv",
            buffer: Buffer.from("id\tname\ttext\n00002\tAssistant\tRecord public questions."),
            expectedRows: [
                { id: "00002", name: "Assistant", text: "Record public questions." },
            ],
        },
        {
            name: "description.txt",
            buffer: Buffer.from("Answer public questions. No degree is required."),
            expectedText: ["Answer public questions. No degree is required."],
        },
        {
            name: "description.html",
            buffer: Buffer.from('<html><style>.secret { display:none }</style><script>throw new Error("must-not-run")</script><body><h1>Library assistant</h1><p>Welcome residents.</p></body></html>'),
            expectedText: ["Library assistant", "Welcome residents."],
        },
    ];
}
export const malformedDocuments = [
    {
        name: "broken.csv",
        buffer: Buffer.from('id,name,text\n1,Assistant,"unfinished'),
    },
    { name: "broken.json", buffer: Buffer.from('{"jobs": [') },
    { name: "broken.pdf", buffer: Buffer.from("%PDF-1.4\nnot a valid document") },
    {
        name: "broken.docx",
        buffer: Buffer.from("PK\x03\x04not a valid zip archive"),
    },
];
