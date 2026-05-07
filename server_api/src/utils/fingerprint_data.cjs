"use strict";

const INVALID_FINGERPRINT_VALUES = new Set(["", "undefined", "null"]);

const normalizeFingerprintValue = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const normalizedValue = String(value).trim();

  if (INVALID_FINGERPRINT_VALUES.has(normalizedValue.toLowerCase())) {
    return undefined;
  }

  return normalizedValue;
};

const normalizeFingerprintConfidence = (value) => {
  const normalizedValue = normalizeFingerprintValue(value);
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const getFingerprintDataFromBody = (body, prefix) => {
  const requestBody = body || {};
  const baseId = normalizeFingerprintValue(requestBody[`${prefix}BaseId`]);
  const valCode = normalizeFingerprintValue(requestBody[`${prefix}ValCode`]);
  const confidence = normalizeFingerprintConfidence(requestBody[`${prefix}Conf`]);

  return {
    browserId: baseId || valCode,
    browserFingerprint: valCode,
    browserFingerprintConfidence: confidence,
  };
};

module.exports = {
  getFingerprintDataFromBody,
  normalizeFingerprintValue,
};
