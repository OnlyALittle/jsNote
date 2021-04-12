# Service Workers
## Service Workers 是一个在浏览器后台运行的脚本，它生命周期完全独立于网页。
- 它无法直接访问 DOM，但可以通过 postMessage 接口发送消息来和 UI 进程通信。 
- 拦截网络请求是 Service Workers 的一个重要功能，通过它能完成离线缓存、编辑响应、过滤响应等功能。


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




