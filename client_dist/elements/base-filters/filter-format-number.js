PolymerExpressions.prototype.formatNumber = function (value) {
    if (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return "";
    }
};
