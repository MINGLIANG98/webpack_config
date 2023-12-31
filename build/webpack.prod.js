/**
 * @Author: QIANMINGLIANG
 * @Date: 2023-11-24 09:21:33
 * @Description: 请填写简介
 * @memo:
 * @todo:
 */
// webpack.prod.js
const path = require("path");
const { merge } = require("webpack-merge");
const globAll = require("glob-all");
const baseConfig = require("./webpack.base.js");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
module.exports = merge(baseConfig, {
    mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化   Tree Shaking 主要依赖于 ES6 模块的静态特性
    /**
     * antd是由es模块语法编写的所以可以支持默认treeshaking
     * lodash为了良好的浏览器兼容性, 它使用了旧版es5的模块语法; 而lodash-es则使用了es6的模块语法, 这让webpack之类的打包工具可以对其进行tree shake以删除为使用的代码来优化打包尺寸.
     * 对于lodash这种es5模块语法的插件  可以替换为它的es6模块版本 或者使用 babel-plugin-import来进行处理
     * https://juejin.cn/post/6926850164015497229
     **/
    plugins: [
        // 复制文件插件
        new CopyPlugin({
            patterns: [
                {
                    // 将public文件夹下除了index.html的其他文件拷贝到dist根目录下
                    from: path.resolve(__dirname, "../public"), // 复制public下文件
                    to: path.resolve(__dirname, "../dist"), // 复制到dist目录中
                    filter: (source) => {
                        return !source.includes("index.html"); // 忽略index.html
                    },
                },
            ],
        }),
        // 抽离css插件
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:8].css", // 抽离css的输出目录和名称
        }),
        // 清理无用css
        new PurgeCSSPlugin({
            // 检测src下所有tsx文件和public下index.html中使用的类名和id和标签名称
            // 只打包这些文件中用到的样式
            paths: globAll.sync([
                `${path.join(__dirname, "../src")}/**/*.tsx`,
                path.join(__dirname, "../public/index.html"),
            ]),
            // 白名单
            safelist: {
                standard: [/^ant-/], // 过滤以ant-开头的类名，哪怕没用到也不删除
            },
        }),
        /**
         * 优先级大于nginx gzip压缩配置
         * Nginx 会检查请求的文件是否已经被压缩。如果请求的文件已经是压缩格式（如 .gz 文件），而且浏览器发送了相应的头信息（Accept-Encoding: gzip 等），Nginx 就不会再对这个文件进行压缩
         * **/
        new CompressionPlugin({
            test: /.(js|css)$/, // 只生成css,js压缩文件
            filename: "[path][base].gz", // 文件命名
            algorithm: "gzip", // 压缩格式,默认是gzip
            test: /.(js|css)$/, // 只生成css,js压缩文件
            threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
            minRatio: 0.8, // 压缩率,默认值是 0.8  //nginx配置的默认压缩率是0.7
        }),
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(), // 压缩css
            // ...
            // 设置mode为production时,webpack会使用内置插件terser-webpack-plugin压缩js文件,该插件默认支持多线程压缩,
            // 但是上面配置optimization.minimizer压缩css后,js压缩就失效了,需要手动再添加一下,
            // webpack内部安装了该插件,由于pnpm解决了幽灵依赖问题,如果用的pnpm的话,需要手动再安装一下依赖。
            new TerserPlugin({
                // 压缩js
                parallel: true, // 开启多线程压缩
                terserOptions: {
                    compress: {
                        pure_funcs: ["console.log"], // 删除console.log
                    },
                },
            }),
        ],
        // 使用场景：
        // 一般第三方包的代码变化频率比较小,可以单独把node_modules中的代码单独打包,
        // 当第三包代码没变化时,对应chunkhash值也不会变化,可以有效利用浏览器缓存，
        // 还有公共的模块也可以提取出来,避免重复打包加大代码整体体积。
        // 作用：
        // splitChunks 的主要作用是将公共的代码部分拆分成单独的文件，以便更好地利用浏览器的缓存机制，提高应用的加载性能。
        splitChunks: {
            // https://medium.com/naukri-engineering/mastering-webpack-splitchunks-plugin-tips-and-tricks-14be89f7a9e2
            // 分隔代码
            minSize: 17000, //生成chunk的最小大小
            minRemainingSize: 0,
            // 如果 minRemainingSize 设置为 0，表示剩余部分可以是任何大小。
            // 如果 minRemainingSize 设置为一个正数，表示剩余部分的大小至少为这个数值。
            minChunks: 2,//最少被引用2次的代码才会被拆分处理
            maxAsyncRequests: 30, //按需加载时的最大并行请求数。
            maxInitialRequests: 30,//入口点处的最大并行请求数。
            automaticNameDelimiter: "_",//自动生成的块名称之间的分隔符。
            enforceSizeThreshold: 30000,//强制执行拆分的阈值。当拆分的块大小超过这个值时，即使不符合其他条件，也会执行拆分。
            cacheGroups: {
                /**
                 * 缓存组
                 * key不重复即可
                 * {
                 * test: 用于指定匹配的模块路径的正则表达式。符合条件的模块会被纳入到当前的缓存组中。
                 * name: 定义拆分出的包的名称。可以使用 [name]、[id]、[chunkhash] 等占位符。
                 * priority: 用于指定缓存组的优先级。优先级高的缓存组会优先匹配模块。
                 * chunks: 定义哪些类型的代码块可以被拆分，可以是 'initial'、'async'、'all' 等。
                 * minSize: 定义生成的代码块的最小大小，小于该大小的模块不会被拆分。
                 * minChunks: 定义被拆分的模块至少要在多少个 chunk 中被引用才会被拆分。
                 * maxAsyncRequests: 定义按需加载时的最大并行请求数。
                 * maxInitialRequests: 定义入口点的最大并行请求数。
                 * reuseExistingChunk: 如果当前的 chunk 包含的模块已经被拆分出去了，是否复用已有的 chunk。
                 * enforce: 定义缓存组的行为是否强制执行。如果为 true，则无论是否满足条件都会创建一个新的 chunk。
                 * }
                 */
                vendors: { // 提取node_modules代码
                    test: /node_modules/, // 只匹配node_modules里面的模块
                    name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加 通过output
                    // name(module) {
                    //     // get the name. E.g. node_modules/packageName/not/this/part.js
                    //     // or node_modules/packageName
                    //     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                    //     // npm package names are URL-safe, but some servers don't like @ symbols
                    //     return `npm.${packageName.replace('@', '')}`;
                    // },
                    minChunks: 1, // 只要使用一次就提取出来
                    chunks: "initial", // 只提取初始化就能获取到的模块,不管异步的
                    minSize: 0, // 提取代码体积大于0就提取出来
                    priority: 1, // 提取优先级为1
                    reuseExistingChunk: true,
                },
                commons: {
                    // 提取页面公共代码
                    name: "commons", // 提取文件命名为commons
                    minChunks: 2, // 只要使用两次就提取出来  将页面中被使用两次(minChunks)以上的公共模块打包成一个文件（commons.js）
                    chunks: "initial", // 只提取初始化就能获取到的模块,不管异步的
                    minSize: 0, // 提取代码体积大于0就提取出来
                    reuseExistingChunk: true, //表示是否重用已存在的块
                    priority: -1,
                },
                reactPackage: {
                    test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
                    name: "vendor_react",
                    chunks: "all",
                    priority: 10,//优先级最高   //优先级从大到小匹配 优先匹配数值大的
                },
            },
            // memo:将来自node_modules目录下的模块打包成一个文件（vendors.js），将页面中被使用两次(minChunks)以上的公共模块打包成一个文件（commons.js）。
        },
    },
});
