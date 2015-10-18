/**
 * Left trim a string, removing leading whitespace
 * @param  {string} input
 * @return {string} left trimmed string
 */
PolymerExpressions.prototype.ltrim = function(input){
	return input.replace(/^\s+/, '');
}