"use strict";
let express = require("express");
let router = express.Router();
let log = require("../utils/logger.cjs");
let toJson = require("../utils/to_json.cjs");
let path = require("path");
let fs = require("fs");
const { getSharingParameters, getFullUrl, getSplitUrl, } = require("../utils/sharing_parameters.cjs");
const models = require("../models/index.cjs");
let replaceForBetterReykjavik = function (data) {
    return data.replace(/XmanifestPathX/g, "manifest_br");
};
let replaceForBetterReykjavikFallback = function (data) {
    data = data.replace(/XappNameX/g, "Betri Reykjavík");
    data = data.replace(/XdescriptionX/g, "Betri Reykjavík er samráðsverkefni Reykjavíkurborgar, Íbúa ses og Reykvíkinga.");
    return data;
};
let replaceForBetterIceland = function (data) {
    return data.replace(/XmanifestPathX/g, "manifest_bi");
};
let replaceForBetterIcelandFallback = function (data) {
    data = data.replace(/XappNameX/g, "Betra Ísland");
    data = data.replace(/XdescriptionX/g, "Betra Ísland er samráðsvefur fyrir alla Íslendinga");
    return data;
};
let replaceForYrpri = function (data) {
    return data.replace(/XmanifestPathX/g, "manifest_yp");
};
let replaceForYrpriFallback = function (data) {
    data = data.replace(/XappNameX/g, "Your Priorities");
    data = data.replace(/XdescriptionX/g, "Citizen participation application");
    return data;
};
let replaceForEngageBritain = function (data) {
    return data.replace(/XmanifestPathX/g, "manifest_eb");
};
let replaceForEngageBritainFallback = function (data) {
    data = data.replace(/XappNameX/g, "Engage Britain");
    data = data.replace(/XdescriptionX/g, "Engage Britain is a fully independent charity that brings people together to tackle our country’s biggest challenges.");
    return data;
};
let replaceForMyCityChallenge = function (data) {
    return data.replace(/XmanifestPathX/g, "manifest_my_city_challenge");
};
let replaceForMyCityChallengeFallback = function (data) {
    data = data.replace(/XappNameX/g, "My City Challenge");
    data = data.replace(/XdescriptionX/g, "My City Challenge");
    return data;
};
let replaceForTarsalgo = function (data) {
    return data.replace(/XmanifestPathX/g, "manifest_tarsalgo");
};
let replaceForTarsalgoFallback = function (data) {
    data = data.replace(/XappNameX/g, "társalgó");
    data = data.replace(/XdescriptionX/g, "tarsalgo.net");
    return data;
};
let replaceForOpenMontana = function (data) {
    return data.replace(/XmanifestPathX/g, "manifest_open_montana");
};
let replaceForOpenMontanaFallback = function (data) {
    data = data.replace(/XappNameX/g, "Open Montana");
    data = data.replace(/XdescriptionX/g, "For transparent, participatory, and collaborative governance.");
    return data;
};
let replaceForParlScot = function (data) {
    return data.replace(/XmanifestPathX/g, "manifest_parlscott");
};
let replaceForParlScotFallback = function (data) {
    data = data.replace(/XappNameX/g, "Engage - Scottish Parliament");
    data = data.replace(/XdescriptionX/g, "Engage with the Scottish Parliament");
    return data;
};
let replaceForJungesWien = function (data) {
    return data.replace(/XmanifestPathX/g, "manifest_junges_wien");
};
let replaceForJungesWienFallback = function (data) {
    data = data.replace(/XappNameX/g, "Junges Wien");
    data = data.replace(/XdescriptionX/g, "Die Junges Wien - Plattform dient der Stadt Wien zur Ideen-Einreichung und zur Projektabstimmung für die erste partizipative Wiener Kinder- und Jugendmillion. #jungeswien");
    return data;
};
let replaceForSmarterNJ = function (data) {
    return data.replace(/XmanifestPathX/g, "manifest_smarternj");
};
let replaceForSmarterNJFallback = function (data) {
    data = data.replace(/XappNameX/g, "SmarterNJ");
    data = data.replace(/XdescriptionX/g, "SmarterNJ is an open government initiative that uses new and innovative technology to meaningfully engage New Jerseyans. Your participation in SmarterNJ will allow us to create policies, programs and services that are more effective, more efficient, and more impactful for all New Jerseyans.");
    return data;
};
let replaceForCommunityFund = function (data) {
    return data.replace(/XmanifestPathX/g, "manifest_community_fund");
};
let replaceForCommunityFundFallback = function (data) {
    data = data.replace(/XappNameX/g, "The National Lottery Community Fund");
    data = data.replace(/XdescriptionX/g, "Now is the time for a conversation about how The National Lottery Community Fund can best support UK communities to prosper and thrive.");
    return data;
};
let replaceFromEnv = function (data) {
    return data.replace(/XmanifestPathX/g, process.env.YP_INDEX_MANIFEST_PATH
        ? process.env.YP_INDEX_MANIFEST_PATH
        : "manifest_yp");
};
let replaceFromEnvFallback = function (data) {
    data = data.replace(/XappNameX/g, process.env.YP_INDEX_APP_NAME
        ? process.env.YP_INDEX_APP_NAME
        : "Your Priorities");
    data = data.replace(/XdescriptionX/g, process.env.YP_INDEX_DESCRIPTION
        ? process.env.YP_INDEX_DESCRIPTION
        : "Citizen participation application");
    return data;
};
const plausibleCode = `
  <script defer data-domain="DATADOMAIN" src="https://plausible.io/js/plausible.js"></script>
  <script>window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>
`;
const getGA4Code = (tag) => {
    return `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${tag}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${tag}',  { 'anonymize_ip': true });
    </script>
  `;
};
const getPlausibleCode = (dataDomain) => {
    return plausibleCode.replace("DATADOMAIN", dataDomain);
};
const ziggeoHeaders = (ziggeoApplicationToken) => {
    return `
  <link rel="stylesheet" href="https://assets.ziggeo.com/v2-stable/ziggeo.css" />
  <script src="https://assets.ziggeo.com/v2-stable/ziggeo.js"></script>
  <script>
    var ziggeoApp = new ZiggeoApi.V2.Application({
      token:"${ziggeoApplicationToken}",
      webrtc_streaming_if_necessary: true,
      "video_profile": "r10c5c4a98bf3c636af176586ca911a0",
      recordingwidth: "1280",
      recordingheight: "720",
      webrtc_on_mobile: true,
      debug: true
    });
  </script>
`;
};
const getCollection = async (req) => {
    return await new Promise(async (resolve, reject) => {
        try {
            let collection;
            const { splitUrl, splitPath, id } = getSplitUrl(req);
            if (!isNaN(id)) {
                if (splitUrl[splitPath] === "domain") {
                    collection = req.ypDomain;
                }
                else if (splitUrl[splitPath] === "community") {
                    if (req.ypCommunity &&
                        req.ypCommunity.id &&
                        req.ypCommunity.name &&
                        req.ypCommunity.description) {
                        collection = req.ypCommunity;
                    }
                    else {
                        collection = await models.Community.findOne({
                            where: {
                                id: id,
                            },
                            attributes: ["id", "name", "description", "language"],
                        });
                    }
                }
                else if (splitUrl[splitPath] === "group") {
                    collection = await models.Group.findOne({
                        where: {
                            id: id,
                        },
                        attributes: ["id", "name", "objectives", "language"],
                    });
                }
                else if (splitUrl[splitPath] === "post") {
                    collection = await models.Post.findOne({
                        where: {
                            id: id,
                        },
                        attributes: ["id", "name", "description", "language"],
                    });
                }
                else {
                    resolve({ collection: req.ypDomain });
                }
                resolve({ collection });
            }
            else {
                resolve({ collection: req.ypDomain });
            }
        }
        catch (error) {
            reject(error);
        }
    });
};
const replaceSharingData = async (req, indexFileData) => {
    return await new Promise(async (resolve, reject) => {
        try {
            const { collection } = await getCollection(req);
            const sharingParameters = await getSharingParameters(req, collection, getFullUrl(req), "");
            indexFileData = indexFileData.replace(/XappNameX/g, sharingParameters.title);
            indexFileData = indexFileData.replace(/XdescriptionX/g, sharingParameters.description);
            indexFileData = indexFileData.replace(/Xogp:urlX/g, sharingParameters.url);
            indexFileData = indexFileData.replace(/Xogp:imageX/g, "");
            indexFileData = indexFileData.replace(/Xog:localeX/g, sharingParameters.locale);
            resolve(indexFileData);
        }
        catch (error) {
            reject(error);
        }
    });
};
let replaceWithHardCodedFallback = (req, indexFileData) => {
    if (req.hostname) {
        if (req.hostname.indexOf("betrireykjavik.is") > -1) {
            indexFileData = replaceForBetterReykjavikFallback(indexFileData);
        }
        else if (req.hostname.indexOf("betraisland.is") > -1) {
            indexFileData = replaceForBetterIcelandFallback(indexFileData);
        }
        else if (req.hostname.indexOf("smarter.nj.gov") > -1) {
            indexFileData = replaceForSmarterNJFallback(indexFileData);
        }
        else if (req.hostname.indexOf("puttingcommunitiesfirst.org.uk") > -1) {
            indexFileData = replaceForCommunityFundFallback(indexFileData);
        }
        else if (req.hostname.indexOf("parliament.scot") > -1) {
            indexFileData = replaceForParlScotFallback(indexFileData);
        }
        else if (req.hostname.indexOf("ypus.org") > -1) {
            indexFileData = replaceForYrpriFallback(indexFileData);
        }
        else if (req.hostname.indexOf("mycitychallenge.org") > -1) {
            indexFileData = replaceForMyCityChallengeFallback(indexFileData);
        }
        else if (req.hostname.indexOf("engagebritain.org") > -1) {
            indexFileData = replaceForEngageBritainFallback(indexFileData);
        }
        else if (req.hostname.indexOf("tarsalgo.net") > -1) {
            indexFileData = replaceForTarsalgoFallback(indexFileData);
        }
        else if (req.hostname.indexOf("junges.wien") > -1) {
            indexFileData = replaceForJungesWienFallback(indexFileData);
        }
        else if (req.hostname.indexOf("openmontana.org") > -1) {
            indexFileData = replaceForOpenMontanaFallback(indexFileData);
        }
        else if (req.hostname.indexOf("yrpri.org") > -1) {
            indexFileData = replaceForYrpriFallback(indexFileData);
        }
        else {
            indexFileData = replaceFromEnvFallback(indexFileData);
        }
    }
    else {
        indexFileData = replaceFromEnvFallback(indexFileData);
    }
    return indexFileData;
};
let indexCache = {
    newVersion: {
        data: null,
        lastModified: null
    },
    oldVersion: {
        data: null,
        lastModified: null
    }
};
async function replaceSiteData(indexFileData, req, useNewVersion) {
    if (process.env.ZIGGEO_ENABLED &&
        req.ypDomain.configuration.ziggeoApplicationToken) {
        indexFileData = indexFileData.replace('<html lang="en">', `<html lang="en">${ziggeoHeaders(req.ypDomain.configuration.ziggeoApplicationToken)}`);
    }
    if (req.ypDomain.configuration &&
        req.ypDomain.configuration.preloadCssUrl) {
        indexFileData = indexFileData.replace('<html lang="en">', `<html lang="en"><link rel="stylesheet" href="${req.ypDomain.configuration.preloadCssUrl}">`);
    }
    //TODO: Remove when old client app version is deprecated fully
    const plausibleReplaceKeyOld = `XplcX`;
    const ga4TagKeyOld = `Xga4X`;
    const plausibleReplaceKeyNew = `<meta name="XplcX" content="XplcX">`;
    const ga4TagKeyNew = `<meta name="Xga4X" content="Xga4X">`;
    const plausibleReplaceKey = useNewVersion ? plausibleReplaceKeyNew : plausibleReplaceKeyOld;
    if (req.ypDomain &&
        req.ypDomain.configuration &&
        req.ypDomain.configuration.plausibleDataDomains &&
        req.ypDomain.configuration.plausibleDataDomains.length > 5) {
        indexFileData = indexFileData.replace(plausibleReplaceKey, getPlausibleCode(req.ypDomain.configuration.plausibleDataDomains));
    }
    else {
        indexFileData = indexFileData.replace(plausibleReplaceKey, "");
    }
    const ga4TagKey = useNewVersion ? ga4TagKeyNew : ga4TagKeyOld;
    if (req.ypDomain &&
        req.ypDomain.configuration &&
        req.ypDomain.configuration.ga4Tag &&
        req.ypDomain.configuration.ga4Tag.length > 4) {
        indexFileData = indexFileData.replace(ga4TagKey, getGA4Code(req.ypDomain.configuration.ga4Tag));
    }
    else {
        indexFileData = indexFileData.replace(ga4TagKey, "");
    }
    if (req.hostname) {
        if (req.hostname.indexOf("betrireykjavik.is") > -1) {
            indexFileData = replaceForBetterReykjavik(indexFileData);
        }
        else if (req.hostname.indexOf("betraisland.is") > -1) {
            indexFileData = replaceForBetterIceland(indexFileData);
        }
        else if (req.hostname.indexOf("smarter.nj.gov") > -1) {
            indexFileData = replaceForSmarterNJ(indexFileData);
        }
        else if (req.hostname.indexOf("puttingcommunitiesfirst.org.uk") > -1) {
            indexFileData = replaceForCommunityFund(indexFileData);
        }
        else if (req.hostname.indexOf("parliament.scot") > -1) {
            indexFileData = replaceForParlScot(indexFileData);
        }
        else if (req.hostname.indexOf("ypus.org") > -1) {
            indexFileData = replaceForYrpri(indexFileData);
        }
        else if (req.hostname.indexOf("mycitychallenge.org") > -1) {
            indexFileData = replaceForMyCityChallenge(indexFileData);
        }
        else if (req.hostname.indexOf("engagebritain.org") > -1) {
            indexFileData = replaceForEngageBritain(indexFileData);
        }
        else if (req.hostname.indexOf("tarsalgo.net") > -1) {
            indexFileData = replaceForTarsalgo(indexFileData);
        }
        else if (req.hostname.indexOf("junges.wien") > -1) {
            indexFileData = replaceForJungesWien(indexFileData);
        }
        else if (req.hostname.indexOf("openmontana.org") > -1) {
            indexFileData = replaceForOpenMontana(indexFileData);
        }
        else if (req.hostname.indexOf("yrpri.org") > -1) {
            indexFileData = replaceForYrpri(indexFileData);
        }
        else {
            indexFileData = replaceFromEnv(indexFileData);
        }
    }
    else {
        log.warn("No req.hostname");
        indexFileData = replaceFromEnv(indexFileData);
    }
    try {
        indexFileData = await replaceSharingData(req, indexFileData);
    }
    catch (error) {
        log.error(`Error in index.html creation: ${error}`);
        try {
            indexFileData = replaceWithHardCodedFallback(req, indexFileData);
        }
        catch (error) {
            log.error(`Error in index.html creation: ${error}`);
        }
    }
    return indexFileData;
}
async function cacheIndexFile(filePath, versionKey) {
    try {
        const stats = await fs.promises.stat(filePath);
        const data = await fs.promises.readFile(filePath, "utf8");
        indexCache[versionKey].lastModified = stats.mtime.toUTCString();
        indexCache[versionKey].data = data;
    }
    catch (err) {
        console.error("Error caching index file:", err);
    }
}
let sendIndex = async (req, res) => {
    log.info("Index Viewed", { userId: req.user ? req.user.id : null });
    if (typeof req.useNewVersion === 'undefined') {
        log.error("req.useNewVersion is undefined. This should never happen. Check setupNewWebAppVersionHandling middleware.", {
            path: req.path,
            method: req.method,
            headers: req.headers,
            session: req.session
        });
        // Default to old version in this unexpected case
        req.useNewVersion = false;
    }
    let useNewVersion = req.useNewVersion;
    let versionKey = useNewVersion ? 'newVersion' : 'oldVersion';
    let indexFilePath = path.resolve(req.dirName, useNewVersion ? "../webAppsDist/client/dist/index.html" : "../webAppsDist/old/client/build/bundled/index.html");
    // Ensure the version file is cached
    if (!indexCache[versionKey].data || !indexCache[versionKey].lastModified) {
        await cacheIndexFile(indexFilePath, versionKey);
    }
    log.info(`Index file path: ${indexFilePath}`);
    try {
        let indexFileData = indexCache[versionKey].data;
        indexFileData = await replaceSiteData(indexFileData, req, useNewVersion);
        res.setHeader("Cache-Control", "no-cache, must-revalidate");
        res.setHeader("Last-Modified", indexCache[versionKey].lastModified);
        res.send(indexFileData);
    }
    catch (error) {
        log.error(`Error in index.html processing: ${error}`);
        res.status(500).send("Server error");
    }
};
async function initializeIndexCache() {
    try {
        await Promise.all([
            cacheIndexFile(path.resolve(__dirname, "../../webAppsDist/client/dist/index.html"), 'newVersion'),
            cacheIndexFile(path.resolve(__dirname, "../../webAppsDist/old/client/build/bundled/index.html"), 'oldVersion')
        ]);
        log.debug("Index cache initialized successfully");
    }
    catch (error) {
        log.error("Failed to initialize index cache", { error });
    }
}
if (!process.env.SKIP_INDEX_HTML_CACHE) {
    initializeIndexCache();
}
router.get("/", function (req, res) {
    sendIndex(req, res);
});
router.get("/domain{/*splat}", function (req, res) {
    sendIndex(req, res);
});
router.get("/organization{/*splat}", function (req, res) {
    sendIndex(req, res);
});
router.get("/community{/*splat}", function (req, res) {
    sendIndex(req, res);
});
router.get("/agent_bundle{/*splat}", function (req, res) {
    sendIndex(req, res);
});
router.get("/group{/*splat}", function (req, res) {
    sendIndex(req, res);
});
router.get("/post{/*splat}", function (req, res) {
    sendIndex(req, res);
});
router.get("/user{/*splat}", function (req, res) {
    sendIndex(req, res);
});
module.exports = router;
