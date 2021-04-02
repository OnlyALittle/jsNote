# balbe
## 什么是babel ?
- Babel 是一个 JavaScript 编译器。他把最新版的javascript编译成当下可以执行的版本，
- 简言之，利用babel就可以让我们在当前的项目中随意的使用这些新最新的es6，甚至es7的语法。

## Babel的运行原理
### 解析
1. 词法分析（把字符串切成tokens）流
2. 语法分析（把令牌流转换成AST的形式）
- 使用`@babel/parser`解析代码，解析器为`babylon`
### 转换
- 转换器接收ast并对其进行遍历，在此过程中对节点进行添加、更新、移除
- 最终生成的还是AST
- 使用`@babel/traverse`库提供的方法维护这AST和自定义转换规则
### 生成
- BFS遍历整个AST，然后构建可以表示转换后代码的字符串
- 同时生成`source map`
- 使用`@babel/generator`将修改后的AST生成代码，在此过程中进行压缩、删除注释、`source map`


## 各个包的作用
- @babel/parser 编译语法树
- @babel/core 核心库
- @babel/generator 根据AST生成代码
- @babel/traverse 循环ast
- @babel/types 生成token对应的AST节点
- @babel/polyfill
  - 主要提供需要修改内置api(实例方法)才能达成的功能
  - 譬如：扩展Object.prototype，给上面加上assign方法，就属于修改内置API的范畴。
  - Babel 7.4.0后，这个包被弃用并被两个子包替代：core-js/stable（提供polyfill）和regenerator-runtime/runtime（提供generator和async方法，可以用runtime实现）。
- @babel/plugin-transform-runtime
  - 主要提供全局内置对象比如Promise、Set、Map，并将全局内置对象抽取成单独的模块，通过模块导入的方式引入，避免了对全局作用域的修改（污染）
- 综上所述： @babel/preset-env解决了polyfill的动态引入，@babel/plugin-transform-runtime 减少了内联插入的代码冗余。两者结合解决了polyfill 的引入问题。

## babel 相关执行顺序
- 插件在 Presets 前运行。 插件顺序从前往后排列。
- Preset 顺序是颠倒的（从后往前）。
- 例如：
```js
{
  "plugins": ["transform-decorators-legacy", "transform-class-properties"]
}

// 先执行 transform-decorators-legacy ，在执行 transform-class-properties。

// 重要的时，preset 的顺序是 颠倒的。如下设置：

{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}

// 将按如下顺序执行： 首先是 @babel/preset-react，然后是 @babel/preset-env。

```


## babel plugin 写法
```js
module.exports = {
	visitor: {
      Identifier(path) {
        const name = path.node.name;
        // reverse the name: JavaScript -> tpircSavaJ
        path.node.name = name
          .split("")
          .reverse()
          .join("");
      },
    },
}
```

## babel 包说明
- @babel/plugin-transform-runtime，
  - 解决了@babel/runtime导致的helper方法重复定义的问题。它采用引用的方法，将hepler从@babel/runtime包中引入，解决了重复定义。

## babel.config.js
```js
module.exports = {
  "presets": [
    [
      "@babel/preset-env"
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        'corejs': 3
      }
    ]
  ]
}
```

## babel的转译过程分为三个阶段：parsing、transforming、generating，以ES6代码转译为ES5代码为例，babel转译的具体过程如下：
- ES6代码输入
- babylon 进行解析得到 AST
- plugin 用 babel-traverse 对 AST 树进行遍历转译,得到新的AST树
- 用 babel-generator 通过 AST 树生成 ES5 代码
### 以es6转成es5为例：
- ES6代码输入 ==》 babylon进行解析 ==》 得到AST ==》 plugin用babel-traverse对AST树进行遍历转译 ==》 得到新的AST树 ==》 用babel-generator通过AST树生成ES5代码
