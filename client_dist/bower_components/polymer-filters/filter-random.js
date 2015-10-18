/**
 * Return a random item in a supplied array
 * @param  {array} array 
 * @return {item}
 */
PolymerExpressions.prototype.random = function(array){
	return array[Math.floor(Math.random() * array.length)];
}