/**
 * Limit displayed items from an array at an offset by a limit
 * 
 * @param  {array} input
 * @param  {integer} offset
 * @param  {integer} limit
 * @return {array}      
 */
PolymerExpressions.prototype.limitFrom = function (input, offset, limit) {
    if (!(input instanceof Array) && !(input instanceof String)) return input;

    limit = parseInt(limit, 10);

    if (input instanceof String) {
        if (limit) {
            return limit >= 0 ? input.slice(offset, limit) : input.slice(limit, input.length);
        } else {
            return "";
        }
    }

    var out = [],
        i, n;

    if (limit > input.length)
        limit = input.length;
    else if (limit < -input.length)
        limit = -input.length;

    if (limit > 0) {
        i = offset;
        n = limit;
    } else {
        i = input.length + limit;
        n = input.length;
    }

    for (; i < n; i++) {
        out.push(input[i]);
    }

    return out;
};