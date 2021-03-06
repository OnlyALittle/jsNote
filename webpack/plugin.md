# plugin
## 写法
```js

class PublishPlugin {
	apply(compiler) {
		compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {})
	}
}
```