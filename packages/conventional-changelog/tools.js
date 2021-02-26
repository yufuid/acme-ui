const _ = require('lodash')

exports.functionify = function (strOrArr) {
  if (strOrArr && !_.isFunction(strOrArr)) {
    return (a, b) => {
      let str1 = ''
      let str2 = ''
      if (Array.isArray(strOrArr)) {
        for (const key of strOrArr) {
          str1 += a[key] || ''
          str2 += b[key] || ''
        }
      } else {
        str1 += a[strOrArr]
        str2 += b[strOrArr]
      }
      return str1.localeCompare(str2)
    }
  } else {
    return strOrArr
  }
}

exports.sequenceArray = function (originArr, sequence, transferFn) {
  if (!Array.isArray(originArr) || !Array.isArray(sequence)) return originArr;
  
  let temp = {};
  
  originArr.forEach((a) => {
    const v = _.isFunction(transferFn) ? transferFn(a) : a;
    const key = sequence.includes(v) ? v : '';
    if (Array.isArray(temp[key])) {
      temp[key].push(a)
    } else {
      temp[key] = [a];
    }
  })
  let result = sequence.map(s => temp[s] || []);

  result.push(temp[''] || [])
  
  return result;
}