# optimization.splitChunks

## cacheGroups
### chunks
- initial: 对于匹配文件，非动态模块打包进该vendor,动态模块优化打包
- async: 对于匹配文件，动态模块打包进该vendor,非动态模块不进行优化打包
- all: 匹配文件无论是否动态模块，都打包进该vendor