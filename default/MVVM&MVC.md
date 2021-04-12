# MVVM和MVC的区别

- 主要就是MVC中Controller演变成MVVM中的viewModel。

- MVVM主要解决了MVC中大量的DOM操作使页面渲染性能降低，加载速度变慢，影响用户体验。

当和Model频繁发生变化，开发者需要主动更新到View。 

# MVVM设计模式的缺点
1.  数据绑定也使得bug很难被调试。
    - 比如你看到页面异常了，有可能是你的View的代码有bug，也可能是你的model的代码有问题。
    - 数据绑定使得一个位置的Bug被快速传递到别的位置，要定位原始出问题的地方就变得不那么容易了。
2.  数据双向绑定不利于代码重用。
    - 客户端开发最常用的是View，但是数据双向绑定技术，让你在一个View都绑定了一个model，不同的模块model都不同。那就不能简单重用view了
3.  一个大的模块中model也会很大，虽然使用方便了也很容易保证数据的一致性，但是长期持有，不释放内存就造成话费更多的内存。
