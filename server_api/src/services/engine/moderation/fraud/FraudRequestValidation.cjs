"use strict";

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

const normalizeIdsToDelete = (idsToDelete) => {
  return Array.isArray(idsToDelete) ? idsToDelete : [];
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
  const normalizedIdsToDelete = normalizeIdsToDelete(idsToDelete);

  if (!validActionTypes.has(type)) {
    return {
      error: "invalid_fraud_action_type",
      idsToDelete: normalizedIdsToDelete,
    };
  }

  if (!validCollectionTypes.has(collectionType)) {
    return {
      error: "invalid_fraud_collection_type",
      idsToDelete: normalizedIdsToDelete,
    };
  }

  const validMethods = getValidMethodsForCollectionType(collectionType);
  if (!validMethods.has(selectedMethod)) {
    return {
      error: "invalid_fraud_detection_method",
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
  normalizeIdsToDelete,
  validateFraudActionRequest,
};
