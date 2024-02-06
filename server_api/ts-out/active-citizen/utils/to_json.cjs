"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (item) {
    if (item) {
        return item.toJSON();
    }
    else {
        return null;
    }
};
