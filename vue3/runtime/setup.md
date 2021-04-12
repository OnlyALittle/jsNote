# setup

## setupComponent
- `initProps`、 `initSlots`
- 执行`setupStatefulComponent`

## setupStatefulComponent
1. 初始化accessCache缓存
2. 创建一个组件的渲染上下文代理，相当于vue2的this
```ts
instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers)
```
3. 调用 setup()
4. 按需创建setup第二个参数 上下文 `createSetupContext`
5. 设置 `currentInstance`，调用setup	
6. 处理setup执行结果
   - promise
     -  ssr下，等待promise返回再处理setup执行结果	
     -  client端 等待再次进入，保存异步依赖 `instance.asyncDep`
   - 其他情况执行`handleSetupResult`
7. 如果没有setup，执行 `finishComponentSetup`

## PublicInstanceProxyHandlers
### 代理渲染上下文
- proxy 拦截get
  - 形成一个对组件数据 setup --> data --> ctx --> props --> globalProperties 这样优先级的一个代理，
  - 同时缓存每个 key 值对应的是哪个数据来源以加速二次访问，`accessCache`。
- set
  - 形成一个对组件数据 setup --> data --> props --> ctx --> globalProperties 这样优先级的一个代理
- has 
  - 可以是用`accessCache`加速

## handleSetupResult
- 执行setup
```ts
// 如果返回的是函数则视作返回了一个内联的render函数
instance.render = setupResult as InternalRenderFunction;
// 返回的是对象，模板可绑定内容，直接reactive
instance.setupState = reactive(setupResult);
// 继续处理
finishComponentSetup(instance, isSSR);
```

## finishComponentSetup
```ts
// 1. ssr, 挂载render
if (Component.render) {
	instance.render = Component.render as InternalRenderFunction;
}
// 2. 如果instance上没有render，有模板无render，进行编译（带编译器版本）
// 同时标记是运行时编译产生的
 Component.render = compile(Component.template, 。。。);
(Component.render as InternalRenderFunction)._rc = true;
instance.render = (Component.render || NOOP) as InternalRenderFunction;
// 2.2 由于运行时编译的render函数采用的是with语法来获取对象，需要不同的代理handler，设置instance.withProxy 
```