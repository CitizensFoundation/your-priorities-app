module.exports = function (item) {
  if (item) {
    if (typeof item.toJSON === "function") {
      return item.toJSON();
    } else {
      return item;
    }
  } else {
    return null;
  }
};
