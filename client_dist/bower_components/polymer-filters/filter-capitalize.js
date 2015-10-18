/**
 * Capitalize a string (transform its first letter to uppercase and the rest to lowercase)
 * @param  {string} string
 * @return {string} the capitalized string
 */
PolymerExpressions.prototype.capitalize = function (string) {
	string = string.toLowerCase();
	return string.charAt(0).toUpperCase() + string.slice(1);
};