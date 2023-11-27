/**
 * @Author: QIANMINGLIANG
 * @Date: 2023-11-24 09:21:09
 * @Description: 请填写简介
 * @memo:
 * @todo:
 */


// 在webpack配置文件中使用require而不是import的原因涉及到Node.js和Webpack的工作方式以及模块系统的加载机制。
// Webpack配置文件实际上是在Node.js环境中执行的，而Node.js在运行时对CommonJS模块规范提供了原生的支持。因此，使用require是一种符合Node.js模块加载机制的自然方式。
// 另一方面，import语句是ECMAScript 6（ES6）模块的一部分，它是浏览器环境中的一种模块加载机制。在浏览器中，Webpack将使用import语句，但在Webpack配置文件中，Node.js环境更为自然，因此通常使用require。
// 如果想使用 es6模块规范 则需要使用babel对配置文件进行转译
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackBar = require('webpackbar');
const isDev = process.env.NODE_ENV === "development"; // 是否是开发模式

// 链接：https://juejin.cn/post/7111922283681153038
module.exports = {
  // 入口文件
  entry: path.join(__dirname, "../src/index.tsx"),
  // 打包文件出口
  output: {
    // 可用占位符
    // ext	文件后缀名
    // name	文件名
    // path	文件相对路径
    // folder	文件所在文件夹
    // hash	每次构建生成的唯一 hash 值
    // chunkhash	根据 chunk 生成 hash 值
    // contenthash	根据文件内容生成hash 值

    // ??webpack打包的hash分三种
    // hash：跟整个项目的构建相关,只要项目里有文件更改,整个项目构建的hash值都会更改,并且全部文件都共用相同的hash值
    // chunkhash：不同的入口文件进行依赖文件解析、构建对应的chunk,生成对应的哈希值,文件本身修改或者依赖文件修改,chunkhash值会变化
    // contenthash：每个文件自己单独的 hash 值,文件的改动只会影响自身的 hash 值
    // 配置输出的js文件的名称   对于其他静态资源（例如 CSS、图片、视频等） 由各自的loader控制
    filename: 'static/js/[name].[chunkhash:8].js', // // 加上[chunkhash:8]
    path: path.join(__dirname, "../dist"), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
  },
  cache: {
    // 使用文件缓存 优化下次打包的构建时间
    type: "filesystem",
  },
  module: {
    // rules
    //  倒叙执行rules数组 
    // 会根据文件后缀来倒序遍历rules数组，如果文件后缀和test正则匹配到了，就会使用该rule中配置的loader依次对文件源代码进行处理，最终拿到处理后的sourceCode结果
    rules: [
      // include：只解析该选项配置的模块
      // exclude：不解该选项配置的模块,优先级更高
      // 解析 ts tsx
      {
        // 只对项目src目录下的ts,tsx进行loader解析
        include: [path.resolve(__dirname, '../src')],
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: [
          // 开启多线程
          // 使用时,需将此 loader 放置在其他 loader 之前。放置在此 loader 之后的 loader 会在一个独立的 worker 池中运行。
          "thread-loader",
          {
            loader: "babel-loader",
            options: {
              // 执行顺序数组由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
              presets: [
                [
                  "@babel/preset-env",
                  {
                    // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
                    // "targets": {
                    //  "chrome": 35,
                    //  "ie": 9
                    // },
                    useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
                    corejs: 3, // 配置使用core-js低版本
                  },
                ],
                // 这条babel对.ts文件无效
                "@babel/preset-react", // 执行顺序2
                "@babel/preset-typescript", // 执行顺序1
              ],
              plugins: [
                // 如果是开发模式,就启动react热更新插件  tip：在不需要刷新浏览器的前提下模块热更新,并且能够保留react组件的状态。
                // pmmmwh/react-refresh-webpack-plugin 插件的底层依赖
                isDev && require.resolve("react-refresh/babel"),
              ].filter(Boolean), //过滤空值
            },
          },
        ],
      },
      // 解析 jsx js
      // 如果node_moduels中也有要处理的语法，可以把js|jsx文件配置加上
      {
        test: /.(js|jsx)$/,
        use: ["babel-loader"],
      },
      // 解析 css
      {
        test: /.\css$/, //匹配所有的 css 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          'css-loader',
          // 'postcss-loader'
        ]
      },
      // 解析less
      {
        test: /.\less$/, //匹配所有的 less 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          'css-loader',
          // 'postcss-loader',
          'less-loader'
        ]
      },
      // 对于图片文件,webpack4使用file-loader和url-loader来处理的,
      // 但webpack5不使用这两个loader了,而是采用自带的asset-module来处理
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            // 较小的资源转base64 可以直接嵌入代码中 不用像大文件一样生成单独的文件
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        // 通过generator选项来配置asset模块类型的文件（如图片）的输出文件名。
        generator: {
          filename: 'static/images/[name].[contenthash:8][ext]' // 加上[contenthash:8]
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]', // 加上[contenthash:8]
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/media/[name].[contenthash:8][ext]", // 文件输出目录和命名
        },
      },
    ],
  },
  resolve: {
    /**
     * extensions是webpack的resolve解析配置下的选项，
     * 在引入模块时不带文件后缀时，会来该配置数组里面依次添加后缀查找文件，
     * 因为ts不支持引入以 .ts, tsx为后缀的文件，所以要在extensions中配置，
     * 而第三方库里面很多引入js文件没有带后缀，所以也要配置下js
     */
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    // 别名
    alias: {
      "@": path.join(__dirname, "../src"),
    },
    // 如果用的是pnpm 就暂时不要配置这个，会有幽灵依赖的问题，访问不到很多模块。
    modules: [path.resolve(__dirname, '../node_modules')], // 查找第三方模块只在本项目的node_modules中查找
  },
  plugins: [
    // webpack需要把最终构建好的静态资源都引入到一个html文件中,这样才能在浏览器中运行,html-webpack-plugin就是来做这件事情的
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"), // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
    new webpack.DefinePlugin({
      // 配置后会把值注入到业务代码里面去
      "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV),
    }),
    // 进度条
    new WebpackBar({
      // color: "#85d",  // 默认green，进度条颜色支持HEX
      basic: false,   // 默认true，启用一个简单的日志报告器
      profile:false,  // 默认false，启用探查器。
    })
  ],
};
