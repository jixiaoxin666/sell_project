/**
 * Created by abby on 2017/8/25.
 */
// 存到本地
export function saveToLocal(id, key, value) {
  // 双下划线__一般表示私有的
  // localStorage都会存储成json格式
  let seller = window.localStorage.__seller__;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    // JSON.parse用于从一个字符串中解析出json对象
    // @example
    // var str = '{"name":"huangxiaojian","age":"23"}'
    // JSON.parse(str)
    // => Object {name: "huangxiaojian", age: "23"}
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  // JSON.stringify把原来是对象的类型转换成字符串类型（或者更确切的说是json类型的)
  // @example
  // var obj={webName:"脚本之家",url:"jb51.net",age:"2"}
  // var str=JSON.stringify(obj)
  // => "{"webName":"脚本之家","url":"jb51.net","age":"2"}"
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);
};

// 从本地取数据
// def 默认值
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__;
  console.log('00');
  console.log(id);
  console.log(seller);
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  } else {
    let ret = seller[key];
    return ret || def;
  }
}
