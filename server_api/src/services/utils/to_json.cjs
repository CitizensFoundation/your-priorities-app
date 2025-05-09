module.exports = function (item) {
  if (item && typeof item.toJSON === 'function') {
    return item.toJSON();
  } else {
    return null;
  }
};
