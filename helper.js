/**
 * Check is object is empty
 * @param {Object} obj 
 */
exports.isEmptyObject = function(obj){
  return Object.keys(obj).length > 0 ? false : true;
}

