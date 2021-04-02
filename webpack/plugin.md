# plugin
## 写法
```js
class BasicPlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler){
	// 监听名称为 compilation 的事件，参数是广播时传的
    compiler.plugin('compilation',function(compilation) {
    })
	
	// 广播出事件，params 为附带的参数
	compiler.apply('event-name',params);
  }
}

// 导出 Plugin
module.exports = BasicPlugin;

// 使用
// const BasicPlugin = require('./BasicPlugin.js');
// module.export = {
//   plugins:[
//     new BasicPlugin(options),
//   ]
// }

```

## Compiler 和 Compilation
- Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息
  - 这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；
- Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。
  - 当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。
  - Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。
- Compiler 和 Compilation 的区别在于：
  - Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。

## 常用 API

### 读取输出资源、代码块、模块及其依赖
- emit广播，`compilation.chunks`
### 监听文件变化
- watch-run

### 修改输出资源
- emit广播，`compilation.assets`