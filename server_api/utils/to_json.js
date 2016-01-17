module.exports = function (item) {
  if (item) {
    return item.toJSON();
  } else {
    return null;
  }
};
