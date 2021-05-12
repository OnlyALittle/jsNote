# Web Workers
## Web Worker 是HTML5标准的一部分，这一规范定义了一套 API，它允许一段JavaScript程序运行在主线程之外的另外一个线程中
## Web Worker 规范中定义了两类工作线程
- 专用线程Dedicated Worker，只能为一个页面所使用
- 共享线程 Shared Worker，Shared Worker则可以被多个页面所共享。


## Dedicated Worker( Worker 对象创建的)

### 典型的应用场景
- 强大的计算能力
  - 可以加载一个JS进行大量的复杂计算而不挂起主进程，并通过postMessage，onmessage进行通信，解决了大量计算对UI渲染的阻塞问题。
- 数学运算
  - Web Worker最简单的应用就是用来做后台计算，对CPU密集型的场景再适合不过了。
- 图像处理
  - 通过使用从`<canvas>`中获取的数据，可以把图像分割成几个不同的区域并且把它们推送给并行的不同Workers来做计算，对图像进行像素级的处理，再把处理完成的图像数据返回给主页面。
- 大数据的处理
  - 目前mvvm框架越来越普及，基于数据驱动的开发模式也越愈发流行，未来大数据的处理也可能转向到前台，这时，将大数据的处理交给在Web Worker也是上上之策了吧。

### 创建方法
1. 普通模式，传入URI `new Worker("my_task.js");`
2. URL.createObjectURL()创建URL对象
   1. 这样，就可以结合NEJ、Webpack进行模块化管理、打包了。
3. 传入 Worker 构造函数的参数 URI 必须遵循同源策略
4. Worker线程的创建的是异步的，主线程代码不会阻塞在这里等待worker线程去加载、执行指定的脚本文件，而是会立即向下继续执行后面代码。

### Worker线程数据通讯方式
- Worker 与其主页面之间的通信是通过 onmessage 事件和 postMessage() 方法实现的。
- 数据传输使用的是数据拷贝的方式，如果要转移数据控制权，可以使用buffer

### 引入脚本
- importScripts()
  - 该函数接受0个或者多个URI作为参数。
  - 浏览器加载并运行每一个列出的脚本，脚本的下载顺序不固定，但执行时会按照传入 importScripts() 中的文件名顺序进行。
  - 如果脚本无法加载，将抛出 NETWORK_ERROR 异常，之前执行的代码依然能够运行
- importScripts() 之后的函数声明依然会被保留，因为它们始终会在其他代码之前运行。

### Worker上下文
1. self
2. location
3. close
4. importScripts
5. XMLHttpRequest
6. setTimeout/setInterval以及addEventListener/postMessage
7. terminate()

### 错误处理
#### myWorker.onerror
- 收到一个实现了 ErrorEvent 接口名为 error的事件。
- 该事件不会冒泡，并且可以被取消；
- 为了防止触发默认动作，worker 可以调用错误事件的 preventDefault() 方法。
- 错误事件有三个实用的属性：filename - 发生错误的脚本文件名；lineno - 出现错误的行号；以及 message - 可读性良好的错误消息。


```js
// function 1
var myWorker = new Worker("my_task.js");
// function 2
var blob = new Blob([myTask]); // myTask 是my_task.js文件的字符串
var myWorker = new Worker(window.URL.createObjectURL(blob));


// 对worker发出的信息
myWorker.postMessage(data);
// 监听从worker中发出的信息
myWorker.onmessage = function (e) {
    var data = e.data;
    console.log('page:', data); // page: [1, 2, 3, "hello"]
    console.log('arr:', arr); // arr: [1, 2, 3]
};

//  转移数据控制权
var uInt8Array = new Uint8Array(1024*1024*32); // 32MB
myWorker.postMessage(uInt8Array.buffer, [uInt8Array.buffer]);



// my_task.js中的代码 
var i = 0;
function timedCount(){
    i = i+1;
    // 对主线程发出的信息
    myWorker.postMessage(data);
    postMessage(i);
    setTimeout(timedCount, 1000);
}
timedCount();

// 监听从主线程中发出的信息
// self.onmessage
self.addEventListener('message', function (e) {
    var data = e.data;
    console.log('worker:', data);
})

```

# Service Workers
## Service Workers 是一个在浏览器后台运行的脚本，它生命周期完全独立于网页。
- 它无法直接访问 DOM，但可以通过 postMessage 接口发送消息来和 UI 进程通信。 
- 拦截网络请求是 Service Workers 的一个重要功能，通过它能完成离线缓存、编辑响应、过滤响应等功能。
- 由事件驱动的,具有生命周期
- 可以访问cache和indexDB
- 支持推送
- 它设计为完全异步，同步API（如XHR和localStorage）不能在service worker中使用
- 出于安全考量，Service workers只能由HTTPS承载


## 离线缓存
```js
if ('serviceWorker' in navigator) {
	/* 当页面加载完成就创建一个serviceWorker */
	window.addEventListener('load', function () {
		/* 创建并指定对应的执行内容 */
		/* scope 参数是可选的，可以用来指定你想让 service worker 控制的内容的子目录。 在这个例子里，我们指定了 '/'，表示 根网域下的所有内容。这也是默认值。 */
		navigator.serviceWorker.register('./sw.js', {scope: './'})
			.then(function (registration) {

				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			})
			.catch(function (err) {

				console.log('ServiceWorker registration failed: ', err);
			});
	});
}
// sw.js
// 当前缓存版本的唯一标识符，用当前时间代替
var cacheKey = new Date().toISOString();

// 当前缓存白名单，在新脚本的 install 事件里将使用白名单里的 key
var cacheWhitelist = [cacheKey];

// 需要被缓存的文件的 URL 列表
var cacheFileList = [
  '/index.html',
  'app.js',
  'app.css'
];

// 监听 install 事件
self.addEventListener('install', function (event) {
  // 等待所有资源缓存完成时，才可以进行下一步
  event.waitUntil(
    caches.open(cacheKey).then(function (cache) {
      // 要缓存的文件 URL 列表
      return cache.addAll(cacheFileList);
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // 去缓存中查询对应的请求
    caches.match(event.request).then(function (response) {
        // 如果命中本地缓存，就直接返回本地的资源
        if (response) {
          return response;
        }
        // 否则就去用 fetch 下载资源
        return fetch(event.request);
      }
    )
  );
});

// 新 Service Workers 线程取得控制权后，将会触发其 activate 事件
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          // 不在白名单的缓存全部清理掉
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 删除缓存
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

