# 一、Object.defineProperty
- 检测不到对象属性的添加和删除
- 数组API方法无法监听到
- 需要对每个属性进行遍历监听，如果嵌套对象，需要深层监听，造成性能问题
- 所以在Vue2中，增加了set、delete API，并且对数组api方法进行一个重写

## Object.defineProperty 与Proxy
- Object.defineProperty只能劫持对象的属性， 而Proxy是直接代理对象
  - 由于Object.defineProperty只能劫持对象属性，需要遍历对象的每一个属性，如果属性值也是对象，就需要递归进行深度遍历。
  - 但是Proxy直接代理对象， 不需要遍历操作

- Object.defineProperty对新增属性需要手动进行Observe
  - 因为Object.defineProperty劫持的是对象的属性，所以新增属性时，需要重新遍历对象， 对其新增属性再次使用Object.defineProperty进行劫持。也就是Vue2.x中给数组和对象新增属性时，需要使用$set才能保证新增的属性也是响应式的, $set内部也是通过调用Object.defineProperty去处理的。


