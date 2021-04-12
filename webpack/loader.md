# loader
## 说明

## 类型
- 后置（post）
- 普通
- 行内（写在require内的）
- 前置（pre）

## loader特殊配置
- `-!` 不要前置和普通loader 
- `!` 不要普通loader 
- `!!` 不要前置和普通loader，只要内联loader

## 执行顺序
### 在编译模块节点执行
1. 按照类型分组
2. 获得绝对路径
3. 根据特殊配置进一步拿到loader list
4. 先按顺序（从左往右）走pitch，之后反向回来挨个实现loader
5. pitch有返回就立即掉头
### loader 总是 从右到左被调用。有些情况下，loader 只关心 request 后面的 元数据(metadata)，并且忽略前一个 loader 的结果。在实际（从右到左）执行 loader 之前，会先 从左到右 调用 loader 上的 pitch 方法。
- 不同类型 loader 上的 pitch 方法执行的顺序为：
  - postLoader.pitch -> inlineLoader.pitch -> normalLoader.pitch -> preLoader.pitch
- 最终 loader 所执行的顺序对应为：
  - preLoader -> normalLoader -> inlineLoader -> postLoader


### 普通写法
```ts
const loaderUtils = require('loader-utils');
module.exports = function(source) {
	// 获取到用户给当前 Loader 传入的 options
	const options = loaderUtils.getOptions(this);
	// source 为 compiler 传递给 Loader 的一个文件的原内容
	// 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换


  return source;
};

// 多输出
// 通过 this.callback 告诉 Webpack 返回的结果
this.callback(null, source, sourceMaps);
// 当你使用 this.callback 返回内容时，该 Loader 必须返回 undefined，
// 以让 Webpack 知道该 Loader 返回的结果在 this.callback 中，而不是 return 中 
return;


```
### 异步写法
```ts
module.exports = function(source) {
    // 告诉 Webpack 本次转换是异步的，Loader 会在 callback 中回调结果
    var callback = this.async();
    someAsyncOperation(source, function(err, result, sourceMaps, ast) {
        // 通过 callback 返回异步执行后的结果
        callback(err, result, sourceMaps, ast);
    });
};
```

### 缓存加速
- this.cacheable(false);