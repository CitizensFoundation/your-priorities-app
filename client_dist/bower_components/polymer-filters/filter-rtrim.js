/**
 * Right trim a string, removing trailing whitespace
 * @param  {string} input
 * @return {string} left trimmed string
 */
PolymerExpressions.prototype.rtrim = function(input){
	return input.replace(/\s+$/, '');
}