const isValidDbId = (dbId) => {
  if (dbId) {
    try {
      if (typeof dbId === "string" && dbId.indexOf(".") > -1) {
        return false;
      } else {
        const id = parseInt(dbId);
        if (id) {
          return Number.isInteger(id);
        } else {
          return false;
        }
      }
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

module.exports = {
  isValidDbId
}
