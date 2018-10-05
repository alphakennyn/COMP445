/**
 * Check is object is empty
 * @param {Object} obj 
 */
exports.isEmptyObject = function(obj){
  console.log(Object.keys(obj).length)
  return Object.keys(obj).length > 0 ? false : true;
}

