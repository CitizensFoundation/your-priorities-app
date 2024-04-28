"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (item) {
    if (item && typeof item.toJSON === 'function') {
        return item.toJSON();
    }
    else {
        return null;
    }
};
