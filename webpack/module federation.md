# 模块联邦
- 可以较好的解决目前微前端框架不能解决的公共依赖加载的问题
### 模块联邦可以依赖一个远程的模块，这个依赖会在运行时剩下并不影响编译时。
### 这个被依赖的模块刚好可以作为微前端的一个独立模块

## 原理
- 宿主系统通过配置名称来引用远程模块
- 同时在编译阶段宿主系统时不需要了解远程模块的
- 仅仅在运行时通过加载远程模块的入口文件来实现



