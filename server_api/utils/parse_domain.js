const parseDomain = (urlPath) => {
  const results = {};
  const splitPath = urlPath.split(".");
  results.domain = splitPath[splitPath.length-2];
  results.tld = splitPath[splitPath.length-1];
  results.subdomain = urlPath.split('.'+results.domain+'.'+results.tld)[0];
  return results;
};

module.exports = parseDomain;