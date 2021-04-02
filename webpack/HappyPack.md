# HappyPack 原理
- HappyPack 的核心原理就是把这部分任务分解到多个进程去并行处理，从而减少了总的构建时间。
- 所有需要通过 Loader 处理的文件都先交给了 happypack/loader 去处理，收集到了这些文件的处理权后 HappyPack 就好统一分配了。
- 每通过 new HappyPack() 实例化一个 HappyPack 其实就是告诉 HappyPack 核心调度器如何通过一系列 Loader 去转换一类文件，并且可以指定如何给这类转换操作分配子进程。
- 核心调度器的逻辑代码在主进程中，也就是运行着 Webpack 的进程中，核心调度器会把一个个任务分配给当前空闲的子进程，子进程处理完毕后把结果发送给核心调度器，它们之间的数据交换是通过进程间通信 API 实现的。
- 核心调度器收到来自子进程处理完毕的结果后会通知 Webpack 该文件处理完毕。

# thread-loader
- 把 thread-loader 放置在其它 loader 之前，那么放置在这个 loader 之后的 loader 就会在一个单独的 worker 池中运行。
- 在 worker 池(worker pool)中运行的 loader 是受到限制的
  - 这些 loader 不能产生新的文件。
  - 这些 loader 不能使用定制的 loader API（也就是说，通过插件）。
  - 这些 loader 无法获取 webpack 的选项设置。

