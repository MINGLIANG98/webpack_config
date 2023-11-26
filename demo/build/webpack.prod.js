/**
 * @Author: QIANMINGLIANG
 * @Date: 2023-11-24 09:21:33
 * @Description: 请填写简介
 * @memo: 
 * @todo: 
 */
// webpack.prod.js
const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(baseConfig, {
    mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
    plugins: [
        // 复制文件插件  
        new CopyPlugin({
            patterns: [
                {
                    // 将public文件夹下除了index.html的其他文件拷贝到dist根目录下
                    from: path.resolve(__dirname, '../public'), // 复制public下文件
                    to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
                    filter: source => {
                        return !source.includes('index.html') // 忽略index.html
                    }
                },
            ],
        }),
    ]
})
