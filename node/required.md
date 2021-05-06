# Module 结构

```js
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  this.filename = null;
  this.loaded = false;
  this.children = [];
}

module.exports = Module;

var module = new Module(filename, parent);
```

#  模块实例的 require 方法
> require 其实内部调用 Module._load 方法。
```js

Module._resolveFilename = function(request, parent) {

  // 第一步：如果是内置模块，不含路径返回
  if (NativeModule.exists(request)) {
    return request;
  }

  // 第二步：确定所有可能的路径
  var resolvedModule = Module._resolveLookupPaths(request, parent);
  var id = resolvedModule[0];
  var paths = resolvedModule[1];

  // 第三步：确定哪一个路径为真
  var filename = Module._findPath(request, paths);
  if (!filename) {
    var err = new Error("Cannot find module '" + request + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  }
  return filename;
};

Module._load = function(request, parent, isMain) {

  //  计算绝对路径
  var filename = Module._resolveFilename(request, parent);

  //  第一步：如果有缓存，取出缓存
  var cachedModule = Module._cache[filename];
  if (cachedModule) {
    return cachedModule.exports;

  // 第二步：是否为内置模块
  if (NativeModule.exists(filename)) {
    return NativeModule.require(filename);
  }

  // 第三步：生成模块实例，存入缓存
  var module = new Module(filename, parent);
  Module._cache[filename] = module;

  // 第四步：加载模块
  try {
    module.load(filename);
    hadException = false;
  } finally {
    if (hadException) {
      delete Module._cache[filename];
    }
  }

  // 第五步：输出模块的exports属性
  return module.exports;
};


Module.prototype.load = function(filename) {
  var extension = path.extname(filename) || '.js';
  if (!Module._extensions[extension]) extension = '.js';
  Module._extensions[extension](this, filename);
  this.loaded = true;
};

Module._extensions['.js'] = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8');
  module._compile(stripBOM(content), filename);
};


```