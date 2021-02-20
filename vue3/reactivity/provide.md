# [provide/inject](https://v3.cn.vuejs.org/api/composition-api.html#provide-inject)

## provide
- 默认情况下一个组件的provides是继承自父组件
- 但是如果需要在自己的provides中注入内容时
- 需要创建一个原型指向父组件provides的对象来注入

#### provides继承父组件的代码：
```ts
// runtime-core/component.ts
const instance: ComponentInternalInstance = {
  // ...,
  provides: parent ? parent.provides : Object.create(appContext.provides),
  // ...,
};
```

## inject

### 需要注意的是in的使用，in操作符是会向原型链上去查找的，非常符合inject的定义
```ts
if (provides && (key as string | symbol) in provides) {
	// TS doesn't allow symbol as index type
	return provides[key as string]
} 
```

----
### 为什么要默认继承父组件的provides？
在真实的项目中我们的组件树深度会变得非常大，如果在根组件注入了一些内容，每一层组件都去创建一个provides这笔性能开销也是很大的， 而且在每次创建provides都会以父组件的provides作为原型，如果每层都创建这会造成原型链变得非常的冗长，直接影响到inject取数据的性能； 所以基于这些原因Vue3在处理provides时会优先采取直接继承拿到引用。