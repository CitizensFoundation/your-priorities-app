"use strict";

const MAX_FRAUD_IDS_TO_DELETE = 1000;

const validActionTypes = new Set(["get-items", "delete-one-item", "delete-items"]);
const validCollectionTypes = new Set([
  "endorsements",
  "ratings",
  "pointQualities",
  "points",
  "posts",
]);
const commonMethods = new Set([
  "byIpFingerprint",
  "byMissingBrowserFingerprint",
  "byIpAddress",
]);
const postMethods = new Set([
  ...commonMethods,
  "byIpFingerprintPostId",
  "byIpUserAgentPostId",
]);
const pointMethods = new Set([
  ...commonMethods,
  "byIpFingerprintPointId",
  "byIpUserAgentPointId",
]);

const normalizeIdValue = (value) => {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  } else if (typeof value === "string") {
    const trimmedValue = value.trim();
    if (!/^[1-9]\d*$/.test(trimmedValue)) {
      return null;
    }

    const parsedValue = Number(trimmedValue);
    return Number.isSafeInteger(parsedValue) ? parsedValue : null;
  } else {
    return null;
  }
};

const validateIdsToDelete = (idsToDelete) => {
  if (idsToDelete === undefined || idsToDelete === null) {
    return { idsToDelete: [] };
  }

  if (!Array.isArray(idsToDelete)) {
    return {
      error: "invalid_ids_to_delete",
      idsToDelete: [],
    };
  }

  if (idsToDelete.length > MAX_FRAUD_IDS_TO_DELETE) {
    return {
      error: "too_many_ids_to_delete",
      idsToDelete: [],
    };
  }

  const seenIds = new Set();
  const normalizedIds = [];

  for (let i = 0; i < idsToDelete.length; i++) {
    const normalizedId = normalizeIdValue(idsToDelete[i]);

    if (!normalizedId) {
      return {
        error: "invalid_ids_to_delete",
        idsToDelete: [],
      };
    }

    if (!seenIds.has(normalizedId)) {
      seenIds.add(normalizedId);
      normalizedIds.push(normalizedId);
    }
  }

  return { idsToDelete: normalizedIds };
};

const normalizeIdsToDelete = (idsToDelete) => {
  return validateIdsToDelete(idsToDelete).idsToDelete;
};

const getValidMethodsForCollectionType = (collectionType) => {
  if (collectionType === "pointQualities") {
    return pointMethods;
  } else if (collectionType === "posts") {
    return commonMethods;
  } else {
    return postMethods;
  }
};

const validateFraudActionRequest = ({
  type,
  selectedMethod,
  collectionType,
  idsToDelete,
}) => {
  if (!validActionTypes.has(type)) {
    return {
      error: "invalid_fraud_action_type",
      idsToDelete: [],
    };
  }

  if (!validCollectionTypes.has(collectionType)) {
    return {
      error: "invalid_fraud_collection_type",
      idsToDelete: [],
    };
  }

  const validMethods = getValidMethodsForCollectionType(collectionType);
  if (!validMethods.has(selectedMethod)) {
    return {
      error: "invalid_fraud_detection_method",
      idsToDelete: [],
    };
  }

  const idsValidation = validateIdsToDelete(idsToDelete);
  const normalizedIdsToDelete = idsValidation.idsToDelete;

  if (idsValidation.error) {
    return idsValidation;
  }

  if (
    (type === "delete-one-item" || type === "delete-items") &&
    normalizedIdsToDelete.length === 0
  ) {
    return {
      error: "delete_requires_ids",
      idsToDelete: normalizedIdsToDelete,
    };
  }

  if (type === "delete-one-item" && normalizedIdsToDelete.length !== 1) {
    return {
      error: "single_delete_requires_one_id",
      idsToDelete: normalizedIdsToDelete,
    };
  }

  if (
    selectedMethod === "byMissingBrowserFingerprint" &&
    (type === "delete-items" || normalizedIdsToDelete.length > 1)
  ) {
    return {
      error: "bulk_delete_missing_fingerprint_disabled",
      idsToDelete: normalizedIdsToDelete,
    };
  }

  return {
    idsToDelete: normalizedIdsToDelete,
  };
};

module.exports = {
  MAX_FRAUD_IDS_TO_DELETE,
  normalizeIdsToDelete,
  validateFraudActionRequest,
  validateIdsToDelete,
};
