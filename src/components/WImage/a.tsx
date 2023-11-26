/**
 * @Author QIANMINGLIANG
 * @Date 2023-11-02 10:53:09
 * @Description 请填写简介
 * @memo
 * @todo
 */

// import { request } from '@umijs/max';
// import { message } from 'antd';
import React from "react";
import { AnchorHTMLAttributes, useEffect, useState } from "react";

interface WaProps extends Omit<AnchorHTMLAttributes<any>, "children"> {
  children: string;
}
const extensionToMime = {
  // 图片
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  bmp: "image/bmp",
  webp: "image/webp",
  svg: "image/svg+xml",

  // 视频
  mp4: "video/mp4",
  ogv: "video/ogg",
  webm: "video/webm",

  // 音频
  mp3: "audio/mpeg",
  ogg: "audio/ogg",
  wav: "audio/wav",

  // 文档
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // 压缩文件
  zip: "application/zip",
  rar: "application/x-rar-compressed",
  tar: "application/x-tar",

  // 文本
  txt: "text/plain",
  rtf: "application/rtf",
  csv: "text/csv",

  // HTML
  html: "text/html",
  htm: "text/html",

  // JavaScript
  js: "application/javascript",

  // CSS
  css: "text/css",

  // JSON
  json: "application/json",

  // XML
  xml: "application/xml",
};
const Wa = (props: WaProps) => {
  const { href, children, download, ...rest } = props;
  // 先取download  然后再取children
  const fileName = download ?? children;
  const [hrefUrl, sethrefUrl] = useState<string>();
  useEffect(() => {
    if (href) {
      getSource(href).then(
        (res) => {
          sethrefUrl(res);
        },
        (err) => {
          // message.info(err);
        }
      );
    }
  }, [href]);
  const getBase64 = (data: any, type: BlobPropertyBag["type"]) => {
    // if (!type) {
    //     return Promise.reject('没有匹配的extensionToMime');
    // }
    return new Promise<string>((resolve, reject) => {
      const blob = new Blob([data], { type: type }); //类型一定要写！！！
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  /**
   * @description: 查询图片源
   */
  const getSource = (src: string) => {
    const extension = fileName.split(".").pop();
    if (!extension) {
      return Promise.reject("fileName解析失败");
    }
    if (!extensionToMime[extension as keyof typeof extensionToMime]) {
      return Promise.reject("不存在的文件格式");
    }
    return new Promise<string>((resolve, reject) => {
      fetch(src, {
        method: "GET",
        // responseType: 'blob',
      }).then(async (res) => {
        try {
          const base64 = await getBase64(
            res,
            extensionToMime[extension as keyof typeof extensionToMime]
          );
          resolve(base64);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  return (
    <a href={hrefUrl} download={fileName} {...rest}>
      {children}
    </a>
  );
};

export default Wa;
