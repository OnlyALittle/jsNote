# balbe
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
  - 主要提供全局内置对象比如Promise、Set、Map，并将全局内置对象抽取成单独的模块，通过模块导入的方式引入，避免了对全局作用域的修改（污染）。

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
