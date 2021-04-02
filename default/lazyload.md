# lazyout
## 判断是否出现在可视区域内
- 通过获取元素的`getBoundingClientRect`属性的top值和页面的`clientHeight`进行对比
- 如果top值小于`clientHeight`，则说明元素出现在可视区域了。
- `getBoundingClientRect`是获取某个元素相对于视窗的位置集合

> 这里的`getBoundingClientRect`需要注意下它拿到的bottom、和right；bottom指顶部到元素底部，right是左到元素右部

## Intersection Observer
  - 弥补上一个方法中需要监听scroll的情况，`Intersection Observer`可以不用监听scroll事件，做到元素一可见便调用回调，在回调里面我们来判断元素是否可见。

## 图片懒加载
- 让我们html中需要懒加载的img标签的src设置缩略图或者不设置src，然后自定义一个属性（如data-src），值为真正的图片或者原图的地址（比如下面的）；
- 监听滚动等，判断是否在可视区域，设置元素的src属性值为真正图片的地址。