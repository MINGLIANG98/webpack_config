/**
 * @Author QIANMINGLIANG
 * @Date 2023-11-24 09:18:18
 * @Description 请填写简介
 * @memo
 * @todo
 */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
