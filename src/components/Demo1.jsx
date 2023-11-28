/*
 * @Author: QIANMINGLIANG
 * @Date: 2023-11-26 23:15:52
 * @Description: 请填写简介
 * @memo:
 */
import { Input } from "antd";
import React, { useEffect } from "react";
function Demo1() {
  // var obj = {};
  // var value = 1;

  // Object.defineProperty(obj, "num", {
  //   get: function () {
  //     console.log("执行了 get 操作");
  //     return value;
  //   },
  //   set: function (newValue) {
  //     console.log("执行了 set 操作");
  //     value = newValue;
  //   },
  // });
  class Archiver {
    constructor() {
      var value = null;
      // archive n. 档案
      var archive = [];

      Object.defineProperty(this, "num", {
        get: function () {
          console.log("执行了 get 操作");
          return value;
        },
        set: function (value) {
          console.log("执行了 set 操作");
          value = value;
          archive.push({ val: value });
          return value;
        },
      });
      this.getArchive = function () {
        return archive;
      };
    }
    show(){
    
    }
    a
  }

  var arc = new Archiver();
  console.log(arc);
  arc.num; // 执行了 get 操作
  arc.num = 11; // 执行了 set 操作
  arc.num = 13; // 执行了 set 操作
  console.log(arc);
  console.log(arc.getArchive()); // [{ val: 11 }, { val: 13 }]

  //  对象 obj 拥有属性 num，值为 1
  // useEffect(() => {
  //   console.log(obj);
  //   console.log(value);
  //   return () => {};
  // }, [obj, value]);

  const handleChange = (e) => {
    let v = e.target.value;
    // obj.num = v;
    // console.log(value);
    // console.log(obj.num);
  };
  return (
    <h3>
      <Input onChange={handleChange} />
    </h3>
  );
}
export default Demo1;
