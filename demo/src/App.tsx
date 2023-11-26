/**
 * @Author QIANMINGLIANG
 * @Date 2023-11-24 09:18:12
 * @Description 请填写简介
 * @memo
 * @todo
 */
import React, { useState } from "react";
import "./global.less";
import smallImg from "@/assets/5kb.png";
import bigImg from "@/assets/22kb.png";
function App() {
  const [count, setCounts] = useState("");
  const onChange = (e: any) => {
    setCounts(e.target.value);
  };
  return (
    <>
      <img src={smallImg} alt="" />
      {/* <h2>webpack5+react+ts</h2> */}
      <p>受控组件</p>
      <input type="text" value={count} onChange={onChange} />
      <br />
      <p>非受控组件</p>
      <input type="text" />
    </>
  );
}
export default App;
