# webpack如何识别CommonJs模块

```ts
var __webpack_modules__ = ({});
// The module cache
var __webpack_module_cache__ = {};

// The require function
// webpack内部的模块引用函数
function __webpack_require__(moduleId) {
	// Check if module is in cache
	// 判断是否在缓存中
	if(__webpack_module_cache__[moduleId]) {
		return __webpack_module_cache__[moduleId].exports;
	}
	// Create a new module (and put it into the cache)
	// 创建一个新的modul
	var module = __webpack_module_cache__[moduleId] = {
		// no module.id needed
		// no module.loaded needed
		exports: {}
	};

	// Execute the module function
	// 执行模块函数
	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

	// Return the exports of the module
	return module.exports;
}

```

# webpack如何识别es模块

```ts
// 简化代码
__webpack_require__.r(__webpack_exports__);
var a = __webpack_require__("./components/component10k.js");
var b = __webpack_require__.n(a);

// __webpack_require__.r
// 给模块的exports对象加上ES Harmony规范的标记
__webpack_require__.r = (exports) => {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};

// __webpack_require__.n
// 传入了一个模块，返回一个getter方法，此处是一个高阶函数的应用，
// 实现的功能是当模块的__esModule属性为真时，返回一个getDefault( )方法，否则返回getModuleExports( )方法.
__webpack_require__.n = (module) => {
	var getter = module && module.__esModule ?
		() => (module['default']) :
		() => (module);
	__webpack_require__.d(getter, { a: getter });
	return getter;
};

```