exports.jsonParse = function(str) {
  let data
  try {
    data = JSON.parse(str)
  } catch(err) {
    data = null
  }
  return data
}