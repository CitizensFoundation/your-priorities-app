/**
 * Reverse a supplied value
 * @param  {string} input
 * @return {string} reversed string
 */
PolymerExpressions.prototype.reverse = function (input) {
    input = input || '';
    var out = "";
    for (var i = 0; i < input.length; i++) {
        out = input.charAt(i) + out;
    }
    return out;
};