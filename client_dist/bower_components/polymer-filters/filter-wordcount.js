/**
 * Calculates word-count for a given string
 * @param  {string} str
 * @return {integer}
 */
PolymerExpressions.prototype.wordcount = function(input){
	var words = (input) ? input.match(/\w+/g) : null;
    return (words) ? words.length : null;
}

