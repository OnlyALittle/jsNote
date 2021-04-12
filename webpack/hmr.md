# hmr

## 流程

### 服务端部分

- 创建实例
- 启动服务
- 配置中间件，用来提供编译产出的文件的静态文件服务
- 使用`socke.io`在浏览器端和服务端之间建立一个websocket长连接
  - 将 webpack 编译打包的各个阶段的状态信息告知浏览器端，浏览器端更加这些信息进行不同处理
  - 最主要的还是传新的模块hash值，发生hash值
- 添加webpack'done‘时间回调，在编译后向浏览器发消息
- webpack以监听模式开始编译	

### 客户端部分
-  先连socket
-  监听hash
-  上次没有hash（第一次）或者两次一致的话就赋值完事return
-  判断哪些变化了
-  向服务器发ajax，得到一个hot-update.json
-  通过jsonp请求新代码块
-  补丁js取回来后调用webpackHotupdate方法
-  循环该模块所有的parent，在所有用到的地方执行callback 