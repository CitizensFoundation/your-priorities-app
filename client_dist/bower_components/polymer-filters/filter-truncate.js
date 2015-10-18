/**
 * Return a truncated version of a string
 * @param  {string} input     
 * @param  {integer} length   
 * @param  {boolean} killwords 
 * @param  {string} end       
 * @return {string}           
 */
PolymerExpressions.prototype.truncate = function (input, length, killwords, end) {
    var orig = input;
    length = length || 255;

    if (input.length <= length)
        return input;

    if (killwords) {
        input = input.substring(0, length);
    } else {
        var idx = input.lastIndexOf(' ', length);
        if (idx === -1) {
            idx = length;
        }

        input = input.substring(0, idx);
    }

    input += (end !== undefined && end !== null) ? end : '...';
    return input;
};