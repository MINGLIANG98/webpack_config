/**
 * @Author: QIANMINGLIANG
 * @Date: 2023-11-24 09:21:16
 * @Description: 请填写简介
 * @memo: 
 * @todo: 
 */
// webpack.dev.js
const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// 合并公共配置,并添加开发环境配置
module.exports = merge(baseConfig, {
    mode: 'development', // 开发模式,打包更加快速,省了代码优化步骤
    // 源码映射方式
    // devtool的命名规则为 ^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        port: 3000, // 服务端口号
        compress: false, // gzip压缩,开发环境不开启,提升热更新速度
        hot: true, // 开启热更新，后面会讲react模块热替换具体配置
        historyApiFallback: true, // 解决history路由404问题
        static: {
            directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
        },
        // 关闭控制台上面的输出
        client: {
            logging: 'error',//只打印报错，其实只要这个配置就好了
            overlay: {  //有报错发生，直接覆盖浏览器视窗，显示错误
                errors: true,
                warnings: false,
            },
        },
    },
    plugins: [
        // React热更新插件 依赖于react-refesh
        new ReactRefreshWebpackPlugin(), // 添加热更新插件
    ]
})
