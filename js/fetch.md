
# XMLHTTPRequest、fetch
```js
var xhr = new XMLHttpRequest();
xhr.open('GET', url)
xhr.responseType = 'application/json'
xhr.onload = function(params) {
	console.log(xhr.response)
}
xhr.onerror = function(e) {
	console.log(e)
}
xhr.send();

fetch(url).then(response => response.json())
```
- 区别
  - fetch是promise的
  - fetch不管请求处理成功与否，都会触发resolve；
  - fetch只有在当网络故障导致发送失败或者跨域时才会catch


## 问题
1. fetch 发送 2 次请求的原因
- fetch 发送 post 请求的时候，总是发送 2 次，第一次状态码是 204，第二次才成功? 
- 原因很简单，因为你用 fetch 的 post 请求的时候，导致 fetch 第一次发送了一个 Options 请求，询问服务器是否支持修改的请求头，
- 如果服务器支持，则在第二次中发送真正的 请求。

