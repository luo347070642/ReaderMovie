/**
   * data 参数对象
   * callback data不为null时调用
   * nullCallback data为空时调用
   */
function convertEnpty(data, callback, nullCallback) {
  if (data) {
    callback && callback();
  } else {
    nullCallback && nullCallback();
  };
}

function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;
}

module.exports = {
  convertEnpty: convertEnpty,
	convertToStarsArray:convertToStarsArray
}