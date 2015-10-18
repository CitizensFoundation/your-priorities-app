/**
 * Filter items that begin with a specific letter
 * @param  {array} items  
 * @param  {string} letter
 * @return {array}
 */
PolymerExpressions.prototype.startsWith = function (items, letter) {
    var filtered = [];
    var letterMatch = new RegExp(letter, 'i');
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (letterMatch.test(item.name.substring(0, 1))) {
            filtered.push(item);
        }
    }
    return filtered;
};