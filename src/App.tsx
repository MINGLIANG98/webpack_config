/**
 * @Author QIANMINGLIANG
 * @Date 2023-11-24 09:18:12
 * @Description 请填写简介
 * @memo
 * @todo
 */
import React, { Suspense, lazy, useEffect, useState } from "react";
import "./global.less";
import "./app.less";
import smallImg from "@/assets/5kb.png";
import bigImg from "@/assets/22kb.png";
import Demo1 from "./components/Demo1";
import Demo2 from "./components/Demo2";
import Table from './components/table'
// 魔法注释
// import(
//   /* webpackChunkName: "my-chunk-name" */ // 资源打包后的文件chunkname
//   /* webpackPrefetch: true */ // 开启prefetch预获取
//   /* webpackPreload: true */ // 开启preload预获取
//   './module'
// );
// prefetch
const PreFetchDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreFetchDemo" */
      /*webpackPrefetch: true*/
      "@/components/PreFetchDemo"
    )
);
// preload
const PreloadDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreloadDemo" */
      /*webpackPreload: true*/
      "@/components/PreloadDemo"
    )
);

function App() {
  const [count, setCounts] = useState("");
  const [show, setShow] = useState(false);

  const onClick = () => {
    setShow(true);
  };
  const onChange = (e: any) => {
    setCounts(e.target.value);
  };
  useEffect(() => {
    console.log(count);
    console.log('update');

    return () => {};
  }, [count]);

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
      <div className="smallImg"></div>
      <div className="bigImg"></div>
      <Table />
      <h2 onClick={onClick}>展示</h2>
      {/* show为true时加载组件 */}
      {show && (
        <>
          <Suspense fallback={null}>
            <PreloadDemo />
          </Suspense>
          <Suspense fallback={null}>
            <PreFetchDemo />
          </Suspense>
        </>
      )}
    </>
  );
}
export default App;
