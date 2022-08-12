const models = require('../models');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const inFilePath = "/home/robert/Downloads/hm2021in.csv"; //process.argv[3];
const outFilePath = "/home/robert/Scratch/hm2021PdfsOut.csv"; //process.argv[4];

const pdfBaseUrl = "https://oav-direct-assets.s3.eu-west-1.amazonaws.com/hm2021kjorgognV2/pdfs";

const inFile = fs.readFileSync(inFilePath, 'utf-8');

let records = parse(inFile, {
  columns: false,
  skip_empty_lines: true
});

let outFileContent = "";

for (let i=0;i<records.length;i++) {
  if (records[i].length>4 && records[i][1].length>3) {
    const areaId = records[i][0];
    const areaName = records[i][1];
    const ideaNumber = records[i][2];
    const url = records[i][3];
    const name = records[i][4].replace(/"/g,"'");

    const splitUrl = url.split("/");
    const ideaId = splitUrl[splitUrl.length-1];

    outFileContent += `"${areaName}","${ideaNumber}","${url}","${name}","${pdfBaseUrl}/${areaId}/${ideaId}.pdf"\n`
  }
}

fs.writeFile(outFilePath, outFileContent, function(error) {
  if(error) {
    console.error(error);
    process.exit();
  } else {
    console.log("The file was saved!");
    process.exit();
  }
});

