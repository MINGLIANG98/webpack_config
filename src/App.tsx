/**
 * @Author QIANMINGLIANG
 * @Date 2023-11-24 09:18:12
 * @Description 请填写简介
 * @memo
 * @todo
 */
import React, { useEffect, useState } from "react";
import "./global.less";
import smallImg from "@/assets/5kb.png";
import bigImg from "@/assets/22kb.png";
import Demo1 from "./components/Demo1";
import Demo2 from "./components/Demo2";
function App() {
  const [count, setCounts] = useState("");
  const onChange = (e: any) => {
    setCounts(e.target.value);
  };
  useEffect(() => {
    console.log(count);
    // console.log('update');
    
    return () => {
    }
  }, [count])
  
  return (
    <>
      <img src={smallImg} alt="" />
      {/* <h2>webpack5+react+ts</h2> */}
      <p>受控组件</p>
      <input type="text" value={count} onChange={onChange} />
      <br />
      <p>非受控组件</p>
      <input type="text" className="input" /> 
      <Demo1 />
    </>
  );
}
export default App;
