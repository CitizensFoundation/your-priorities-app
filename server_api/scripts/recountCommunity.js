const models = require('../models/index.cjs');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');

const recountCommunity = require('../utils/recount_utils.cjs').recountCommunity;

/*
const urlToConfig = "https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/WBMoveIdeas160221.csv"//process.argv[1];
const urlToAddAddFront = "https://kyrgyz-aris.yrpri.org/"; // process.argv[2];
*/

const communityId = process.argv[2];

recountCommunity(communityId, error=>{
  if (error) {
    console.error(error);
  }

  console.log("Done recounting");
  process.exit();
})

