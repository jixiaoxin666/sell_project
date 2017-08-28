/**
 * Created by abby on 2017/8/25.
 */
// 工具类方法
// 解析url参数
// @example ?id=12345&a=b
// @return Object {id: 12345,a:b}
export function urlParse() {
  let url = window.location.search; // 得到类似这种的字符串 "?id=12345&a=b"
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  // @example arr= ['?id=12345', '&a=b']
  let arr = url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      // decodeURIComponent 解密函数 encodeURIComponent加密函数
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
};
