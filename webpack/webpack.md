# 什么是 webpack
## webpack是一个静态模块打包器，在处理时他会递归的构建依赖关系图，然后将这些模块逐次打包

## 优化webpack打包速度
- 优化loader；缩小文件处理范围
- cacheDirectory，缓存loader执行结果
- 减少后缀的匹配
- noParse：loader不去解析哪些库
- thread-loader

## 优化打包产出
- 图片压缩，小图片压缩为base64
- bundle加hash
- 懒加载
- 提取公共chunk
- 配置CDN
- IgnorePlugin：忽略第三方包指定目录，不打包入chunk
- 配置production
- externals：不打包第三方包