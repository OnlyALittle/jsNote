## WebAssembly
#### WebAssembly(为了书写方便，简称Wasm)是一种新的编码方式，可以在现代的网络浏览器中运行 
#### 它是一种低级的类汇编语言，具有紧凑的二进制格式，可以接近原生的性能运行，并为诸如C / C ++等语言提供一个编译目标，以便它们可以在Web上运行。它也被设计为可以与JavaScript共存，允许两者一起工作。

### 编译和优化
1. 由于 WebAssembly 的输入类型是固定的（byte），所以不需要通过运行代码这种方式去检查输入类型来进行编译优化；
2. 在 JavaScript 中相同一段代码可能因为输入值不同需要分别编译成不同的版本，而 WebAssembly 也不需要进行这种冗余的操作，原因如上；
3. WebAssembly 在从高级语言（C/C++/Rust）编译而来的时候，已经经过编译器优化一次了，所以在 JITs 中需要做的事情更少；
4. WebAssembly 输入值固定，JITs 不需要在每次代码执行时去计算输入值的类型，从而不会发生重优化这样的事情。

### 执行
1. WebAssembly 是由编译器编译出来的，是直接针对机器产生的代码，会包含更多对机器性能优异的指令（instructions），这部分差异针对不同的功能代码 WebAssembly 可能会比 JavaScript 快 10%~800%。

### 垃圾回收
1. WebAssembly 不支持自动垃圾回收，内存由代码手动管理

### 总结
1. WebAssembly 代码更小的体积；
2. 解码 WebAssembly 比解析转译 JavaScript 用的时间更少；
3. 优化 WebAssembly 的用时比优化 JavaScript 的更短，因为前者是已经经过一次编译优化并且面向机器的代码；
4. WebAssembly 没有重优化这个过程；
5. WebAssembly 包含对机器更友好的指令；
6. JavaScript 无法人为控制垃圾回收，而 WebAssembly 可以有效控制内存回收的时机；
