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

module.exports = {
  convertEnpty: convertEnpty
}