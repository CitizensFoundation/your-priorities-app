"use strict";
module.exports = (input, length, killwords, end) => {
    if (!input)
        return '';
    var orig = input;
    length = length || 255;
    if (input.length <= length)
        return input;
    if (killwords) {
        input = input.substring(0, length);
    }
    else {
        var idx = input.lastIndexOf(' ', length);
        if (idx === -1) {
            idx = length;
        }
        input = input.substring(0, idx);
    }
    input += (end !== undefined && end !== null) ? end : '...';
    return input;
};
