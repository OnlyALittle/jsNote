# seo
## ssr
### 使用SSR权衡之处：
- 开发条件所限，浏览器特定的代码，只能在某些生命周期钩子函数 (lifecycle hook) 中使用；一些外部扩展库 (external library) 可能需要特殊处理，才能在服务器渲染应用程序中运行；
环境和部署要求更高，需要Node.js server 运行环境；
高流量的情况下，请准备相应的服务器负载，并明智地采用缓存策略。



## 预渲染
## 部分页面预渲染prerender-spa-plugin
## Phantomjs 针对爬虫做处理
- Phantomjs是一个基于webkit内核的无头浏览器，即没有UI界面，即它就是一个浏览器，只是其内的点击、翻页等人为相关操作需要程序设计实现。
- 这种解决方案其实是一种旁路机制，原理就是通过Nginx配置， 判断访问的来源UA是否是爬虫访问，如果是则将搜索引擎的爬虫请求转发到一个node server，再通过PhantomJS来解析完整的HTML，返回给爬虫。

```js
upstream spider_server {
 server localhost:3000;
}
 
server {
 listen  80;
 server_name example.com;
  
 location / {
  proxy_set_header Host   $host:$proxy_port;
  proxy_set_header X-Real-IP  $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 
  if ($http_user_agent ~* "Baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|bingbot|Sosospider|Sogou Pic Spider|Googlebot|360Spider") {
  proxy_pass http://spider_server;
  }
 }
}
```


### 优势：
- 完全不用改动项目代码，按原本的SPA开发即可，对比开发SSR成本小不要太多；
- 对已用SPA开发完成的项目，这是不二之选。
### 不足：
- 部署需要node服务器支持；
- 爬虫访问比网页访问要慢一些，因为定时要定时资源加载完成才返回给爬虫；
- 如果被恶意模拟百度爬虫大量循环爬取，会造成服务器负载方面问题，解决方法是判断访问的IP，是否是百度官方爬虫的IP。
