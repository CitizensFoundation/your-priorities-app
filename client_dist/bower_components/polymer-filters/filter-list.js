/**
 * Transform an array of strings into a readable list
 * @param  {array} input 
 * @return {string} array elements delimited by a comma
 */
PolymerExpressions.prototype.list = function(input, space){
  return input.join("," + (space || ""));
};