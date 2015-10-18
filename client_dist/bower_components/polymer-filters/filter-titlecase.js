/**
 * Return a title-cased version of the input
 * @param  {string} input 
 * @return {string}
 */
PolymerExpressions.prototype.titlecase = function (input) {
    var words = input.split(' ');
    for (var i = 0; i < words.length; i++) {
        var ret = words[i].toLowerCase();
        words[i] = ret.charAt(0).toUpperCase() + ret.slice(1);
    }
    return words.join(' ');
}