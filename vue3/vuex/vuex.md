# vuex
## Store
### constructor
- 初始化许多实例属性（其中最重要的为`this._modules = new ModuleCollection(options)`）
- 执行installModule函数
  - 初始化了根部module
  - 递归的注册了所有的子module
  - 把所有module的 `getter` 收集在了`this._wrappedGetters`
- 执行了`resetStoreState`函数，始化了 store 的 vm，并把 state，getter 变为了响应式的数据


### ModuleCollection
#### 主要是为了生成module
- 执行register
	- 通过`new Module(rawModule, runtime)`创建Module实例
	- 如果判断传入的rawModule有modules，则遍历modules，继续调用自身（register函数）
	- 通过path参数判断当前是否为根部 Module，如果是，则为 Module 实例的 root 属性绑定该 Module 实例，如果是子 Module，首先拿到父 Module，接着通过addChild方法建立父子关系，生成树状结构 Module。

### installModule
- 当前是根部 Module
- 当前是子 Module，并且 namespaced 为 true
- 当前是子 Module，并且 namespaced 不为 true
#### installModule主要做了
1. 首先定义了两个变量
   - isRoot 变量 => 通过第三个参数 path 数组的 length 来判断当前是否是根部 Module。
   - namespace 变量 => 通过store._modules.getNamespace(path)拿到对应 path 的 module 的访问路径（例如：modulesA/modulesB）
2. 通过makeLocalContext函数，拿到当前模块的 local（访问经过处理成完整路径的 mutation，action，state，getter）makeLocalContext(store, namespace, path)
- makeLocalContext执行
  - 定义 local 对象
  - 为 local 对象声明dispatch和commit。根据传入的namespace字段，决定当前环境（Module）的dispatch和commit在调用时的完整路径type，
    - 如果有namespace则type = namespace + type，这样当我们写 namespace 为 true 的 modules，则不需要在当前 Module 调用 commit 或 dispatch 时，书写完整路径
  - 通过Object.defineProperties为 local 对象声明getters和state的访问方式
  - 返回 local 对象
3. 通过registerMutation，registerAction，registerGetter，installModule，为当前 Module 实例注册Mutation，Action，Gette以及子Module
4. 如果是installModule执行的是子 Module，则会通过store._withCommit去设置 store 的 state，形成树形结构

### resetStoreState
1. 处理注册的getters，拿到注册的 key，和对应的回调函数，注册在 computed 对象上，并通过Object.defineProperty进行数据劫持，
2. `Object.defineProperty`拦截store.getters的get返回computed的计算结果


### state
- `Object.defineProperties`拦截state，拦截之后按照path去切
### getters
- 在`resetStoreState`中定义一个空的`computed`对象，在挂在上我们定义的getter函数
- 然后`Object.defineProperties`拦截get

### commit
- 解析参数
- 接着commit函数会通过this._mutations[type]（在registerMutation函数中通过）拿到对应的mutations函数，然后在_withCommit函数的包裹下，遍历执行
- _withCommit
  - 首先把全局的_committing置为了true，执行完，在设置回来
  - 为什么这么干，主要是为了让state的修改只有mutation触发
  - 在strict模式下，`enableStrictMode`中会开启一个watch，
  	```ts
	  	function enableStrictMode (store) {
			watch(function () { return store._state.data; }, 
			function () {
				assert(store._committing, "do not mutate vuex store state outside mutation handlers.");
			}, { deep: true, flush: 'sync' });
		}
	```

### dispatch
- 解析参数
- 去this._actions[type]中拿到对应的actions中注册的函数。和commit不同的是，他并不会直接执行，而是会先判断判断拿到的_actions[type]的length，如果是1则会执行，如果不是1，则会执行Promise.all(entry.map(handler => handler(payload)))，
- 这是因为actions在注册的时候会通过registerAction函数进行注册，registerAction函数中会判断传入的actions是否是一个promise如果不是promise，则会通过res = Promise.resolve(res)，把他变成一个promise，dispatch函数最终会返回一个

### mapState